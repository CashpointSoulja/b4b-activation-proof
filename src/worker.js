import {seedState,applyCommand,LIMITS} from './domain.js';
import {runEvaluations} from './evaluation.js';

const COOKIE='b4b_session';
const SESSION_MS=LIMITS.sessionHours*3600000;
const security={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
};
function json(value,status=200,extra={}) {return new Response(JSON.stringify(value),{status,headers:{...security,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra}});}
const error=(code,message,status=400)=>json({ok:false,error:{code,message}},status);
function cookieToken(request) {const token=request.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);return /^[a-f0-9]{64}$/.test(token||'')?token:null;}
function token() {return [...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join('');}
function cookie(value,url,maxAge=86400) {return `${COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${url.protocol==='https:'?'; Secure':''}`;}
async function boundedJson(request) {
  if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type')||'')) throw {code:'CONTENT_TYPE',message:'Use application/json.',status:415};
  const announced=Number(request.headers.get('Content-Length')||0);if(announced>LIMITS.bodyBytes)throw{code:'BODY_TOO_LARGE',message:'Request exceeds 24 KiB.',status:413};
  if(!request.body)throw{code:'INVALID_JSON',message:'JSON body required.',status:400};
  const reader=request.body.getReader();let size=0;const chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMITS.bodyBytes){await reader.cancel();throw{code:'BODY_TOO_LARGE',message:'Request exceeds 24 KiB.',status:413};}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw{code:'INVALID_JSON',message:'Malformed JSON.',status:400};}
}

export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(!url.pathname.startsWith('/api/')) {
      if(!['GET','HEAD'].includes(request.method)) return error('METHOD_NOT_ALLOWED','Only GET and HEAD serve assets.',405);
      const response=await env.ASSETS.fetch(request);const headers=new Headers(response.headers);for(const [key,value] of Object.entries(security))headers.set(key,value);return new Response(response.body,{status:response.status,headers});
    }
    const origin=request.headers.get('Origin'); if(origin&&origin!==url.origin)return error('ORIGIN_REJECTED','Same-origin requests required.',403);
    const routes={'/api/state':'GET','/api/command':'POST','/api/evaluations':'GET'};
    if(!routes[url.pathname])return error('NOT_FOUND','API route not found.',404);
    if(request.method!==routes[url.pathname])return error('METHOD_NOT_ALLOWED','Method not allowed.',405);
    let capability=cookieToken(request),fresh=false;
    if(!capability){if(request.method!=='GET')return error('SESSION_REQUIRED','Load the visitor state before writing.',401);capability=token();fresh=true;}
    let body;
    if(request.method==='POST')try{body=await boundedJson(request);}catch(e){return error(e.code,e.message,e.status);}
    if(request.method==='POST' && (!body||!Number.isInteger(body.expectedRevision)||body.expectedRevision<0))return error('REVISION_REQUIRED','An expectedRevision is required for every mutation.',400);
    const id=env.SESSIONS.idFromName(capability),stub=env.SESSIONS.get(id);
    const headers={'X-Session-Init':fresh?'1':'0','Content-Type':'application/json'};
    const internal=new Request(`https://session.internal${url.pathname}${url.search}`,{method:request.method,headers,...(body?{body:JSON.stringify(body)}:{})});
    const response=await stub.fetch(internal);const resultHeaders=new Headers(response.headers);for(const [key,value]of Object.entries(security))resultHeaders.set(key,value);
    if(fresh && response.ok)resultHeaders.set('Set-Cookie',cookie(capability,url));
    if(response.status===410)resultHeaders.set('Set-Cookie',cookie('',url,0));
    return new Response(response.body,{status:response.status,headers:resultHeaders});
  }
};

// A SQLite-backed Durable Object per visitor capability. There is no shared account write path.
export class ActivationSession {
  constructor(ctx,env){this.ctx=ctx;this.env=env;}
  async fetch(request) {
    const url=new URL(request.url),realNow=Date.now();let response;
    // Await the async transaction: state, quotas, receipts and audit commit together.
    await this.ctx.storage.transaction(async storage=>{
      let meta=await storage.get('meta'),state=await storage.get('state');
      if(!meta || !state){
        if(request.headers.get('X-Session-Init')!=='1'){response=error('SESSION_EXPIRED','Visitor session expired; reload to start a new isolated demo.',410);return;}
        meta={createdAt:realNow,expiresAt:realNow+SESSION_MS,requests:0,minute:Math.floor(realNow/60000),minuteRequests:0};state=seedState();await storage.setAlarm(meta.expiresAt);
      }
      if(realNow>=meta.expiresAt){await storage.deleteAll();response=error('SESSION_EXPIRED','Visitor session expired; reload to start a new isolated demo.',410);return;}
      if(meta.minute!==Math.floor(realNow/60000)){meta.minute=Math.floor(realNow/60000);meta.minuteRequests=0;}
      if(meta.requests>=LIMITS.requestsPerSession || meta.minuteRequests>=LIMITS.requestsPerMinute){const retrySeconds=meta.requests>=LIMITS.requestsPerSession?Math.ceil((meta.expiresAt-realNow)/1000):Math.ceil((60000-realNow%60000)/1000);response=json({ok:false,error:{code:'RATE_LIMITED',message:'Visitor request cap reached. Wait for the minute window or session expiry.'}},429,{'Retry-After':String(retrySeconds)});return;}
      meta.requests++;meta.minuteRequests++;
      if(url.pathname==='/api/state')response=json(state);
      else if(url.pathname==='/api/evaluations')response=json(runEvaluations({broken:url.searchParams.get('broken')==='1'}));
      else {
        const command=await request.json();let outcome=applyCommand(state,command);
        if(outcome.ok && new TextEncoder().encode(JSON.stringify(outcome.state)).byteLength>LIMITS.stateBytes)outcome={ok:false,error:{code:'LIMIT_REACHED',message:'Visitor state size cap reached; export and reset the synthetic demo.'},state};
        if(outcome.ok)state=outcome.state;
        const status=outcome.ok?200:['REVISION_CONFLICT','IDEMPOTENCY_CONFLICT','IMPORT_STALE'].includes(outcome.error.code)?409:outcome.error.code==='LIMIT_REACHED'?429:400;
        response=json(outcome,status);
      }
      await storage.put({state,meta});
    });
    return response;
  }
  async alarm(){await this.ctx.storage.deleteAll();}
}
