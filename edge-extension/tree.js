(function(root){
 'use strict';
 const natural=(a,b)=>String(a).localeCompare(String(b),'es',{numeric:true,sensitivity:'base'});
 const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function filePath(record,rootFolder=''){
  let value=String(record.path||record.relativePath||record.name||'').replace(/\\/g,'/');
  if(rootFolder&&value.startsWith(rootFolder+'/'))value=value.slice(rootFolder.length+1);
  return value.split('/').filter(part=>part&&part!=='.'&&part!=='..').join('/')||record.name||'Documento.pdf';
 }
 function build(records,rootFolder=''){
  const rootNode={name:'',path:'',folders:new Map(),files:[]};
  for(const record of records){const parts=filePath(record,rootFolder).split('/'),name=parts.pop();let node=rootNode;
   for(const part of parts){if(!node.folders.has(part))node.folders.set(part,{name:part,path:node.path?node.path+'/'+part:part,folders:new Map(),files:[]});node=node.folders.get(part);}
   node.files.push({id:record.id,name,record});
  }
  function finish(node){const folders=[...node.folders.values()].sort((a,b)=>natural(a.name,b.name)).map(finish),files=node.files.sort((a,b)=>natural(a.name,b.name));return {name:node.name,path:node.path,folders,files,ids:[...folders.flatMap(f=>f.ids),...files.map(f=>f.id)]};}
  return finish(rootNode);
 }
 function filter(node,query,selectedOnly=false,selected=new Set()){
  const term=normalize(query),folderMatches=term&&normalize(node.path).includes(term);
  const folders=node.folders.map(f=>filter(f,folderMatches?'':query,selectedOnly,selected)).filter(f=>f.files.length||f.folders.length);
  const files=node.files.filter(f=>(!selectedOnly||selected.has(f.id))&&(!term||folderMatches||normalize(f.name).includes(term)));
  return {...node,folders,files,ids:[...folders.flatMap(f=>f.ids),...files.map(f=>f.id)]};
 }
 function selection(ids,selected){const count=ids.filter(id=>selected.has(id)).length;return {checked:ids.length>0&&count===ids.length,indeterminate:count>0&&count<ids.length,count,total:ids.length};}
 function toggle(ids,selected,checked){for(const id of ids)checked?selected.add(id):selected.delete(id);return selected;}
 const api={natural,normalize,filePath,build,filter,selection,toggle};root.UC3MEdgeTree=api;if(typeof module!=='undefined')module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
