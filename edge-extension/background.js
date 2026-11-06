importScripts('core.js');
let coursesPromise;
const courses=()=>coursesPromise??=fetch(chrome.runtime.getURL('courses.json')).then(r=>r.json());
chrome.runtime.onInstalled.addListener(()=>chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(()=>{}));
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(()=>{});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(message?.type!=='uc3m-study:open')return;
  if(!sender.tab||!UC3MEdgeCore.sourcePage(sender.url)){reply({ok:false,message:'Origen del Centro no válido.'});return;}
  // Preserve the click gesture before awaiting course loading or storage.
  const opening=chrome.sidePanel.open({windowId:sender.tab.windowId}).then(()=>true,()=>false);
  courses().then(list=>UC3MEdgeCore.request(message,list)).then(async request=>{
    const pending={...request,id:crypto.randomUUID(),createdAt:Date.now()};
    await chrome.storage.local.set({pendingStudy:pending,selectedCourse:request.courseId});
    const course=(await courses()).find(c=>c.id===request.courseId);
    if(UC3MEdgeCore.validChat(course?.chatURL))await chrome.tabs.create({url:course.chatURL});
    const opened=await opening;
    reply({ok:true,message:opened?'Selección enviada al panel de estudio.':'Selección preparada. Pulsa la extensión «Centro UC3M: estudio con PDF» para abrir el panel.'});
  }).catch(error=>reply({ok:false,message:error.message}));
  return true;
});
