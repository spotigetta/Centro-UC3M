'use strict';
// Adapter tests use an in-memory vault and filesystem; no academic data is edited.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const M=require('../src/shared/mail-kanban.js');
const source=fs.readFileSync(path.join(root,'.obsidian/Centro-UC3M-Obsidian/.obsidian/plugins/uc3m-study-center/academic-mail-kanban.js'),'utf8');
const files=new Map(),fakefs={existsSync:p=>files.has(p),readFileSync:p=>{if(!files.has(p))throw Error('missing file');return files.get(p)},writeFileSync:(p,v)=>files.set(p,v),copyFileSync:(a,b)=>files.set(b,files.get(a)),mkdirSync:()=>{},unlinkSync:p=>files.delete(p)};
const subjects=[{id:'fabricacion',name:'SIF'},{id:'adye',name:'ADEM'}];
const parse=md=>{const lines=md.split('\n'),cards=[];for(let i=0;i<lines.length;i++)if(lines[i].startsWith('CARD:'))cards.push({...JSON.parse(lines[i].slice(5)),index:i});return {lines,cards}};
const studio={read:md=>JSON.parse((md.match(/^STUDIO:(.*)$/m)||[])[1]||'{"activities":[]}'),write:(md,s)=>md.replace(/^STUDIO:.*\n?/m,'')+'\nSTUDIO:'+JSON.stringify(s)};
const C={read:()=>({subjects,cards:{}}),subjectsOf:c=>c.meta.areas,validColor:x=>x||'#000066'};
class View{
 constructor(){this.data='## Entrada\n';this.model=parse(this.data);this.file={path:'panel.md'};this.plugin={studioApi:studio};this.app={vault:{adapter:{basePath:'/mock'}}}}
 async change(fn){const next=fn(this.data);if(this.failWrite)throw Error('simulated vault write failure');this.data=next;this.model=parse(next)}
 async ucChange(fn){return this.change(md=>fn(C.read(md),parse(md),md))}
 async saveCard(old,next){return this.change(md=>{const p=parse(md),current=p.cards.find(c=>c.meta.id===old.meta.id);if(!current)throw Error('missing card');p.lines[current.index]='CARD:'+JSON.stringify(next);return p.lines.join('\n')})}
 async syncAssistantCards(store){this.lastAssistant=store}
}
class Plugin{async onload(){}}
const sandbox={module:{exports:{}},UC3MMailKanban:M,require:n=>n==='fs'?fakefs:n==='path'?path:n==='obsidian'?{Modal:class{}}:null,navigator:{},console};
vm.runInNewContext(source,sandbox);sandbox.module.exports(Plugin,View,{button(){},field(){},Notice:class{},parse,cardLine:c=>'CARD:'+JSON.stringify(c),C});
const target=path.join('/mock','Centro UC3M','Datos fuente','datos-academicos-editables.json');
const empty={schemaVersion:'1.0.0',revision:0,updatedAt:null,items:[]};
const proposal={proposalId:'abc-1',operation:'add',entity:'task',courseId:'fabricacion',value:{title:'Exercise',date:'2026-11-20',time:'',details:'PRIVATE BODY'},confidence:.9,evidenceMessageIds:['abcdef'],evidenceSubject:'PRIVATE SUBJECT',evidenceDate:'2026-11-06T00:00:00Z'};
const read=()=>JSON.parse(files.get(target));
const preview=view=>({base:view.data,storeText:JSON.stringify(read())});
async function run(){
 files.set(target,JSON.stringify(empty));const view=new View();
 await view.ucApplyMailImport(preview(view),[proposal]);assert.equal(view.model.cards.length,1);assert.equal(read().items.length,1);
 for(const privateText of ['PRIVATE BODY','PRIVATE SUBJECT']){assert(!view.data.includes(privateText));assert(!files.get(target).includes(privateText))}
 assert.equal(M.planImport({subjects,cards:view.model.cards,editableData:read()},proposal).status,'duplicate');
 let card=view.model.cards[0];await view.saveCard(card,{...card,title:'Revised exercise',lane:'En curso',meta:{...card.meta,due:'2026-11-23',time:'17:00',area:'ADEM',areas:['ADEM']}});
 let item=read().items[0];assert.equal(item.title,'Revised exercise');assert.equal(item.date,'2026-11-23');assert.equal(item.time,'17:00');assert.equal(item.subjectId,'adye');assert.equal(item.status,'en curso');
 card=view.model.cards[0];await view.saveCard(card,{...card,checked:true,lane:'Finalizada'});assert.equal(read().items[0].status,'completado');
 await view.syncAssistantCards(read());await view.syncAssistantCards(read());assert.equal(view.model.cards.length,1);assert(view.model.cards[0].checked);assert.equal(view.lastAssistant.items.length,0);
 const event={...proposal,proposalId:'abc-2',entity:'schedule_event',value:{title:'Lab',date:'2026-11-21',time:'15:30',end:'17:00',details:''}};
 await view.ucApplyMailImport(preview(view),[event]);assert.equal(studio.read(view.data).activities.length,1);assert.equal(studio.read(view.data).activities[0].end,'17:00');assert.equal(view.model.cards.length,1);
 const fresh=new View();await fresh.syncAssistantCards(read());await fresh.syncAssistantCards(read());assert.equal(fresh.model.cards.length,1);assert(fresh.model.cards[0].checked);assert.equal(studio.read(fresh.data).activities.length,1);
 const revision=read().revision;await assert.rejects(()=>view.ucApplyMailImport({...preview(view),base:'stale'},[proposal]),/panel/);assert.equal(read().revision,revision);
 const oldJSON=files.get(target),oldMD=view.data;view.failWrite=true;card=view.model.cards[0];await assert.rejects(()=>view.saveCard(card,{...card,title:'Rejected edit'}),/simulated/);assert.equal(files.get(target),oldJSON);assert.equal(view.data,oldMD);view.failWrite=false;
 // Deletion records cancellation, and subsequent web mirror sync must not reopen it.
 await view.change(md=>md.split('\n').filter(line=>!line.startsWith('CARD:')).join('\n'));assert.equal(read().items[0].status,'cancelado');
 await view.syncAssistantCards(read());assert.equal(view.model.cards.length,0);const cancelledFresh=new View();await cancelledFresh.syncAssistantCards(read());assert.equal(cancelledFresh.model.cards.length,0);
 assert(source.includes("String(proposal.value?.details||'')"));assert(source.includes('Detalle privado: no se copia al panel'));
 console.log('PASS Obsidian mail adapter: import/privacy/dedup, linked card edits and progress, calendar/end, repeated web mirrors, completed/cancelled preservation, stale data and rollback.');
}
run().catch(error=>{console.error(error);process.exitCode=1});
