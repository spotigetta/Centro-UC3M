'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {planImport,validateProposal}=require('../src/shared/mail-kanban.js');
let checks=0;
function check(value,why){assert.ok(value,why);checks++}
const base=()=>({subjects:[{id:'fabricacion',name:'Sistemas Integrados de Fabricación'},{id:'adye',name:'ADEM'}],cards:[],editableData:{items:[]}});
const proposal=()=>({proposalId:'abcdef123456-0',operation:'add',entity:'practice',courseId:'fabricacion',
  value:{title:'Práctica 1 de fabricación',date:'2026-11-20',time:'19:00',details:'Texto privado extraído del correo'},
  reason:'Dato observado en correo académico.',evidenceMessageIds:['abcdef123456'],evidenceSubject:'Asunto privado',
  evidenceDate:'2026-11-06T09:30:00Z',confidence:.95,status:'pending_review'});
const add=(state,plan)=>{if(plan.card)state.cards.push(plan.card);if(plan.academicItem)state.editableData.items.push(plan.academicItem)};
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}return value}
let state=base(),p=proposal();const before=JSON.stringify({state,p});const result=planImport(freeze(state),freeze(p));
check(result.status==='add'&&result.card&&result.academicItem,'practice yields task and academic record');
check(JSON.stringify({state,p})===before,'planner does not mutate frozen state or proposal');
check(result.card.lane==='Entrada'&&!result.card.checked&&result.card.meta.area===state.subjects[0].name,'correct kanban initial state and subject');
check(result.academicItem.entity==='task'&&result.academicItem.kind==='practice'&&result.academicItem.status==='pendiente','canonical Obsidian entity and status');
check(result.card.meta.assistantItemId===result.academicItem.id&&result.card.meta.id===result.card.id,'card links its academic item and has Obsidian metadata id');
const expectedHash=crypto.createHash('sha256').update(JSON.stringify(['uc3m-mail-v1',p.courseId,p.entity,p.proposalId])).digest('hex');
check(result.academicItem.provenance.fingerprint===expectedHash,'browser SHA-256 equals native SHA-256');
const publicJson=JSON.stringify(result);
check(!publicJson.includes(p.proposalId)&&!publicJson.includes(p.evidenceMessageIds[0])&&!publicJson.includes(p.evidenceSubject)&&!publicJson.includes(p.value.details),'no raw message IDs, subject or private details in public result');
check(result.academicItem.details===''&&Object.keys(result.academicItem.provenance).sort().join(',')==='evidenceFingerprint,fingerprint,kind,receivedDate','public provenance is strictly whitelisted');
state=base();add(state,structuredClone(result));state.cards[0].checked=true;state.cards[0].lane='Finalizada';state.cards[0].meta.note='Local';
const progress=JSON.stringify(state);check(planImport(state,proposal()).status==='duplicate','repeat is idempotent');
check(JSON.stringify(state)===progress,'repeat preserves local progress and extra fields');
p=proposal();p.confidence=.88;p.evidenceSubject='Otro asunto';p.reason='Otra justificación';p.value.details='Texto actualizado';
check(planImport(state,p).status==='duplicate','annotation changes do not create duplicates');
p=proposal();p.proposalId='abcdef9999-7';p.evidenceMessageIds=['abcdef9999'];p.value.title='PRACTICA 1 DE FABRICACION';
check(planImport(state,p).status==='duplicate','equivalent second message deduplicates accent/case/whitespace title');
p=proposal();p.value.date='2026-11-21';const conflict=planImport(state,p);
check(conflict.status==='review'&&!conflict.card&&!conflict.academicItem,'changed date is review, never silent overwrite');
p=proposal();p.value.time='17:00';check(planImport(state,p).status==='review','changed time requires review');
p=proposal();p.explicitCorrection=true;check(planImport(base(),p).status==='review','explicit correction requires review even without existing match');
p=proposal();p.reason='El correo declara una corrección; compara con la fecha actual antes de aceptar.';check(planImport(base(),p).status==='review','legacy schema correction encoded in reason is detected');
for(const operation of ['update','delete']){p=proposal();p.operation=operation;check(validateProposal(base(),p)&&planImport(base(),p).status==='review',operation+' can be previewed but never applied automatically')}
for(const entity of ['material','announcement','evaluation_component']){p=proposal();p.entity=entity;const r=planImport(base(),p);check(r.status==='ignored'&&!r.card&&!r.academicItem,entity+' creates no false task')}
for(const entity of ['task','practice','exam']){p=proposal();p.entity=entity;p.value.date='';p.value.time='';check(planImport(base(),p).status==='add',entity+' permits genuinely unknown date without inventing it')}
p=proposal();p.entity='schedule_event';p.value.end='20:30';let event=planImport(base(),p);
check(event.status==='add'&&!event.card&&event.academicItem.entity==='event'&&event.academicItem.end==='20:30','explicit schedule creates calendar item only and preserves end');
p.value.date='';check(planImport(base(),p).status==='review','undated event requires review');
for(const date of ['2026-02-29','2026-04-31','2026-13-01','2026-11-00','06/11/2026']){p=proposal();p.value.date=date;check(!validateProposal(base(),p)&&planImport(base(),p).status==='ignored','reject nonexistent/malformed date '+date)}
p=proposal();p.value.date='2028-02-29';check(validateProposal(base(),p),'valid leap day accepted');
for(const time of ['24:00','12:60','9:00','not a time']){p=proposal();p.value.time=time;check(!validateProposal(base(),p),'reject malformed time '+time)}
for(const end of ['18:59','19:00','25:00']){p=proposal();p.value.end=end;check(!validateProposal(base(),p),'reject invalid or nonpositive duration '+end)}
for(const confidence of [NaN,Infinity,-1,1.1,'1']){p=proposal();p.confidence=confidence;check(!validateProposal(base(),p),'reject malformed confidence')}
p=proposal();p.confidence=1;p.evidenceMessageIds=[];check(!validateProposal(base(),p),'confidence alone is not evidence');
p=proposal();p.courseId='unknown';check(!validateProposal(base(),p),'unknown subject rejected');
p=proposal();p.value.title='x'.repeat(201);check(!validateProposal(base(),p),'title length capped');
p=proposal();p.value.details='x'.repeat(2001);check(!validateProposal(base(),p),'private details length capped');
p=proposal();p.value.title='';check(!validateProposal(base(),p),'empty title rejected');
p=proposal();p.value.title='abc\u0000def';check(!validateProposal(base(),p),'control character rejected');
p=JSON.parse(JSON.stringify(proposal()).replace('"operation":"add"','"operation":"add","__proto__":{"polluted":true}'));
check(!validateProposal(base(),p)&&({}).polluted===undefined,'prototype injection rejected');
p=proposal();p.value=JSON.parse('{"title":"x","date":"","time":"","details":"","constructor":{"prototype":{"polluted":true}}}');
check(!validateProposal(base(),p),'nested prototype key rejected');
p=proposal();p.value=Object.create({title:'inherited'});check(!validateProposal(base(),p),'inherited payload fields rejected');
p=proposal();let getterCalled=false;Object.defineProperty(p,'courseId',{get(){getterCalled=true;return 'fabricacion'}});
check(!validateProposal(base(),p)&&!getterCalled,'accessor payload rejected without executing getter');
p=proposal();p.value.extra={apiKey:'secret'};p.auth='secret';const safe=planImport(base(),p);
check(safe.status==='add'&&!JSON.stringify(safe).includes('secret'),'unknown fields never copied');
p=proposal();p.courseId='adye';check(planImport(state,p).status==='add','same title in another course is independent');
p=proposal();state=base();state.cards.push({title:p.value.title,checked:true,lane:'Finalizada',meta:{area:state.subjects[0].name,due:p.value.date,time:p.value.time}});
check(planImport(state,p).status==='duplicate','manual task is not duplicated or reset');
for(const [status,lane,checked]of [['confirmed','Entrada',false],['en curso','En curso',false],['completado','Finalizada',true]]){
 p=proposal();state=base();state.editableData.items.push({id:'usr-mail-legacy',entity:'practice',subjectId:p.courseId,title:p.value.title,date:p.value.date,time:p.value.time,status,provenance:{kind:'email-reviewed'}});
 const snapshot=JSON.stringify(state),backfill=planImport(state,p);
 check(backfill.status==='add'&&backfill.card&&!backfill.academicItem&&backfill.card.meta.assistantItemId==='usr-mail-legacy','legacy academic-only import gets card-only backfill');
 check(backfill.card.lane===lane&&backfill.card.checked===checked&&JSON.stringify(state)===snapshot,'backfill preserves '+status+' and does not mutate old record');
 add(state,backfill);check(planImport(state,p).status==='duplicate','legacy backfill is idempotent');
}
for(const status of ['cancelled','cancelado']){state=base();p=proposal();state.editableData.items.push({...structuredClone(result.academicItem),status});const r=planImport(state,p);check(r.status==='duplicate'&&!r.card,'cancelled item never reopens')}
state=base();p=proposal();state.editableData.items.push({...structuredClone(result.academicItem),status:'custom closed state'});check(planImport(state,p).status==='review','unknown legacy state does not silently reopen');
state=base();p=proposal();p.entity='schedule_event';state.dataset={events:[{id:'official',subject:p.courseId,title:p.value.title,date:p.value.date,time:p.value.time}]};check(planImport(state,p).status==='duplicate','schedule import does not duplicate official calendar');
state=base();state.activities=[{id:'activity',area:state.subjects[0].name,title:p.value.title,date:p.value.date,time:p.value.time}];check(planImport(state,p).status==='duplicate','schedule import does not duplicate Obsidian activity');
p.value.date='2026-11-21';check(planImport(state,p).status==='review','changed existing calendar date requires review');
state=base();p=proposal();p.value.title='Entregar practica dos';add(state,planImport(state,p));state.cards[0].checked=true;state.cards[0].lane='Finalizada';
const completedSnapshot=JSON.stringify(state);p.proposalId='abcdef123456-222';p.value.title='Entrega de la practica 2';
const reworded=planImport(state,p);check(reworded.status==='review'&&!reworded.card&&!reworded.academicItem,'same evidence with reworded title and new model ID requires review');
check(JSON.stringify(state)===completedSnapshot&&state.cards[0].checked,'reworded completed task never reopens');
p.value.title='Entregar informe diferente';check(planImport(state,p).status==='review','second distinct fact in same email is reviewed, not silently deduplicated');
p=proposal();p.evidenceMessageIds=['def123','abcdef123456'];const ordered=planImport(base(),p);p.evidenceMessageIds=['ABCDEF123456','def123','def123'];
check(planImport(base(),p).academicItem.provenance.evidenceFingerprint===ordered.academicItem.provenance.evidenceFingerprint,'evidence hash ignores ordering, duplicates and hex case');
const expectedEvidenceHash=crypto.createHash('sha256').update(JSON.stringify(['uc3m-mail-evidence-v1',p.courseId,p.entity,['abcdef123456','def123']])).digest('hex');
check(ordered.academicItem.provenance.evidenceFingerprint===expectedEvidenceHash,'evidence SHA-256 equals native hash');
for(const entity of ['task','practice','exam']){
 p=proposal();p.entity=entity;state=base();state.dataset={events:[{id:'official',subject:p.courseId,title:p.value.title,date:p.value.date,time:p.value.time}]};
 const r=planImport(state,p);check(r.status==='review'&&!r.card&&!r.academicItem,'official '+entity+' calendar entry requires review, not a duplicate event');
 p.value.date='2026-11-21';check(planImport(state,p).status==='review','official '+entity+' date discrepancy remains review-only');
}
console.log(JSON.stringify({suite:'mail-kanban',checks,result:'PASS',mutations:0,networkCalls:0}));
