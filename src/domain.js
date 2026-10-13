// Ayo Ahmed — Independent concept. All account facts and events are synthetic.
export const SIMULATION_START = '2026-10-13T12:00:00.000Z';
const DAY = 86400000;
export const LIMITS = Object.freeze({ accounts:48, importRows:20, receipts:150, audit:200, outbox:50, bodyBytes:24576, stateBytes:112640, requestsPerMinute:30, requestsPerSession:240, sessionHours:24 });
export const SOURCE_CATALOG = Object.freeze([
  {id:'bolt-support-45861',title:'Member statuses',url:'https://bolt.eu/en/support/articles/45861/',accessedAt:'2026-10-13',claim:'company_pay_member_active',excerpt:"No payment method — the member activated their account but hasn't added a payment card yet. This status only appears on employee-pay accounts — on a company-pay account, the member moves straight to Active once onboarding is complete."},
  {id:'bolt-support-32674',title:'Group policies',url:'https://bolt.eu/en-lt/support/articles/32674/',accessedAt:'2026-10-13',claim:'group_policy',excerpt:'Policies are rules set for a particular employee group(s) on how they can use the business payment method.',exclusion:'Please note: Policies will not apply to Ride Booker trips.'},
  {id:'bolt-support-62851',title:'Business account capabilities',url:'https://bolt.eu/en/support/articles/62851/',accessedAt:'2026-10-13',claim:'order_history',excerpt:'Check all orders made with the company’s payment method'}
]);
export const PROFILES = Object.freeze([
  {id:'uk',name:'United Kingdom',language:'en',setup:'Self serve',support:'Digital help',assumption:true,note:'Hypothetical English language self serve setup; availability is simulated.'},
  {id:'lt',name:'Lithuania',language:'lt',setup:'Guided setup',support:'Localized guidance',assumption:true,note:'Hypothetical Lithuanian language guidance; availability is simulated.'},
  {id:'ke',name:'Kenya',language:'en',setup:'Assisted setup',support:'Operations handoff',assumption:true,note:'Hypothetical English language assisted setup; availability is simulated.'}
]);
const fixtureRows = [
  ['uk-lumen','Lumen Studio','uk','billing'],['uk-ridge','Ridge Workshop','uk','evidence'],['uk-harbor','Harbor Office','uk','none'],['uk-orbit','Orbit Team','uk','member'],
  ['lt-linden','Linden Design','lt','invitation'],['lt-river','River Bureau','lt','group'],['lt-amber','Amber Lab','lt','none'],['lt-north','North Makers','lt','none'],
  ['ke-acacia','Acacia Team','ke','service'],['ke-summit','Summit Studio','ke','none'],['ke-coast','Coast Workshop','ke','billing'],['ke-mosaic','Mosaic Office','ke','none']
];
export const FIXTURES = Object.freeze(fixtureRows.map(([id,name,marketId,blocker])=>({id,name,marketId,blocker,businessUse:true,consentToSetup:true,language:marketId==='lt'?'lt':'en',fixtureId:`recorded-${id}-v1`})));
const copy = value => structuredClone(value);
const stamp = value => Date.parse(value);
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const plain = o => o!==null && typeof o==='object' && !Array.isArray(o);
const short = (v,max=80) => typeof v==='string' && v.length>0 && v.length<=max;
const iso = v => typeof v==='string' && Number.isFinite(stamp(v)) && new Date(stamp(v)).toISOString()===v;
export function assignment(id) { let hash=2166136261; for(const c of id) hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0; return hash%4===0?'holdout':'treatment'; }
export function makeExtraction(accountId='uk-lumen', overrides={}) {
  const f=FIXTURES.find(x=>x.id===accountId); if(!f) throw new Error('Unknown recorded synthetic fixture');
  return {schemaVersion:1,synthetic:true,fixtureId:f.fixtureId,accountId:f.id,service:'ride',paymentMode:'company_pay',businessUse:f.businessUse,consentToSetup:f.consentToSetup,language:f.language,confidence:0.92,observedAt:SIMULATION_START,evidence:[{sourceId:SOURCE_CATALOG[0].id,claim:SOURCE_CATALOG[0].claim,excerpt:SOURCE_CATALOG[0].excerpt}],...overrides};
}
export function validateExtraction(payload) {
  const errors=[]; const reject=(code,field,message)=>errors.push({code,field,message});
  if(!plain(payload)) return {valid:false,errors:[{code:'INVALID_SCHEMA',field:'payload',message:'Expected a recorded synthetic extraction object.'}]};
  const required=['schemaVersion','synthetic','fixtureId','accountId','service','paymentMode','businessUse','consentToSetup','language','confidence','observedAt','evidence'];
  for(const field of required) if(!own(payload,field)) reject('MISSING_FIELD',field,'Required field missing.');
  for(const field of Object.keys(payload)) if(!required.includes(field)) reject('UNSUPPORTED_FIELD',field,'Unknown extraction fields are rejected.');
  const text=JSON.stringify(payload); if(/ignore\s+(previous|all|instructions)|system\s*prompt|api[_ -]?key|execute\s*\(|<script|reveal\s+secret|send\s+credentials/i.test(text)) reject('INSTRUCTION_INJECTION','payload','Instruction-like text is not account evidence.');
  const f=FIXTURES.find(x=>x.id===payload.accountId && x.fixtureId===payload.fixtureId);
  if(!f) reject('UNSUPPORTED_FIXTURE','fixtureId','Account facts must come from an allowlisted recorded synthetic fixture.');
  if(payload.schemaVersion!==1 || payload.synthetic!==true) reject('INVALID_SCHEMA','schemaVersion','Only synthetic schema version 1 is supported.');
  if(payload.service!=='ride' || payload.paymentMode!=='company_pay') reject('UNSUPPORTED_SCOPE','service','Only simulated company-pay app rides are in scope; Ride Booker and employee-pay are excluded.');
  if(f && (payload.businessUse!==f.businessUse || payload.consentToSetup!==f.consentToSetup || payload.language!==f.language)) reject('FACT_MISMATCH','businessUse','Extracted account facts do not match the recorded synthetic fixture.');
  if(typeof payload.confidence!=='number' || !Number.isFinite(payload.confidence) || payload.confidence<0 || payload.confidence>1) reject('INVALID_CONFIDENCE','confidence','Confidence is recorded metadata between 0 and 1.');
  if(!iso(payload.observedAt)) reject('INVALID_TIMESTAMP','observedAt','Use a canonical ISO timestamp.');
  if(!Array.isArray(payload.evidence) || payload.evidence.length<1 || payload.evidence.length>3) reject('MISSING_EVIDENCE','evidence','One to three allowlisted source excerpts are required.');
  else for(const [i,e] of payload.evidence.entries()) {
    const source=SOURCE_CATALOG.find(s=>s.id===e?.sourceId && s.claim===e?.claim && s.excerpt===e?.excerpt);
    if(!plain(e) || Object.keys(e).some(k=>!['sourceId','claim','excerpt'].includes(k)) || !source) reject('UNSUPPORTED_EVIDENCE',`evidence.${i}`,'The source, claim and exact excerpt must match the verified public source catalog.');
  }
  return {valid:errors.length===0,errors,...(errors.length?{}:{normalized:copy(payload)})};
}
function evidenceFrom(payload) { const ref=payload.evidence[0],source=SOURCE_CATALOG.find(s=>s.id===ref.sourceId); return {...copy(payload),...ref,source:source.url,title:source.title,provenance:'recorded_synthetic_fixture'}; }
export function deriveAccount(account,state) {
  let qualification;
  const e=account.evidence;
  if(!PROFILES.some(p=>p.id===account.marketId)) qualification={status:'abstain',reason:'Unsupported hypothetical market profile.',owner:'Local operations',action:'Review profile support before setup; do not infer market eligibility.'};
  else if(account.service!=='ride'||account.paymentMode!=='company_pay') qualification={status:'abstain',reason:'Unsupported service or payment scope.',owner:'Operations reviewer',action:'Review scope; Ride Booker and employee-pay are excluded.'};
  else if(!e) qualification={status:'abstain',reason:'Account evidence is unknown.',owner:'Account owner',action:'Review the recorded synthetic intake; do not infer missing facts.'};
  else {
    const schema={}; for(const k of ['schemaVersion','synthetic','fixtureId','accountId','service','paymentMode','businessUse','consentToSetup','language','confidence','observedAt','evidence']) schema[k]=e[k];
    const valid=validateExtraction(schema);
    if(!valid.valid) qualification={status:'escalate',reason:'Evidence provenance or facts conflict.',owner:'Operations reviewer',action:'Review the rejected claim against the source and fixture before setup.'};
    else if(stamp(state.now)-stamp(e.observedAt)>7*DAY || stamp(e.observedAt)>stamp(state.now)) qualification={status:'escalate',reason:'Evidence is stale or future dated.',owner:'Account owner',action:'Refresh the synthetic intake and review its provenance.'};
    else qualification={status:'qualified',reason:'Recorded synthetic account facts and allowlisted capability evidence validated.',owner:'Account owner',action:'Complete the remaining setup prerequisite; confidence is metadata, not a truth threshold.'};
  }
  const missing=[];
  if(qualification.status!=='qualified') missing.push('evidence');
  if(!account.billingValidated) missing.push('billing');
  if(account.invitationStatus==='expired') missing.push('invitation');
  if(!account.memberActive) missing.push('member');
  if(!account.groupPolicy) missing.push('group');
  if(!account.serviceAvailable) missing.push('service');
  const actions={evidence:[qualification.owner,qualification.action],billing:['Billing administrator','Validate synthetic company billing.'],invitation:['Company administrator','Renew the expired synthetic invitation.'],member:['Company administrator','Complete company-pay member onboarding to Active.'],group:['Company administrator','Confirm the synthetic group policy allows this ride.'],service:['Local operations','Confirm simulated ride availability for this profile.']};
  const next=actions[missing[0]]||['Account owner','Simulate the first eligible company-pay ride.'];
  return {...copy(account),variant:assignment(account.id),cohortExcluded:!state.experiment.cohortIds.includes(account.id),qualification,readiness:{ready:missing.length===0,missing,owner:next[0],action:next[1]}};
}
export function summarizeExperiment(state) {
  const missingIds=state.experiment.cohortIds.filter(id=>!state.accounts.some(a=>a.id===id));
  const denominatorInvalid=missingIds.length>0 || new Set(state.experiment.cohortIds).size!==state.experiment.cohortIds.length;
  const cohort=state.experiment.cohortIds.map(id=>state.accounts.find(a=>a.id===id)).filter(Boolean).map(a=>deriveAccount(a,state));
  const arms={treatment:{numerator:0,denominator:0,rate:null,exposed:0,contaminated:0,ttfo:{meanHours:null,medianHours:null,observed:0,censored:0,definition:'Hours from fixed synthetic enrollment to first eligible order; observed converters only.'}},holdout:{numerator:0,denominator:0,rate:null,exposed:0,contaminated:0,ttfo:{meanHours:null,medianHours:null,observed:0,censored:0,definition:'Hours from fixed synthetic enrollment to first eligible order; observed converters only.'}}};
  const times={treatment:[],holdout:[]};
  const start=stamp(state.experiment.start),end=stamp(state.experiment.end);
  for(const a of cohort) { const arm=arms[a.variant]; arm.denominator++; if(a.firstOrder && iso(a.firstOrder.occurredAt) && stamp(a.firstOrder.occurredAt)>=start && stamp(a.firstOrder.occurredAt)<=end && stamp(a.firstOrder.occurredAt)<=stamp(state.now)) {arm.numerator++;times[a.variant].push((stamp(a.firstOrder.occurredAt)-start)/3600000);} if(a.exposures.length) arm.exposed++; if(a.variant==='holdout' && a.exposures.length) arm.contaminated++; }
  for(const [variant,arm] of Object.entries(arms)) {arm.rate=arm.denominator&&!denominatorInvalid?arm.numerator/arm.denominator:null;const sorted=times[variant].sort((a,b)=>a-b),n=sorted.length;arm.ttfo.observed=n;arm.ttfo.censored=arm.denominator-n;if(n){arm.ttfo.meanHours=sorted.reduce((a,b)=>a+b,0)/n;arm.ttfo.medianHours=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;}}
  const missingDenominator=denominatorInvalid||Object.values(arms).some(a=>a.denominator===0),complete=stamp(state.now)>=end;
  return {qualified:cohort.filter(a=>a.qualification.status==='qualified').length,ready:cohort.filter(a=>a.readiness.ready).length,activated:arms.treatment.numerator+arms.holdout.numerator,cohortSize:cohort.length,arms,descriptiveDifferencePp:missingDenominator?null:(arms.treatment.rate-arms.holdout.rate)*100,missingDenominator,denominatorStatus:denominatorInvalid?'invalid':missingDenominator?'missing':'complete',missingCohortIds:missingIds,window:{start:state.experiment.start,end:state.experiment.end,now:state.now,complete,status:complete?'complete':'incomplete',observedWindowComplete:complete,censored:cohort.length-arms.treatment.numerator-arms.holdout.numerator},exclusions:state.accounts.filter(a=>!state.experiment.cohortIds.includes(a.id)).map(a=>({id:a.id,reason:'Imported after fixed cohort enrollment; excluded from ITT denominator.'})),contamination:arms.holdout.contaminated,interpretation:'Descriptive synthetic intention-to-treat rates over a fixed seven-day cohort. No causal claim, significance estimate, or real customer outcome. TTFO describes observed converters only; unconverted accounts are censored. Exposure is reported separately; holdout exposure is contamination.'};
}
function decorate(state) { state.accounts=state.accounts.map(a=>deriveAccount(a,state)); state.summary=summarizeExperiment(state); return state; }
export function seedState() {
  const state={revision:0,generation:0,now:SIMULATION_START,marketId:'uk',profiles:copy(PROFILES),sources:copy(SOURCE_CATALOG),limits:copy(LIMITS),accounts:FIXTURES.map(f=>({id:f.id,name:f.name,marketId:f.marketId,service:'ride',paymentMode:'company_pay',synthetic:true,billingValidated:f.blocker!=='billing',memberActive:!['member','invitation'].includes(f.blocker),groupPolicy:f.blocker!=='group',serviceAvailable:f.blocker!=='service',invitationStatus:f.blocker==='invitation'?'expired':f.blocker==='member'?'invited':'active',optedOut:false,evidence:f.blocker==='evidence'?null:evidenceFrom(makeExtraction(f.id)),gateTimes:{billing:SIMULATION_START,member:SIMULATION_START,group:SIMULATION_START,service:SIMULATION_START,invitation:SIMULATION_START},firstOrder:null,exposures:[]})),audit:[],auditTrimmed:0,outbox:[],receipts:[],previews:[],extraction:{accepted:[],rejected:[],fixtures:FIXTURES.map(f=>makeExtraction(f.id))},experiment:{start:SIMULATION_START,end:new Date(stamp(SIMULATION_START)+7*DAY).toISOString(),cohortIds:FIXTURES.map(f=>f.id),assignment:'Stable FNV-1a account hash; 25% nominal holdout. Assignment and cohort frozen before synthetic exposure.'}};
  return decorate(state);
}
function audit(state,type,details) { state.audit.push({id:`audit-${state.generation}-${state.revision+1}-${state.audit.length}`,at:state.now,type,...details}); if(state.audit.length>LIMITS.audit) { state.audit.shift(); state.auditTrimmed++; } }
const failure=(state,code,message)=>({ok:false,error:{code,message},state});
function canonical(value) { if(Array.isArray(value)) return `[${value.map(canonical).join(',')}]`; if(plain(value)) return `{${Object.keys(value).filter(k=>k!=='expectedRevision').sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')}}`; return JSON.stringify(value); }
export function applyCommand(original,command,now=original.now) {
  if(!plain(command) || !short(command.type,40)) return failure(original,'INVALID_COMMAND','A structured command type is required.');
  const commandFields={select_market:['marketId'],resolve_prerequisite:['accountId','prerequisite'],simulate_order:['accountId','eventId','occurredAt'],preview_import:['rows'],commit_import:['previewId'],queue_message:['accountId','eventId','channel'],change_preferences:['accountId','optedOut'],record_extraction:['payload'],record_exposure:['accountId'],advance_clock:['hours'],demo_reset:[]};
  if(own(commandFields,command.type) && Object.keys(command).some(k=>!['type','expectedRevision',...commandFields[command.type]].includes(k))) return failure(original,'INVALID_COMMAND','Unsupported command fields are rejected.');
  const eventTypes=['simulate_order','queue_message'];
  const fp=canonical(command);
  if(eventTypes.includes(command.type)) {
    if(!short(command.eventId,80)) return failure(original,'INVALID_COMMAND','A bounded idempotency eventId is required.');
    const receipt=original.receipts.find(r=>r.eventId===command.eventId);
    if(receipt) return receipt.fingerprint===fp?{ok:true,state:original,result:{...copy(receipt.result),duplicate:true}}:failure(original,'IDEMPOTENCY_CONFLICT','This idempotency key was already used with a different payload.');
    if(original.receipts.length>=LIMITS.receipts) return failure(original,'LIMIT_REACHED','Session receipt capacity reached; reset the synthetic demo.');
  }
  if(own(command,'expectedRevision') && command.expectedRevision!==original.revision) return failure(original,'REVISION_CONFLICT','State changed; refresh and review before retrying.');
  const state=copy(original); if(now!==original.now) return failure(original,'INVALID_COMMAND','Advance the explicit simulation clock instead of supplying implicit time.');
  const account=command.accountId?state.accounts.find(a=>a.id===command.accountId):null;
  const requiredAccount=['resolve_prerequisite','simulate_order','queue_message','change_preferences','record_exposure'];
  if(requiredAccount.includes(command.type) && !account) return failure(original,'ACCOUNT_NOT_FOUND','Synthetic account not found.');
  let result={};
  switch(command.type) {
    case 'select_market': if(!PROFILES.some(p=>p.id===command.marketId)) return failure(original,'INVALID_COMMAND','Unknown hypothetical profile.'); state.marketId=command.marketId; result={marketId:state.marketId}; break;
    case 'resolve_prerequisite': {
      const fields={billing:'billingValidated',member:'memberActive',group:'groupPolicy',service:'serviceAvailable',invitation:'invitationStatus'};
      if(!own(fields,command.prerequisite)) return failure(original,'INVALID_COMMAND','Choose an explicit setup prerequisite; evidence needs a reviewed extraction.');
      if(command.prerequisite==='member'&&account.invitationStatus==='expired')return failure(original,'INVALID_COMMAND','Renew the expired synthetic invitation before member onboarding.');
      if(command.prerequisite==='invitation'&&account.invitationStatus!=='expired')return failure(original,'INVALID_COMMAND','Only an expired synthetic invitation needs renewal.');
      const changed=command.prerequisite==='invitation'||account[fields[command.prerequisite]]!==true;
      account[fields[command.prerequisite]]=command.prerequisite==='invitation'?'invited':true; if(changed)account.gateTimes[command.prerequisite]=state.now;
      if(command.prerequisite==='invitation') account.memberActive=false;
      if(command.prerequisite==='member')account.invitationStatus='active';
      result={accountId:account.id,resolved:command.prerequisite,readiness:deriveAccount(account,state).readiness}; break;
    }
    case 'simulate_order': {
      const occurredAt=command.occurredAt??state.now;
      if(!iso(occurredAt)) return failure(original,'INVALID_COMMAND','Order timestamp must be canonical ISO.');
      const derived=deriveAccount(account,state),t=stamp(occurredAt),readyAt=Math.max(...Object.values(account.gateTimes).map(stamp));
      let status='accepted';
      if(t<stamp(state.experiment.start)||t>stamp(state.experiment.end)||t>stamp(state.now)) status='rejected_outside_window';
      else if(!derived.readiness.ready) status='rejected_unready';
      else if(t<readyAt) status='rejected_before_ready';
      const outOfOrder=Boolean(account.firstOrder && t<stamp(account.firstOrder.occurredAt));
      if(status==='accepted' && (!account.firstOrder || outOfOrder)) account.firstOrder={eventId:command.eventId,occurredAt};
      result={eventId:command.eventId,accountId:account.id,status,occurredAt,outOfOrder,firstOrder:copy(account.firstOrder),missing:derived.readiness.missing,synthetic:true}; break;
    }
    case 'preview_import': {
      const rows=command.rows,errors=[];
      if(!Array.isArray(rows)||rows.length<1||rows.length>LIMITS.importRows) return failure(original,'IMPORT_INVALID','Preview one to twenty synthetic rows.');
      const ids=new Set(state.accounts.map(a=>a.id));
      rows.forEach((r,i)=>{const e=(field,message)=>errors.push({row:i+1,field,code:'IMPORT_INVALID',message}); if(!plain(r)){e('row','Object required.');return;} const fields=['id','name','marketId','billingValidated','memberActive','groupPolicy','serviceAvailable','optedOut']; for(const k of Object.keys(r)) if(!fields.includes(k))e(k,'Unsupported import column.'); if(!short(r.id,32)||!/^synthetic-[a-z0-9-]+$/.test(r.id))e('id','Use a synthetic- prefixed lowercase ID.'); if(ids.has(r.id))e('id','Duplicate account ID.'); ids.add(r.id); if(!short(r.name,80))e('name','Bounded synthetic name required.'); if(!PROFILES.some(p=>p.id===r.marketId))e('marketId','Unknown hypothetical profile.'); for(const k of ['billingValidated','memberActive','groupPolicy','serviceAvailable'])if(typeof r[k]!=='boolean')e(k,'Explicit boolean required.'); if(own(r,'optedOut')&&typeof r.optedOut!=='boolean')e('optedOut','Explicit boolean required.'); });
      if(state.accounts.length+rows.length>LIMITS.accounts) errors.push({row:0,field:'rows',code:'LIMIT_REACHED',message:'Session account capacity exceeded.'});
      const previewId=`preview-${state.generation}-${state.revision+1}`; result={previewId,baseRevision:state.revision+1,valid:errors.length===0,errors,rows:copy(rows)}; state.previews=[copy(result)]; break;
    }
    case 'commit_import': {
      const preview=state.previews.find(p=>p.previewId===command.previewId);
      if(!preview) return failure(original,'PREVIEW_NOT_FOUND','Preview not found.');
      if(preview.baseRevision!==state.revision) return failure(original,'IMPORT_STALE','The preview revision is stale; create a new preview.');
      if(!preview.valid) return failure(original,'IMPORT_INVALID','No rows were imported because the preview contains errors.');
      const added=preview.rows.map(r=>({...copy(r),synthetic:true,service:'ride',paymentMode:'company_pay',optedOut:r.optedOut??false,invitationStatus:r.memberActive?'active':'invited',evidence:null,gateTimes:{billing:state.now,member:state.now,group:state.now,service:state.now,invitation:state.now},firstOrder:null,exposures:[]}));
      state.accounts.push(...added); state.previews=[]; result={imported:added.length,accountIds:added.map(a=>a.id),atomic:true,cohortExcluded:true}; break;
    }
    case 'queue_message': {
      if(!['email','sms'].includes(command.channel)) return failure(original,'INVALID_COMMAND','Only synthetic email or SMS previews are supported.');
      if(state.outbox.length>=LIMITS.outbox) return failure(original,'LIMIT_REACHED','Synthetic outbox capacity reached.');
      const d=deriveAccount(account,state),recent=state.outbox.filter(m=>m.accountId===account.id && m.status==='queued' && stamp(state.now)-stamp(m.at)<DAY);
      let reason=null;
      if(account.optedOut) reason='opted_out'; else if(d.variant==='holdout')reason='holdout'; else if(account.firstOrder)reason='already_activated'; else if(d.qualification.status!=='qualified')reason='qualification_unknown'; else if(account.invitationStatus==='expired')reason='invitation_expired'; else if(stamp(state.now)>stamp(state.experiment.end))reason='outside_window'; else if(recent.some(m=>m.channel===command.channel))reason='deduplicated'; else if(recent.length>=1)reason='rate_cap';
      const message={id:`message-${state.generation}-${state.outbox.length+1}`,eventId:command.eventId,accountId:account.id,channel:command.channel,at:state.now,status:reason?'suppressed':'queued',reason,excluded:d.cohortExcluded,exclusionReason:d.cohortExcluded?'Imported outside the frozen experiment cohort.':null,synthetic:true,delivery:'No provider or external send',template:d.readiness.ready?'Try your first simulated company-pay ride.':d.readiness.action};
      state.outbox.push(message); if(!reason) account.exposures.push({at:state.now,source:'synthetic_outbox',eventId:command.eventId}); result=copy(message); break;
    }
    case 'change_preferences': if(typeof command.optedOut!=='boolean') return failure(original,'INVALID_COMMAND','An explicit preference boolean is required.'); account.optedOut=command.optedOut; result={accountId:account.id,optedOut:account.optedOut}; break;
    case 'record_extraction': {
      const validation=validateExtraction(command.payload),id=command.payload?.accountId,found=state.accounts.find(a=>a.id===id);
      if(validation.valid && !found) return failure(original,'ACCOUNT_NOT_FOUND','Extraction account not in this session.');
      const record={at:state.now,accountId:typeof id==='string'?id.slice(0,80):null,valid:validation.valid,errors:validation.errors,provenance:'recorded_synthetic_fixture'};
      if(validation.valid) {if(!found.evidence)found.gateTimes.evidence=state.now;found.evidence=evidenceFrom(validation.normalized); state.extraction.accepted.push(record);} else state.extraction.rejected.push(record);
      state.extraction.accepted=state.extraction.accepted.slice(-30);state.extraction.rejected=state.extraction.rejected.slice(-30);
      result={accepted:validation.valid,errors:validation.errors}; break;
    }
    case 'record_exposure': account.exposures.push({at:state.now,source:'manual_synthetic_exposure'}); account.exposures=account.exposures.slice(-30); result={accountId:account.id,contaminated:assignment(account.id)==='holdout',synthetic:true}; break;
    case 'advance_clock': if(typeof command.hours!=='number'||!Number.isFinite(command.hours)||command.hours<=0||command.hours>192) return failure(original,'INVALID_COMMAND','Advance by more than zero and at most 192 hours.'); state.now=new Date(stamp(state.now)+command.hours*3600000).toISOString(); result={now:state.now}; break;
    case 'demo_reset': { const reset=seedState(); reset.revision=original.revision+1; reset.generation=original.generation+1; audit(reset,'demo_reset',{priorRevision:original.revision,note:'Visitor-only synthetic fixture reset; request quotas remain in force.'}); return {ok:true,state:decorate(reset),result:{reset:true,generation:reset.generation,receiptNamespaceReset:true}}; }
    default:return failure(original,'UNKNOWN_COMMAND','Unknown command.');
  }
  if(eventTypes.includes(command.type)) state.receipts.push({eventId:command.eventId,fingerprint:fp,result:copy(result),at:state.now});
  const auditResult=command.type==='preview_import'?{previewId:result.previewId,baseRevision:result.baseRevision,valid:result.valid,rowCount:result.rows.length,errorCount:result.errors.length,errors:result.errors.slice(0,20).map(e=>({row:e.row,field:String(e.field).slice(0,64),code:e.code}))}:command.type==='record_extraction'?{accepted:result.accepted,errorCodes:result.errors.map(e=>e.code)}:copy(result);
  audit(state,command.type,{accountId:account?.id??null,result:auditResult}); state.revision++;
  decorate(state);
  if(new TextEncoder().encode(JSON.stringify(state)).byteLength>LIMITS.stateBytes)return failure(original,'LIMIT_REACHED','Visitor state size cap reached; export and reset this synthetic demo.');
  return {ok:true,state,result};
}
