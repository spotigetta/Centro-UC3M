/* Independent review: execute actual study callbacks with a small DOM. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
let detachedPDF=0,renderCalls=0;const made=[];
class Element{
  constructor(tag,cls='',text=''){this.tag=tag;this.className=cls;this.textContent=text;this.children=[];this.parent=null;this.value='';this.attributes={};this.classList={add(){},remove(){}};made.push(this)}
  get parentNode(){return this.parent}
  connected(){return this.anchor||this.parent?.connected()||false}
  walk(fn){fn(this);this.children.forEach(n=>n.walk(fn))}
  removeChild(child){if(child.connected())child.walk(n=>{if(n.tag==='iframe')detachedPDF++});this.children=this.children.filter(n=>n!==child);child.parent=null}
  append(...nodes){for(const n of nodes){if(n.parent)n.parent.removeChild(n);n.parent=this;this.children.push(n)}}
  replaceChildren(...nodes){for(const n of [...this.children])this.removeChild(n);this.append(...nodes)}
  setAttribute(k,v){this.attributes[k]=v}
  removeAttribute(k){delete this.attributes[k]}
  click(){this.onclick?.()}
}
const course={id:'fabricacion',name:'SIF',folder:'Sistemas Integrados de Fabricación',chatURL:'https://chatgpt.com/g/g-p-6abacde7c70c81919d1d1bbf077dd0a5/project'};
const files=[10,2,8,1,7,5,4,3].map(n=>({name:n+' tema.pdf',path:course.folder+'/'+n+' tema.pdf',subject:course.id,size:n}));
const state={subjects:[course],files},before=JSON.stringify(state),events=[],messages=[],controls=new Map();
const sandbox={console,state,filter:'',query:'',tab:'study',URLSearchParams,location:{origin:'https://spotigetta.github.io',search:''},URL:class extends URL{static createObjectURL(){return 'blob:local-test'}static revokeObjectURL(){}},
  subjects:()=>state.subjects,subject:id=>state.subjects.find(s=>s.id===id),node:(...a)=>new Element(...a),
  field:(parent,label,value='',type='text')=>{const el=new Element(type==='select'?'select':'input');el.value=value;el.fieldLabel=label;parent.append(el);return el},
  button:(parent,text,fn,cls='')=>{const el=new Element('button',cls,text);el.onclick=fn;parent.append(el);return el},
  link:()=>{},modal:()=>{},urlFor:p=>'material/'+p,openMaterial:()=>{},uploadDialog:()=>{},status:()=>{},render:()=>{renderCalls++},
  $:s=>controls.get(s)||null,window:{addEventListener:(name,fn)=>events.push({name,fn}),postMessage:(data,origin)=>messages.push({data,origin}),open:()=>{}},
};
controls.set('#subject-filter',new Element('select'));controls.set('#search',new Element('input'));
const context=vm.createContext(sandbox);
vm.runInContext(source.slice(source.indexOf('const studySession='),source.indexOf('function board('))+'\nthis.api={study,studyFiles,studyQueue,studyToggle,studyAcceptLocal,studyEdgePayload,studySession};',context);
const api=sandbox.api;
assert.deepEqual(Array.from(api.studyFiles(course.id),f=>f.name),['1 tema.pdf','2 tema.pdf','3 tema.pdf','4 tema.pdf','5 tema.pdf','7 tema.pdf','8 tema.pdf','10 tema.pdf']);
const ui=new Element('main');ui.anchor=true;api.study(ui);
const checkboxes=()=>made.filter(n=>n.tag==='input'&&n.type==='checkbox'&&n.connected());
assert.equal(checkboxes().length,8);
for(const check of checkboxes()){check.checked=true;check.onchange()}
assert.equal(api.studyQueue(course.id).length,8);
assert.equal(api.studyEdgePayload(course.id).files.length,8);
assert.equal(detachedPDF,0,'Adding another PDF must not disconnect/reload the active iframe');
const search=made.find(n=>n.fieldLabel==='Buscar en esta asignatura');search.value='10';search.oninput();
assert.equal(checkboxes().length,1);assert.equal(api.studyQueue(course.id).length,8);assert.equal(renderCalls,0);assert.equal(detachedPDF,0);
assert.equal(api.studyAcceptLocal(course.id,[{name:'Notas.pdf',size:50,lastModified:1}]),1);
assert.equal(api.studyEdgePayload(course.id).files.length,8,'Local file must never cross the window bridge');
assert.equal(JSON.stringify(state),before,'Temporary PDFs must never enter synced state');
assert(!JSON.stringify(api.studyEdgePayload(course.id)).includes('blob:'));
const bridge=require('../edge-extension/core.js'),courses=JSON.parse(fs.readFileSync(path.join(root,'edge-extension/courses.json'),'utf8'));
assert.equal(bridge.request(api.studyEdgePayload(course.id),courses).files.length,8,'App payload must be accepted by actual extension contract');
assert.throws(()=>bridge.request({type:'uc3m-study:open',courseId:course.id,files:[{name:'x.pdf',path:'../x.pdf'}]},courses));
assert.equal(bridge.sourcePage('https://spotigetta.github.io/Centro-UC3M/evil'),true);
assert.equal(bridge.sourcePage('https://spotigetta.github.io/Other/'),false);
assert.equal(bridge.sourcePage('https://spotigetta.github.io.evil.test/Centro-UC3M/'),false);
assert(!bridge.validChat('https://chatgpt.com.evil.test/g/g-p-123/project'));
assert(!made.some(n=>n.tag==='iframe'&&String(n.src).includes('chatgpt.com')));
console.log('PASS study integration: eight files, numeric ordering, live selection/search, connected PDF, private local files, extension contract and origin restrictions. DOM simulated; no browser or extension installation.');
