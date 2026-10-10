'use strict';
(function(global){
function buildUC3MWeekPlan(state,now=new Date()){
  const start=new Date(now.getFullYear(),now.getMonth(),now.getDate()),day=start.getDay(),first=new Date(start);first.setDate(start.getDate()+(day===0?1:1-day));
  const sunday=new Date(first);sunday.setDate(first.getDate()+6);const horizon=new Date(first);horizon.setDate(first.getDate()+20);
  const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'),weekStart=iso(first),weekEnd=iso(sunday),last=iso(horizon),subjects=new Map((state.subjects||[]).map(s=>[s.id,s.name]));
  const hidden=new Set((state.hiddenEvents||[]).map(x=>x.id));
  const events=[...(state.dataset?.events||[]),...(state.editableData?.items||[]).filter(x=>x.date&&x.status!=='cancelled').map(x=>({id:x.id,subject:x.subjectId,title:x.title,date:x.date,time:x.time,room:x.room,group:x.group,kind:x.kind||x.entity}))].filter(x=>x.date>=weekStart&&x.date<=last&&!hidden.has(x.id));
  const relevant=events.filter(x=>/práct|pract|exam|entrega|evaluaci|obligatori|prueba/i.test([x.kind,x.title].join(' '))).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
  const uncertain=x=>{const group=state.groups?.[x.subject]?.name||'',mentioned=(x.group||x.title.match(/\bG\d+(?:\s*[,/]\s*G\d+)*/i)?.[0]||'');return !!x.tentative||!!mentioned&&(!group||!mentioned.toLowerCase().includes(group.toLowerCase()))};
  const mandatory=relevant.filter(x=>!uncertain(x)),toConfirm=relevant.filter(uncertain);
  const normalizeEvent=x=>({id:x.id,date:x.date,time:x.time||'',room:x.room||'',group:x.group||'',title:x.title,subject:subjects.get(x.subject)||x.subject||'',kind:x.kind||''});
  const thisWeek=mandatory.filter(x=>x.date<=weekEnd).map(normalizeEvent),nextWeeks=mandatory.filter(x=>x.date>weekEnd).map(normalizeEvent),needsReview=toConfirm.map(normalizeEvent);
  const taskCards=(state.cards||[]).filter(x=>!x.checked&&(!x.meta?.due||x.meta.due<=last)),linked=new Set(taskCards.map(x=>x.meta?.assistantItemId).filter(Boolean));
  const tasks=[...taskCards.map(x=>({title:String(x.title||'').replace(/<br\s*\/?>/gi,' · '),date:x.meta?.due||'',subject:x.meta?.area||x.meta?.areas?.[0]||''})),...(state.editableData?.items||[]).filter(x=>x.entity==='task'&&!['completado','completed','cancelled'].includes(x.status)&&!linked.has(x.id)&&(!x.date||x.date<=last)).map(x=>({title:x.title,date:x.date||'',subject:subjects.get(x.subjectId)||x.subjectId||''}))].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
  const projects=(state.projects||[]).filter(x=>x.status!=='Finalizado').map(x=>({title:x.name,subject:x.area||x.areas?.[0]||'',status:x.status||'Pendiente'}));
  const practices=[];for(const [id,course]of Object.entries(state.dataset?.courses||{}))for(const practice of course.practices||[]){if(practice.date&&(practice.date>last||practice.date<weekStart))continue;if(practice.date&&relevant.some(x=>x.subject===id&&x.date===practice.date&&x.title.toLowerCase().includes(practice.title.toLowerCase())))continue;practices.push({title:practice.title,date:practice.date||'',subject:subjects.get(id)||id,note:practice.note||''})}
  return {weekStart,weekEnd,horizon:last,thisWeek,nextWeeks,needsReview,tasks,projects,practices};
}
function formatUC3MWeekPlan(plan){
  const lines=[`Plan UC3M · semana del ${plan.weekStart} al ${plan.weekEnd}`,''];
  const item=(x)=>`• ${x.date||'Sin fecha'}${x.time?' '+x.time:''} · ${x.subject?x.subject+' · ':''}${x.title}${x.room?' · aula '+x.room:''}${x.group?' · grupo '+x.group:''}`;
  lines.push('OBLIGATORIO ESTA SEMANA');lines.push(...(plan.thisWeek.length?plan.thisWeek.map(item):['No hay prácticas, exámenes ni entregas fechadas esta semana.']));
  lines.push('','EN LAS PRÓXIMAS SEMANAS (HASTA TRES)');lines.push(...(plan.nextWeeks.length?plan.nextWeeks.map(item):['No hay fechas obligatorias confirmadas en este intervalo.']));
  if(plan.needsReview.length){lines.push('','POR CONFIRMAR: GRUPO O FECHA');lines.push(...plan.needsReview.map(item))}
  lines.push('','TAREAS PENDIENTES');lines.push(...(plan.tasks.length?plan.tasks.slice(0,14).map(item):['No hay tareas abiertas en el Centro.']));
  lines.push('','PROYECTOS ABIERTOS');lines.push(...(plan.projects.length?plan.projects.slice(0,10).map(x=>`• ${x.subject?x.subject+' · ':''}${x.title} (${x.status})`):['No hay proyectos abiertos.']));
  if(plan.practices.length){lines.push('','PRÁCTICAS DEL CRONOGRAMA POR REVISAR');lines.push(...plan.practices.slice(0,10).map(item))}
  lines.push('','El resumen usa solo datos del Centro UC3M. Comprueba en Aula Global cualquier fecha provisional o cambio reciente.');return lines.join('\n');
}
if(typeof module!=='undefined'&&module.exports)module.exports={buildUC3MWeekPlan,formatUC3MWeekPlan};
if(global){global.buildUC3MWeekPlan=buildUC3MWeekPlan;global.formatUC3MWeekPlan=formatUC3MWeekPlan}
})(typeof window!=='undefined'?window:null);
