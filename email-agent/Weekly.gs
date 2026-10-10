/** Resumen dominical privado. Se envía solo al propietario del script. */
function estadoCentroActual() {
  const token=PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if(!token)throw Error('Falta GITHUB_TOKEN de solo lectura para consultar data/state.json');
  const response=UrlFetchApp.fetch('https://api.github.com/repos/spotigetta/Centro-UC3M/contents/data/state.json?ref=main',{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'},muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw Error('GitHub '+response.getResponseCode()+': no se pudo leer el estado del Centro');
  const data=JSON.parse(response.getContentText());return JSON.parse(Utilities.newBlob(Utilities.base64Decode(data.content.replace(/\s/g,''))).getDataAsString('UTF-8'));
}
function planSemanalCorreo(state,now) {
  const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()),day=date.getDay(),first=new Date(date);first.setDate(date.getDate()+(day===0?1:1-day));
  const weekEnd=new Date(first);weekEnd.setDate(first.getDate()+6);const horizon=new Date(first);horizon.setDate(first.getDate()+20);
  const iso=d=>Utilities.formatDate(d,'Europe/Madrid','yyyy-MM-dd'),start=iso(first),end=iso(weekEnd),last=iso(horizon),names={};for(const subject of state.subjects||[])names[subject.id]=subject.name;
  const hidden=new Set((state.hiddenEvents||[]).map(item=>item.id));
  const events=[...(state.dataset?.events||[]),...(state.editableData?.items||[]).filter(item=>item.date&&item.status!=='cancelled').map(item=>({id:item.id,subject:item.subjectId,title:item.title,date:item.date,time:item.time,room:item.room,group:item.group,kind:item.kind||item.entity}))].filter(item=>item.date>=start&&item.date<=last&&!hidden.has(item.id)&&/práct|pract|exam|entrega|evaluaci|obligatori|prueba/i.test((item.kind||'')+' '+item.title)).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
  const uncertain=item=>{const group=state.groups?.[item.subject]?.name||'',mentioned=item.group||item.title.match(/\bG\d+(?:\s*[,/]\s*G\d+)*/i)?.[0]||'';return !!item.tentative||!!mentioned&&(!group||!mentioned.toLowerCase().includes(group.toLowerCase()))};
  const formatEvent=item=>`• ${item.date}${item.time?' '+item.time:''} · ${names[item.subject]||item.subject||''} · ${item.title}${item.room?' · aula '+item.room:''}${item.group?' · grupo '+item.group:''}`;
  const confirmed=events.filter(item=>!uncertain(item)),thisWeek=confirmed.filter(item=>item.date<=end).map(formatEvent),later=confirmed.filter(item=>item.date>end).map(formatEvent),needsReview=events.filter(uncertain).map(formatEvent);
  const cardTasks=(state.cards||[]).filter(item=>!item.checked&&(!item.meta?.due||item.meta.due<=last)),linked=new Set(cardTasks.map(item=>item.meta?.assistantItemId).filter(Boolean));
  const tasks=[...cardTasks.map(item=>({date:item.meta?.due||'',subject:item.meta?.area||'',title:String(item.title||'').replace(/<br\s*\/?>/gi,' · ')})),...(state.editableData?.items||[]).filter(item=>item.entity==='task'&&!['completado','completed','cancelled'].includes(item.status)&&!linked.has(item.id)&&(!item.date||item.date<=last)).map(item=>({date:item.date||'',subject:names[item.subjectId]||item.subjectId||'',title:item.title}))].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,16).map(item=>`• ${item.date||'Sin fecha'} · ${item.subject} · ${item.title}`);
  const projects=(state.projects||[]).filter(item=>item.status!=='Finalizado').slice(0,12).map(item=>`• ${item.area||item.areas?.[0]||''} · ${item.name} (${item.status||'Pendiente'})`);
  const practices=[];for(const [id,course]of Object.entries(state.dataset?.courses||{}))for(const item of course.practices||[]){if(item.date&&(item.date>last||item.date<start))continue;practices.push(`• ${item.date||'Fecha pendiente'} · ${names[id]||id} · ${item.title}${item.note?' · '+item.note:''}`)}
  const sections=[`Tu plan UC3M: ${start}–${end}`,'','LO OBLIGATORIO DE ESTA SEMANA',...(thisWeek.length?thisWeek:['No consta ninguna práctica, examen o entrega con fecha confirmada.']),'','MIRADA A TRES SEMANAS',...(later.length?later:['No constan más fechas obligatorias en este intervalo.']),'','TAREAS ABIERTAS',...(tasks.length?tasks:['No hay tareas abiertas registradas.']),'','PROYECTOS EN MARCHA',...(projects.length?projects:['No hay proyectos abiertos registrados.'])];
  if(needsReview.length)sections.push('','POR CONFIRMAR: GRUPO O FECHA',...needsReview);
  if(practices.length)sections.push('','PRÁCTICAS DEL CRONOGRAMA POR COMPROBAR',...practices.slice(0,12));
  sections.push('','El resumen no incluye clases de teoría ordinarias. Comprueba Aula Global para cambios posteriores al último sincronismo.');
  return {week:start,body:sections.join('\n')};
}
function enviarResumenSemanal() {
  const state=leerJson(UC3M_MAIL.state,{schemaVersion:1,processedIds:[],sentWeeks:[]}),plan=planSemanalCorreo(estadoCentroActual(),new Date());
  if((state.sentWeeks||[]).includes(plan.week))return;
  const recipient=PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL')||Session.getEffectiveUser().getEmail();
  if(!recipient)throw Error('Configura NOTIFY_EMAIL en Propiedades del script');
  const review=leerJson(UC3M_MAIL.review,{proposals:[]}),pending=(review.proposals||[]).filter(item=>item.status==='pending_review').length;
  const body=plan.body+(pending?`\n\nCORREO ACADÉMICO\nHay ${pending} propuestas privadas pendientes de revisar en Drive. No se tratan como fechas confirmadas hasta que las aceptes.`:'');
  MailApp.sendEmail(recipient,'Centro UC3M · plan de la semana '+plan.week,body);
  state.sentWeeks=[...(state.sentWeeks||[]),plan.week].slice(-52);escribirJson(UC3M_MAIL.state,state);
}
function revisionYResumenSemanal(){prepararRevisionSemanal();enviarResumenSemanal()}
