/* Independent integration review: actual panel tree callbacks, no installed extension. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),tree=require('../edge-extension/tree.js');
const source=fs.readFileSync(path.join(root,'edge-extension/panel.js'),'utf8');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.attributes={};this.value='';this.checked=false;this.scrollTop=0;this.hidden=false;this.open=false;this.textContent=''}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(key,value){this.attributes[key]=value}
}
const elements=new Map(),get=key=>{if(!elements.has(key))elements.set(key,new Element());return elements.get(key)};
const records=[1,2,3,4,5,6,7,10].map(n=>({id:'pdf-'+n,courseId:'fabricacion',name:n+' tema.pdf',path:'SIF/01 Teoría/'+n+' tema.pdf',size:10}));
let opened=0;const writes=[];
const box={console,UC3MEdgeTree:tree,document:{createElement:tag=>new Element(tag)},chrome:{storage:{local:{set:async data=>{writes.push(data)}}}},$:get,say:()=>{},showPDF:async()=>{opened++}};
vm.createContext(box);
vm.runInContext('const courses=[{id:"fabricacion",name:"SIF",folder:"SIF"}];let selectedCourse="fabricacion",activeId="pdf-1";const selections=new Map(),expandedFolders=new Set(),collapsedFolders=new Set();let records='+JSON.stringify(records)+';'+source.slice(source.indexOf('function chosen('),source.indexOf('function clearPDF('))+';this.api={renderList,chosen};',box);
const nodes=parent=>[parent,...parent.children.flatMap(nodes)];
const folder=()=>nodes(get('#list')).find(n=>n.attributes['aria-label']==='Seleccionar carpeta 01 Teoría');
const pdf=n=>nodes(get('#list')).find(e=>e.attributes['aria-label']==='Seleccionar '+n+' tema.pdf');
box.api.renderList();assert.equal(get('#library-count').textContent,'8 PDF');assert.equal(get('#selection-count').textContent,'0 seleccionados de 8');
pdf(1).checked=true;pdf(1).onchange();assert.equal(folder().indeterminate,true);assert.equal(box.api.chosen().size,1);assert.equal(opened,0,'Changing selection must not reopen/reset the active PDF');
folder().checked=true;folder().onchange();assert.equal(box.api.chosen().size,8);assert.equal(folder().checked,true);assert.equal(folder().indeterminate,false);assert.equal(get('#selection-count').textContent,'8 seleccionados de 8');
box.api.chosen().clear();get('#search').value='2 tema';box.api.renderList();folder().checked=true;folder().onchange();
assert.deepEqual([...box.api.chosen()],['pdf-2'],'Selecting a search-filtered folder must not select invisible sibling PDFs');
assert.equal(get('#selection-count').textContent,'1 seleccionados de 8');assert.equal(get('#list').hidden,false);assert.equal(opened,0);
get('#search').value='';get('#selected-only').checked=true;box.api.renderList();assert.equal(nodes(get('#list')).filter(e=>e.tag==='input'&&e.attributes['aria-label']?.startsWith('Seleccionar ')&&!e.attributes['aria-label'].startsWith('Seleccionar carpeta')).length,1);assert.equal(box.api.chosen().size,1);
get('#selected-only').checked=false;box.api.renderList();assert.equal(nodes(get('#list')).filter(e=>e.tag==='input'&&e.attributes['aria-label']?.startsWith('Seleccionar ')&&!e.attributes['aria-label'].startsWith('Seleccionar carpeta')).length,8);assert.equal(box.api.chosen().size,1);
assert(writes.length>=3,'Checkbox changes must persist selection to extension-local storage');
assert(!writes.some(x=>JSON.stringify(x).includes('blob:')),'Selection persistence must not contain PDF object URLs');
console.log('PASS independent tree integration: folder tri-state, eight PDFs, filtered folder selection, visible library/count, retained selection, no PDF reset, local-only selection persistence. DOM simulated; no CUA.');
