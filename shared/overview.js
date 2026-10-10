'use strict';
(function(global){
function renderUC3MOverview(root,model){
  const doc=root.ownerDocument;
  const el=(tag,cls,text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node};
  const cards=(model.cards||[]).filter(card=>!card.checked).sort((a,b)=>(a.meta?.due||'9999').localeCompare(b.meta?.due||'9999'));
  const projects=(model.projects||[]).filter(project=>project.status!=='Finalizado');
  const next=(model.events||[]).find(event=>event.date>=model.today);
  root.replaceChildren();
  const panel=(title,count)=>{const section=el('section'),header=el('header');header.append(el('span','',title),el('b','',count));section.append(header);root.append(section);return section};
  const pending=panel('Pendientes',cards.length),list=el('div','overview-list uc3m-overview-list');
  for(const card of cards.slice(0,4)){
    const row=el('label'),check=el('input');check.type='checkbox';check.onchange=()=>model.onToggle(card);
    row.append(check,el('span','',global.UC3MMarkdown?.plain(card.title)||card.title));if(card.meta?.due)row.append(el('small','',card.meta.due));list.append(row);
  }
  if(!cards.length)list.append(el('p','overview-empty uc3m-overview-empty','Todo al día'));
  pending.append(list);
  const projectSection=panel('Proyectos',projects.length);
  for(const project of projects.slice(0,3)){
    const row=el('div','project-mini uc3m-project-mini'),phases=el('div','pdca-mini uc3m-pdca-mini');
    row.append(el('strong','',project.name));
    const level=project.status==='En curso'?1:0;
    for(const [index,label]of ['Plan','Hacer','Verificar','Actuar'].entries())phases.append(el('span',index<=level?'active':'',label));
    row.append(phases);projectSection.append(row);
  }
  if(!projects.length)projectSection.append(el('p','overview-empty uc3m-overview-empty','Sin proyectos activos'));
  const upcoming=panel('Próximo',next?.date||'—');
  if(next){
    upcoming.append(el('strong','next-title uc3m-next-title',next.title));
    upcoming.append(el('p','',[model.timeRange(next),next.room,next.kind].filter(Boolean).join(' · ')));
    const subject=(model.subjects||[]).find(item=>item.id===next.subject);
    if(subject)upcoming.append(el('small','',subject.name));
  }else upcoming.append(el('p','overview-empty uc3m-overview-empty','No hay próximos eventos'));
}
if(typeof module!=='undefined'&&module.exports)module.exports=renderUC3MOverview;
if(global)global.renderUC3MOverview=renderUC3MOverview;
})(typeof window!=='undefined'?window:null);
