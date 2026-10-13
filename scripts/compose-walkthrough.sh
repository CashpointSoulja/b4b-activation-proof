#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
voice_only=false
if [[ "${1:-}" == "--narration-only" ]]; then
  voice_only=true
  final_file="${2:?Supply the narration draft WAV destination}"
else
  capture_dir="${1:?Supply the completed public capture directory}"
  final_file="${2:?Supply the final MP4 destination}"
  capture_dir="$(cd "$capture_dir" && pwd)"
fi
mkdir -p "$(dirname "$final_file")" "$repo_dir/work/walkthrough"
final_file="$(realpath -m "$final_file")"
if [[ -e "$final_file" ]]; then
  echo "Refusing to overwrite an existing deliverable: $final_file" >&2
  exit 1
fi
for dependency in python3 ffmpeg ffprobe; do command -v "$dependency" >/dev/null || { echo "Missing $dependency" >&2; exit 1; }; done
if ! ffmpeg -nostdin -hide_banner -filters 2>/dev/null | grep ' flite ' >/dev/null; then
  echo 'A free local FFmpeg speech synthesizer is required; no paid voice fallback is used.' >&2
  exit 1
fi
task_dir="$(mktemp -d "$repo_dir/work/walkthrough/compose.XXXXXX")"
trap 'rm -rf "$task_dir"' EXIT
python3 - "$repo_dir/docs/walkthrough.md" "$task_dir" <<'PY'
import json, pathlib, re, sys
source=pathlib.Path(sys.argv[1]).read_text()
match=re.search(r'<!-- NARRATION_JSON_START -->\s*```json\s*([\s\S]*?)```',source)
if not match: raise SystemExit('Narration source is missing')
scenes=json.loads(match.group(1)); start=0
with (pathlib.Path(sys.argv[2])/'scenes.tsv').open('w') as table:
    for index,scene in enumerate(scenes):
        if scene['start'] != start: raise SystemExit('Scenes must be contiguous')
        start+=scene['duration']
        stem=f'scene-{index:02d}'
        (pathlib.Path(sys.argv[2])/(stem+'.txt')).write_text(scene['narration'])
        table.write(f"{stem}\t{scene['duration']}\n")
    if start !=105: raise SystemExit('Narration must total exactly105 seconds')
(pathlib.Path(sys.argv[2])/'scenes.json').write_text(json.dumps(scenes))
PY

cd "$task_dir"
while IFS=$'\t' read -r stem seconds; do
  ffmpeg -nostdin -hide_banner -loglevel error -f lavfi -i "flite=textfile=${stem}.txt:voice=slt" -ar 48000 -ac 1 "${stem}-raw.wav"
  take_seconds="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${stem}-raw.wav")"
  tempo="$(python3 - "$take_seconds" "$seconds" <<'PY'
import sys
actual,slot=map(float,sys.argv[1:]); tempo=max(1,actual/(slot-.65))
if tempo>1.35: raise SystemExit(f'Narration take needs excessive speed ({tempo:.2f}); shorten the narration')
print(f'{tempo:.8f}')
PY
)"
  scene_samples="$((seconds * 48000))"
  ffmpeg -nostdin -hide_banner -loglevel error -i "${stem}-raw.wav" -af "atempo=${tempo},loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000,apad,atrim=end_sample=${scene_samples},asetpts=PTS-STARTPTS" -ar 48000 -ac 1 "${stem}.wav"
  printf "file '%s.wav'\n" "$stem" >> narration-concat.txt
done < scenes.tsv
ffmpeg -nostdin -hide_banner -loglevel error -f concat -safe 0 -i narration-concat.txt -c:a pcm_s16le -ar 48000 -ac 1 narration.wav
python3 - narration.wav <<'PY'
import sys,wave
with wave.open(sys.argv[1]) as voice:
    if voice.getframerate()!=48000 or voice.getnframes()!=105*48000:
        raise SystemExit('Narration alignment must be exactly105 seconds at48000 Hz')
PY

if "$voice_only"; then
  cp narration.wav "$final_file"
  printf 'Narration draft only; no public walkthrough has been recorded: %s\n' "$final_file"
  exit 0
fi

python3 - "$capture_dir" "$task_dir" <<'PY'
import hashlib,json,pathlib,sys,urllib.parse
capture=pathlib.Path(sys.argv[1]); task=pathlib.Path(sys.argv[2])
manifest=json.loads((capture/'capture.json').read_text())
plan=json.loads((task/'scenes.json').read_text())
url=urllib.parse.urlparse(manifest.get('url',''))
if manifest.get('kind')!='actual-public-https-ui' or manifest.get('completed') is not True:
    raise SystemExit('Only a completed actual public HTTPS UI capture can be composed')
if url.scheme!='https' or not url.hostname or url.username or url.password:
    raise SystemExit('Public HTTPS capture provenance is missing')
if url.hostname.lower() in ('localhost','127.0.0.1','::1'):
    raise SystemExit('Local footage is refused')
if manifest.get('width')!=720 or manifest.get('height')!=1280 or manifest.get('targetDuration')!=105:
    raise SystemExit('The capture must be 720x1280 and planned for105 seconds')
recorded=manifest.get('scenes',[])
if len(recorded)!=len(plan) or [s['id'] for s in recorded]!=[s['id'] for s in plan]:
    raise SystemExit('Capture does not contain every planned UI scene')
for done,wanted in zip(recorded,plan):
    if done['start']!=wanted['start'] or done['duration']!=wanted['duration']:
        raise SystemExit('Capture scene timing differs from the narration plan')
    if 'actionCompletedSeconds' not in done or not (capture/done['checkpointScreenshot']).is_file():
        raise SystemExit('Capture scene checkpoint is missing')
exports={s.get('control') for s in manifest.get('downloads',[])}
if not {'export-json','export-csv'} <= exports: raise SystemExit('Both actual exports are required')
raw=(capture/manifest['rawFile']).resolve()
if raw.parent!=capture.resolve() or not raw.is_file(): raise SystemExit('Raw public recording is missing')
if hashlib.sha256(raw.read_bytes()).hexdigest()!=manifest.get('rawSha256'):
    raise SystemExit('Raw public capture checksum differs from its provenance manifest')
offset=float(manifest['trimStartSeconds'])
if offset<0 or float(manifest['rawDuration'])<offset+104.9: raise SystemExit('Capture duration is incomplete')
(task/'raw-path.txt').write_text(str(raw))
(task/'trim-offset.txt').write_text(str(offset))
PY
raw_file="$(cat raw-path.txt)"
trim_offset="$(cat trim-offset.txt)"
# Preserve elapsed browser time first. Never trim a sparse browser WebM before fps normalization.
ffmpeg -nostdin -hide_banner -loglevel error -i "$raw_file" -vf 'fps=30,setsar=1' -r 30 -fps_mode cfr -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p normalized-public-ui.mp4
ffmpeg -nostdin -hide_banner -loglevel error -ss "$trim_offset" -i normalized-public-ui.mp4 -i narration.wav -map 0:v:0 -map 1:a:0 -t 105 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -fps_mode cfr -c:a aac -b:a 192k -movflags +faststart -metadata title='Ayo Ahmed — Independent concept: B4B Activation Proof' -metadata comment='Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.' "$final_file"
python3 - "$final_file" <<'PY'
import json,subprocess,sys
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',sys.argv[1]]))
video=next(s for s in probe['streams'] if s['codec_type']=='video')
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
if (video['width'],video['height'],video['r_frame_rate'])!=(720,1280,'30/1'):
    raise SystemExit('Final portrait frame or constant frame rate check failed')
if abs(float(probe['format']['duration'])-105)>.05: raise SystemExit('Final duration check failed')
if audio['codec_name']!='aac': raise SystemExit('Final narration audio is missing')
PY
mkdir -p "$capture_dir/review"
python3 - "$task_dir/scenes.json" > review-times.tsv <<'PY'
import json,sys
scenes=json.load(open(sys.argv[1]))
for scene in scenes:
    print(f"{scene['id']}-middle\t{scene['start']+scene['duration']/2}")
    if scene['start']:
        print(f"{scene['id']}-before-boundary\t{scene['start']-.2}")
        print(f"{scene['id']}-after-boundary\t{scene['start']+.2}")
print('opening\t0.1'); print('ending\t104.8')
PY
while IFS=$'\t' read -r label second; do
  ffmpeg -nostdin -hide_banner -loglevel error -ss "$second" -i "$final_file" -frames:v 1 "$capture_dir/review/$label.png"
done < review-times.tsv
python3 - "$final_file" "$capture_dir/review/review-required.json" <<'PY'
import hashlib,json,pathlib,sys
video=pathlib.Path(sys.argv[1]); destination=pathlib.Path(sys.argv[2])
destination.write_text(json.dumps({'file':str(video),'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),
    'sceneAndBoundaryInspection':False,'fullWatchAndListen':False,'reviewer':None,'sharingAuthorized':False},indent=2)+'\n')
PY
printf 'Composed actual public UI cut: %s\nAyo must watch and listen to the entire cut before sharing. No full review is claimed by this script.\n' "$final_file"
