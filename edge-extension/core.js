(function(root){
  'use strict';
  const SITE='https://spotigetta.github.io/Centro-UC3M/';
  function validChat(url){try{const u=new URL(url);return u.origin==='https://chatgpt.com'&&/^\/g\/g-p-[a-f0-9]+\/project$/i.test(u.pathname)&&!u.search&&!u.hash;}catch{return false;}}
  function sourcePage(url){try{const u=new URL(url);return u.origin==='https://spotigetta.github.io'&&u.pathname.startsWith('/Centro-UC3M/');}catch{return false;}}
  function materialURL(path,course){
    if(typeof path!=='string'||path.length>2000||/[\x00-\x1f\\?#]/.test(path))throw Error('Ruta de material no válida.');
    const parts=path.split('/');
    const inFolder=parts[0]===course.folder,explicitlyLinked=Array.isArray(course.allowedPaths)&&course.allowedPaths.includes(path);
    if(parts.some(p=>!p||p==='.'||p==='..'||/%(?:2f|5c|2e)/i.test(p))||(!inFolder&&!explicitlyLinked)||!path.toLowerCase().endsWith('.pdf'))throw Error('El PDF no pertenece a la carpeta o al material enlazado de esta asignatura.');
    return SITE+'material/'+parts.map(encodeURIComponent).join('/');
  }
  function request(data,courses){
    if(!data||data.type!=='uc3m-study:open'||!Array.isArray(data.files)||data.files.length>80)throw Error('Petición de estudio no válida.');
    const course=courses.find(c=>c.id===data.courseId);if(!course)throw Error('Asignatura desconocida.');
    const files=data.files.map(f=>{if(!f||typeof f.name!=='string'||f.name.length>250||!f.name.trim())throw Error('Nombre de PDF no válido.');if(f.localOnly)throw Error('Hay un archivo disponible solo en el ordenador. Añádelo desde el explorador en el panel.');return {name:f.name,path:f.path,url:materialURL(f.path,course)};});
    return {courseId:course.id,files};
  }
  const natural=(a,b)=>String(a.name).localeCompare(String(b.name),'es',{numeric:true,sensitivity:'base'});
  const api={SITE,validChat,sourcePage,materialURL,request,natural};root.UC3MEdgeCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
