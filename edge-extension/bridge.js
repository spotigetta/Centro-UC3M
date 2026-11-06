(() => {
  'use strict';
  if(location.origin!=='https://spotigetta.github.io'||!location.pathname.startsWith('/Centro-UC3M/'))return;
  window.addEventListener('message',event=>{
    if(event.source!==window||event.origin!==location.origin)return;
    if(event.data?.type==='uc3m-study:ping'){window.postMessage({type:'uc3m-study:ready',version:1},location.origin);return;}
    if(event.data?.type!=='uc3m-study:open')return;
    chrome.runtime.sendMessage(event.data).then(result=>window.postMessage({type:'uc3m-study:result',...result},location.origin)).catch(()=>window.postMessage({type:'uc3m-study:result',ok:false,message:'No se pudo contactar con la extensión. Recarga la página y vuelve a intentarlo.'},location.origin));
  });
  window.postMessage({type:'uc3m-study:ready',version:1},location.origin);
})();
