'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/app.js'),'utf8');
const course={id:'fabricacion',name:'SIF',folder:'SIF'};
const files=[
 {name:'10 resumen.pdf',path:'SIF/01 Introducción/10 resumen.pdf'},
 {name:'2 tema.pdf',path:'SIF/01 Introducción/2 tema.pdf'},
 {name:'1 ejercicio.pdf',path:'SIF/02 Sistemas/Prácticas/1 ejercicio.pdf'},
 {name:'Hoja.xlsx',path:'SIF/02 Sistemas/Prácticas/Hoja.xlsx'},
 {name:'03 apuntes.pdf',path:'SIF/03 apuntes.pdf'},
].map(f=>({...f,subject:course.id}));
const snapshot=JSON.stringify(files),created=[];
class Element{
 constructor(tag,cls='',text=''){this.tag=tag;this.className=cls;this.textContent=text;this.children=[];this.attributes={};this.value='';created.push(this)}
 append(...children){this.children.push(...children)}
 setAttribute(k,v){this.attributes[k]=v}
}
let opened=null;
const box={console,URLSearchParams,location:{search:''},URL:class extends URL{static createObjectURL(){return 'blob:test'}},state:{subjects:[course],files},subjects:()=>[course],node:(...args)=>new Element(...args),button:(parent,title,action,cls='')=>{const el=new Element('button',cls,title);el.onclick=action;parent.append(el);return el},window:{},filter:''};
vm.createContext(box);
vm.runInContext(source.slice(source.indexOf('const studySession='),source.indexOf('\nfunction material('))+'\nthis.api={studyTree,studyTreeFiles,studyExpandTree,studyRenderTree,studyQueue,studyToggle,studyMatches,studyIsPDF,studyAcceptLocal,studySession};',box);
const api=box.api;
const tree=api.studyTree(files,course);
assert.deepEqual(Array.from(tree.folders,x=>x.name),['01 Introducción','02 Sistemas']);
assert.deepEqual(Array.from(tree.folders[0].files,x=>x.name),['2 tema.pdf','10 resumen.pdf']);
assert.equal(tree.folders[1].folders[0].name,'Prácticas');
assert.equal(tree.folders[1].folders[0].files.length,2);
assert.equal(tree.files[0].name,'03 apuntes.pdf');
const mount=(entries,term='')=>{const start=created.length,host=new Element('main');api.studyRenderTree(host,entries,course,{term,onToggle:(list,checked)=>list.forEach(f=>api.studyToggle(course.id,f,checked)),onOpen:f=>{opened=f}});return created.slice(start)};
let nodes=mount(files),input=label=>nodes.find(n=>n.tag==='input'&&n.attributes['aria-label']===label);
const folder=input('Seleccionar carpeta: 01 Introducción');
const leaf=input('Seleccionar PDF: 2 tema.pdf');
assert.equal(folder.checked,false);assert.equal(folder.indeterminate,false);
leaf.checked=true;leaf.onchange();assert.equal(folder.checked,false);assert.equal(folder.indeterminate,true);
folder.checked=true;folder.onchange();assert.equal(api.studyQueue(course.id).length,2);assert.equal(folder.checked,true);assert.equal(folder.indeterminate,false);
folder.checked=false;folder.onchange();assert.equal(api.studyQueue(course.id).length,0);assert.equal(leaf.checked,false);
const practice=input('Seleccionar carpeta: 02 Sistemas/Prácticas');practice.checked=true;practice.onchange();assert.equal(api.studyQueue(course.id).length,1);assert(api.studyQueue(course.id).every(api.studyIsPDF));
nodes.find(n=>n.tag==='button'&&n.textContent==='1 ejercicio.pdf').onclick();assert.equal(opened.path,files[2].path);
api.studyExpandTree(course,files,false);nodes=mount(files);assert(nodes.filter(n=>n.tag==='details').every(n=>n.open===false));
const visible=files.filter(f=>api.studyMatches(f,'2 tema','pdf'));nodes=mount(visible,'2 tema');assert.equal(nodes.filter(n=>n.tag==='details').length,1);assert.equal(nodes.find(n=>n.tag==='details').open,true);
input('Seleccionar carpeta: 01 Introducción').checked=true;input('Seleccionar carpeta: 01 Introducción').onchange();assert.equal(api.studyQueue(course.id).length,2,'Filtered folder selection must not select hidden sibling PDFs');
assert.equal(api.studySession.treeOpen.get('fabricacion:01 Introducción'),false,'Searching must not overwrite folder expansion preferences');
assert.equal(JSON.stringify(files),snapshot,'Tree selection must never change the synchronized file catalog');
assert.equal(api.studyAcceptLocal(course.id,[{name:'1.pdf',webkitRelativePath:'A/1.pdf',size:30,lastModified:1},{name:'1.pdf',webkitRelativePath:'B/1.pdf',size:30,lastModified:1}]),2,'Different local folders must not collapse files with the same basename');
assert.equal(api.studyQueue('fuentes').length,0,'Selection stays isolated by subject');
console.log('PASS study tree: real folder hierarchy, natural ordering, tri-state folder selection, filtered selection, expansion preservation, open callback and local folder identity. DOM simulated.');
