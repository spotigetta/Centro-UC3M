'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/shared/gmail-review.js'),'utf8');
const kanban=require('../src/shared/mail-kanban.js');
const now=Date.now(),subjects=[{id:'fabricacion',name:'Sistemas Integrados de Fabricación'}];
const args={clientId:'test.apps.googleusercontent.com',apiKey:'test-key',subjects};
function proposal(overrides={}) {return {operation:'add',entity:'practice',courseId:'fabricacion',value:{title:'Entregar práctica',date:'2026-11-20',time:'18:30',details:'Entrega de la práctica.'},reason:'El correo pide entregar la práctica.',confidence:.9,explicitCorrection:false,evidenceMessageIds:['aa'],...overrides};}
function message(id,text='Práctica de fabricación: revisión y 2º turno.') {return {id,internalDate:String(now),payload:{mimeType:'multipart/alternative',headers:[{name:'Subject',value:'SIF: práctica'},{name:'From',value:'docente@uc3m.es'}],parts:[{mimeType:'text/plain',body:{data:Buffer.from(text).toString('base64url')}},{mimeType:'text/html',body:{data:Buffer.from('<b>DUPLICADO</b>').toString('base64url')}},{mimeType:'text/plain',filename:'privado.txt',body:{attachmentId:'secreto',data:Buffer.from('NO ADJUNTO').toString('base64url')}}]}};}
function harness({pages=[{messages:[{id:'aa'}]}],proposals=[proposal()],oauthError,scope,fail,missingGIS=false,makeMessage=message}={}) {
  const calls=[],auth=[];let pageIndex=0;
  const oauth={initTokenClient(config){auth.push(config);return {requestAccessToken(){config.callback(oauthError?{error:oauthError}:{access_token:'secret-token',expires_in:3600,scope:scope===undefined?'https://www.googleapis.com/auth/gmail.readonly':scope});}};}};
  const context={console,TextDecoder,Uint8Array,Date,URLSearchParams,AbortController,setTimeout,clearTimeout,atob,google:missingGIS?undefined:{accounts:{oauth2:oauth}},module:{exports:{}},fetch:async(url,options)=>{
    calls.push({url,options});if(fail)return {ok:false,status:fail,json:async()=>({})};
    if(url.includes('generativelanguage'))return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({proposals:typeof proposals==='function'?proposals(calls):proposals})}]}}]})};
    const u=new URL(url);if(u.pathname.endsWith('/messages'))return {ok:true,json:async()=>pages[pageIndex++]||{messages:[]}};
    return {ok:true,json:async()=>makeMessage(u.pathname.split('/').pop())};
  }};
  vm.createContext(context);vm.runInContext(source,context);
  return {api:context.UC3MGmail,context,calls,auth,oauth};
}
(async()=>{
  const h=harness();await h.api.prepare();const result=JSON.parse(JSON.stringify(await h.api.review(args)));
  assert.equal(result.proposals.length,1);assert.equal(result.scannedMessages,1);assert.equal(result.proposals[0].evidenceSubject,'SIF: práctica');
  assert.equal(result.proposals[0].evidenceDate,new Date(now).toISOString());
  assert.equal(kanban.validateProposal({subjects},result.proposals[0]),true);
  const gemini=h.calls.find(c=>c.url.includes('generativelanguage')),input=JSON.parse(JSON.parse(gemini.options.body).contents[0].parts[0].text);
  assert.equal(input.messages[0].body,'Práctica de fabricación: revisión y 2º turno.');assert(!JSON.stringify(input).includes('DUPLICADO'));assert(!JSON.stringify(input).includes('NO ADJUNTO'));
  assert(h.calls.filter(c=>c.url.includes('gmail.googleapis')).every(c=>!c.options.method && c.options.headers.Authorization==='Bearer secret-token'));
  assert.equal(h.auth[0].scope,'https://www.googleapis.com/auth/gmail.readonly');assert.equal(h.auth[0].include_granted_scopes,false);
  assert(new URL(h.calls[0].url).searchParams.get('q').includes('-in:sent -in:spam -in:trash'));
  assert(!JSON.stringify(result).includes('secret-token'));assert(!JSON.stringify(result).includes('test-key'));assert(!('messages' in result));
  const bad=harness({proposals:[proposal({courseId:'inventada'}),proposal({evidenceMessageIds:['ffff']}),proposal({value:{title:'Imposible',date:'2026-02-30',time:'25:00',details:''}}),proposal({operation:'delete',explicitCorrection:false})]});
  const checked=await bad.api.review(args);assert.equal(checked.proposals.length,1);assert.equal(checked.proposals[0].explicitCorrection,true);assert(checked.warnings.some(w=>w.includes('3 propuestas descartadas')));
  const paged=harness({pages:[{messages:[{id:'aa'}],nextPageToken:'p2'},{messages:[{id:'bb'}]}],proposals:[]});assert.equal((await paged.api.review(args)).scannedMessages,2);assert(paged.calls[1].url.includes('pageToken=p2'));
  const many=harness({pages:[{messages:Array.from({length:100},(_,i)=>({id:(i+1).toString(16)})),nextPageToken:'p2'},{messages:Array.from({length:100},(_,i)=>({id:(i+101).toString(16)})),nextPageToken:'p3'}],proposals:[]});
  const limited=await many.api.review(args);assert.equal(limited.scannedMessages,200);assert.equal(limited.partial,true);assert.equal(many.calls.filter(c=>new URL(c.url).pathname.endsWith('/messages')).length,2);
  const no=harness({scope:''});await assert.rejects(no.api.review(args),/permiso de lectura/);assert.equal(no.calls.length,0);
  const denied=harness({oauthError:'access_denied'});await assert.rejects(denied.api.review(args),/no autorizó/);assert.equal(denied.calls.length,0);
  const failed=harness({fail:401});await assert.rejects(failed.api.review(args),/HTTP 401/);
  const missing=harness({missingGIS:true});await assert.rejects(missing.api.review(args),/no está preparada/);assert.equal(missing.calls.length,0);
  let inserted=0;missing.context.document={createElement(){return {remove(){}};},head:{append(script){inserted++;assert.equal(script.src,'https://accounts.google.com/gsi/client');missing.context.google={accounts:{oauth2:missing.oauth}};script.onload();}}};
  await missing.api.prepare();await missing.api.prepare();assert.equal(inserted,1);await missing.api.review(args);
  const empty=harness({pages:[{messages:[]}]});assert.equal((await empty.api.review(args)).proposals.length,0);assert(!empty.calls.some(c=>c.url.includes('generativelanguage')));
  const sent=harness({makeMessage:id=>({...message(id),labelIds:['SENT']})});assert.equal((await sent.api.review(args)).analyzedMessages,0);assert(!sent.calls.some(c=>c.url.includes('generativelanguage')));
  const ends=harness({proposals:[proposal({value:{title:'Laboratorio',date:'2026-11-20',time:'18:30',end:'20:00',details:''}})]});const endResult=await ends.api.review(args);assert.equal(endResult.proposals[0].value.end,'20:00');
  const conflicts=harness({proposals:[proposal(),proposal({value:{title:'Entregar práctica',date:'2026-11-21',time:'18:30',details:''}})]});assert((await conflicts.api.review(args)).proposals.every(p=>p.explicitCorrection));
  const html=harness({makeMessage:id=>({id,internalDate:String(now),payload:{mimeType:'text/html',headers:[],body:{data:Buffer.from('<script>malicioso()</script><p>Pr&aacute;ctica &#186; &amp; revisión</p>').toString('base64url')}}}),proposals:[]});await html.api.review(args);const htmlBody=html.calls.find(c=>c.url.includes('generativelanguage')).options.body;assert(!htmlBody.includes('malicioso'));assert(htmlBody.includes('Práctica º & revisión'));
  console.log('Gmail review: OAuth, readonly, UTF-8, pagination/cap, schema/evidence, errors and memory-only output passed. Network mocked; no live account used.');
})().catch(error=>{console.error(error);process.exitCode=1;});
