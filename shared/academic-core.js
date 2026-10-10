'use strict';
(function(global){
// Independent, versioned extension. Legacy card/studio JSON remains readable.
const marker = /^<!-- uc3m-center:(.*) -->$/m;
const colors = ['#000066','#005b8e','#32614b','#754b82','#84551b'];
function subjectsOf(card) { return [...new Set(card.meta?.areas?.length ? card.meta.areas : [card.meta?.area || 'Sin área'])]; }
function read(md, cards = []) {
  const match = md.match(marker);
  if (match) {
    const state = JSON.parse(match[1]);
    if (state.version !== 1 || !Array.isArray(state.subjects)) throw Error('Versión académica no compatible. No se modificará el archivo.');
    return state;
  }
  const names = [...new Set(cards.flatMap(subjectsOf))].filter(n => n !== 'Sin área');
  return {version:1,subjects:names.map((name,i)=>({id:'legacy-'+i,name,color:colors[i%colors.length],icon:'book-open',folder:'',links:[],professor:'',room:'',period:''})),cards:{},projects:{},notes:{}};
}
function write(md, state) {
  if (state.version !== 1) throw Error('Versión académica no compatible');
  const line = '<!-- uc3m-center:' + JSON.stringify(state).replace(/</g,'\\u003c') + ' -->';
  return marker.test(md) ? md.replace(marker,()=>line) : md.trimEnd()+'\n\n'+line+'\n';
}
function dayKey(date) { return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'); }
function occurs(item,date) {
  const key=dayKey(date), anchor=item.date||item.start||item.due;
  if(item.until && key>item.until) return false;
  if(item.repeat==='weekly') return (!anchor||key>=anchor)&&(item.weekdays||[]).includes(date.getDay());
  if(item.repeat==='monthly') return (!anchor||key>=anchor)&&date.getDate()===Math.min(Number(item.monthday)||Number(anchor?.slice(-2))||1,new Date(date.getFullYear(),date.getMonth()+1,0).getDate());
  return anchor===key;
}
function events(cards,activities,state,date) {
  const result=[];
  for(const card of cards.filter(c=>!c.checked)) {
    const info=state.cards?.[card.meta.id]||{},m=card.meta;
    if(m.due===dayKey(date)) result.push({id:card.meta.id+'-due',title:card.title,time:'',kind:'Entrega',card});
    if(occurs({...m,date:m.start||((m.repeat==='weekly'||m.repeat==='monthly')?m.due:'')},date) && (m.start||m.repeat))
      result.push({id:card.meta.id+'-session',title:card.title,time:m.time||'',kind:info.kind||'Sesión',card});
  }
  for(const activity of activities) if(occurs(activity,date)) result.push({id:activity.id,title:activity.title,time:activity.time||'',kind:activity.type||'Sesión',activity});
  return result.sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')||a.title.localeCompare(b.title));
}
function validColor(color) { return /^#[0-9a-f]{6}$/i.test(color||'')?color:'#000066'; }
function escapeHTML(s) { return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function timeRange(item) {
  if (!item?.time) return '';
  if (item.end) return item.time+'–'+item.end;
  const [hour,minute]=item.time.split(':').map(Number);
  if (!Number.isInteger(hour)||!Number.isInteger(minute)) return item.time;
  const total=hour*60+minute+90;
  return item.time+'–'+String(Math.floor(total/60)%24).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
}
const UC3MShared={read,write,subjectsOf,dayKey,occurs,events,validColor,escapeHTML,timeRange};
if(typeof module!=='undefined'&&module.exports)module.exports=UC3MShared;
if(global)global.UC3MShared=UC3MShared;
})(typeof window!=='undefined'?window:null);
