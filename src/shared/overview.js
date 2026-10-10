'use strict';
(function(global){
function renderUC3MOverview(root,model){
  const doc=root.ownerDocument,el=(tag,cls='',value)=>{const item=doc.createElement(tag);item.className=cls;if(value!==undefined)item.textContent=String(value);return item};
  const cards=(model.cards||[]).filter(card=>!card.checked).sort((a,b)=>(a.meta?.due||'9999').localeCompare(b.meta?.due||'9999'));
  const projects=(model.projects||[]).filter(project=>project.status!=='Finalizado');
  const significant=(model.events||[]).filter(event=>event.date>=model.today&&/práct|pract|exam|evaluaci|entrega|obligatori/i.test(event.kind+' '+event.title));
  const next=significant[0]||(model.events||[]).find(event=>event.date>=model.today);
  root.replaceChildren();
  const panel=(className,eyebrow,title,count)=>{const section=el('section','overview-orbit '+className),header=el('header','overview-orbit-head');header.append(el('span','overview-orbit-symbol',eyebrow),el('div','overview-orbit-title',title),el('b','overview-orbit-count',count));section.append(header);root.append(section);return section};
  const pending=panel('overview-pending','✦','Pendientes',cards.length),list=el('div','overview-list');
  for(const card of cards.slice(0,4)){const row=el('label','overview-task'),check=el('input');check.type='checkbox';check.setAttribute('aria-label','Completar '+card.title);check.onchange=()=>model.onToggle(card);row.append(check,el('span','',global.UC3MMarkdown?.plain(card.title)||card.title));if(card.meta?.due)row.append(el('time','',card.meta.due));list.append(row)}
  if(!cards.length)list.append(el('p','overview-empty','Nada pendiente ahora'));pending.append(list);
  const active=panel('overview-projects','◈','Proyectos en marcha',projects.length);
  for(const project of projects.slice(0,3)){const row=el('div','overview-project');row.append(el('strong','',project.name),el('small','',project.status||'Pendiente'));const phases=el('div','overview-phases');for(const [index,name]of ['Plan','Hacer','Verificar','Actuar'].entries())phases.append(el('span',index<=(project.status==='En curso'?1:0)?'active':'',name));row.append(phases);active.append(row)}
  if(!projects.length)active.append(el('p','overview-empty','Sin proyectos abiertos'));
  const upcoming=panel('overview-next','✧','Próxima cita',next?.date||'—');
  if(next){const subject=(model.subjects||[]).find(item=>item.id===next.subject);upcoming.append(el('strong','overview-next-name',next.title));upcoming.append(el('p','overview-next-meta',[model.timeRange(next),next.room,next.kind].filter(Boolean).join(' · ')));if(subject)upcoming.append(el('small','overview-next-course',subject.name))}
  else upcoming.append(el('p','overview-empty','Sin fechas próximas'));
}
if(typeof module!=='undefined'&&module.exports)module.exports=renderUC3MOverview;
if(global)global.renderUC3MOverview=renderUC3MOverview;
})(typeof window!=='undefined'?window:null);
