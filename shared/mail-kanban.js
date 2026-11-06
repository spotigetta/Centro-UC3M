/* Private proposals -> public academic fields. Pure, shared by web and Obsidian. */
(function (global) {
  'use strict';
  const actionable = new Set(['task', 'practice', 'exam']);
  const supported = new Set([...actionable, 'schedule_event', 'evaluation_component', 'material', 'announcement']);
  const own = (o, key) => Object.prototype.hasOwnProperty.call(o, key);
  const string = (v, max) => typeof v === 'string' && v.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(v);
  function record(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    if (proto !== null && proto !== Object.prototype) return false;
    return !['__proto__', 'prototype', 'constructor'].some(key => own(value, key)) &&
      Object.values(Object.getOwnPropertyDescriptors(value)).every(d => !d.get && !d.set);
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function validTime(value) { return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/u.test(value); }
  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/gu, '').toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/gu, ' ');
  }
  // SHA-256 is synchronous so both hosts use the same deterministic identity.
  // It hashes the source identifier; raw Gmail/message IDs never leave the proposal.
  function sha256(value) {
    const bytes = new TextEncoder().encode(value), length = bytes.length;
    const data = new Uint8Array(Math.ceil((length + 9) / 64) * 64);
    data.set(bytes); data[length] = 0x80;
    const view = new DataView(data.buffer), bits = length * 8;
    view.setUint32(data.length - 8, Math.floor(bits / 0x100000000));
    view.setUint32(data.length - 4, bits >>> 0);
    const k = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const rotate = (n, b) => (n >>> b) | (n << (32 - b)), w = new Int32Array(64);
    for (let offset = 0; offset < data.length; offset += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getInt32(offset + i * 4);
      for (let i = 16; i < 64; i++) {
        const a = w[i - 15], b = w[i - 2];
        w[i] = (w[i - 16] + (rotate(a,7) ^ rotate(a,18) ^ (a >>> 3)) + w[i - 7] + (rotate(b,17) ^ rotate(b,19) ^ (b >>> 10))) | 0;
      }
      let [a,b,c,d,e,f,g,j] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (j + (rotate(e,6) ^ rotate(e,11) ^ rotate(e,25)) + ((e & f) ^ (~e & g)) + k[i] + w[i]) | 0;
        const t2 = ((rotate(a,2) ^ rotate(a,13) ^ rotate(a,22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        j=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      [a,b,c,d,e,f,g,j].forEach((n,i) => h[i]=(h[i]+n)|0);
    }
    return h.map(n => (n>>>0).toString(16).padStart(8,'0')).join('');
  }
  function validateProposal(state, p) {
    if (!record(p) || !['add','update','delete'].includes(p.operation) || !supported.has(p.entity)) return false;
    if (!string(p.proposalId, 100) || !/^[-a-zA-Z0-9]{3,100}$/u.test(p.proposalId)) return false;
    if (!string(p.courseId, 80) || !Array.isArray(state?.subjects)) return false;
    const subject = state.subjects.find(s => s?.id === p.courseId);
    if (!subject || !string(subject.name, 200) || !subject.name.trim()) return false;
    const v = p.value;
    if (!record(v) || !string(v.title, 200) || !v.title.trim() || !string(v.details, 2000)) return false;
    if (typeof v.date !== 'string' || (v.date !== '' && !validDate(v.date))) return false;
    if (typeof v.time !== 'string' || (v.time !== '' && !validTime(v.time))) return false;
    if (own(v,'end') && (typeof v.end !== 'string' || (v.end !== '' && (!validTime(v.end) || !v.time || v.end <= v.time)))) return false;
    if (typeof p.confidence !== 'number' || !Number.isFinite(p.confidence) || p.confidence < 0 || p.confidence > 1) return false;
    if (own(p,'explicitCorrection') && typeof p.explicitCorrection !== 'boolean') return false;
    if (own(v,'explicitCorrection') && typeof v.explicitCorrection !== 'boolean') return false;
    if (own(p,'reason') && !string(p.reason, 2000)) return false;
    if (own(p,'evidenceDate') && !string(p.evidenceDate, 80)) return false;
    if (!Array.isArray(p.evidenceMessageIds) || !p.evidenceMessageIds.length || p.evidenceMessageIds.length > 100) return false;
    return p.evidenceMessageIds.every(id => typeof id === 'string' && /^[a-f0-9]{1,100}$/iu.test(id));
  }
  function planImport(state, p) {
    if (!validateProposal(state, p)) return {status:'ignored', reason:'Propuesta no válida: revisa asignatura, formato y evidencia.'};
    if (p.operation !== 'add') return {status:'review', reason:'Las modificaciones y eliminaciones requieren comparar y editar el dato existente; no se aplican automáticamente.'};
    if (!actionable.has(p.entity) && p.entity !== 'schedule_event') return {status:'ignored', reason:'Este aviso no define una tarea ni una cita; se conserva solo en la revisión privada.'};
    // The current schema1 exporter encodes correction in reason, older clients
    // omit explicitCorrection. A confidence score must not bypass this check.
    if (p.explicitCorrection === true || p.value.explicitCorrection === true || /correcci[oó]n|rectifica|sustituy|cancelaci[oó]n|cambio de (?:fecha|hora)/iu.test(p.reason || ''))
      return {status:'review', reason:'El correo indica una corrección. Compara con el dato existente antes de modificarlo.'};
    if (p.entity === 'schedule_event' && !p.value.date) return {status:'review', reason:'La cita no tiene una fecha completa; no se añade al calendario.'};
    const subject = state.subjects.find(s => s.id === p.courseId), v = p.value;
    const fingerprint = sha256(JSON.stringify(['uc3m-mail-v1',p.courseId,p.entity,p.proposalId]));
    const evidenceFingerprint = sha256(JSON.stringify(['uc3m-mail-evidence-v1',p.courseId,p.entity,
      [...new Set(p.evidenceMessageIds.map(id=>id.toLowerCase()))].sort()]));
    const title = v.title.trim().replace(/\s+/gu,' '), semantic = normalize(title);
    const relatedCards = (Array.isArray(state.cards) ? state.cards : []).filter(card => card?.meta?.mailEvidenceFingerprint === evidenceFingerprint);
    const relatedItems = (Array.isArray(state.editableData?.items) ? state.editableData.items : []).filter(item => item?.provenance?.evidenceFingerprint === evidenceFingerprint);
    if (relatedCards.some(card=>normalize(card.title)!==semantic) || relatedItems.some(item=>normalize(item.title)!==semantic))
      return {status:'review',reason:'Esta evidencia ya se utilizó con otro título. Puede ser una reformulación o un segundo hecho del mismo correo; compáralos antes de incorporarlo.'};
    const existingCards = (Array.isArray(state.cards) ? state.cards : []).filter(card =>
      card?.meta?.mailFingerprint === fingerprint ||
      (normalize(card?.title) === semantic && (card?.meta?.area === subject.name || (Array.isArray(card?.meta?.areas) && card.meta.areas.includes(subject.name)))));
    const existingItems = (Array.isArray(state.editableData?.items) ? state.editableData.items : []).filter(item =>
      item?.provenance?.fingerprint === fingerprint ||
      (item?.subjectId === p.courseId && normalize(item.title) === semantic &&
       ['task','event','practice','exam','schedule_event'].includes(item.entity)));
    if (p.entity === 'schedule_event' || actionable.has(p.entity)) {
      const calendar=[...(Array.isArray(state.dataset?.events)?state.dataset.events:[]),
        ...(Array.isArray(state.activities)?state.activities:[])];
      for (const item of calendar) {
        const sameCourse=item?.subject===p.courseId||item?.subjectId===p.courseId||item?.area===subject.name||
          (Array.isArray(item?.areas)&&item.areas.includes(subject.name));
        if (sameCourse&&normalize(item.title)===semantic) {
          if (actionable.has(p.entity)) return {status:'review',reason:'Ya existe una cita equivalente en el calendario. Compara sus datos; si necesitas preparar la práctica o el examen, añade una tarea de preparación distinta sin duplicar la cita.'};
          existingItems.push({id:item.id,entity:'event',date:item.date||'',time:item.time||'',
            end:item.end||item.endTime||'',status:item.status||''});
        }
      }
    }
    if (existingCards.some(card => (card.meta?.due || card.meta?.start || '') !== v.date || (card.meta?.time || '') !== v.time) ||
        existingItems.some(item => (item.date || '') !== v.date || (item.time || '') !== v.time || (v.end && (item.end || '') !== v.end)))
      return {status:'review', reason:'Ya existe una actividad equivalente con otra fecha u hora. No se cambia ni se crea una segunda automáticamente.'};
    const makeCard = (itemId, fp, lane='Entrada', checked=false) => {
      const cardId = 'mail-' + fp;
      return {id:cardId,title,lane,checked,meta:{id:cardId,area:subject.name,areas:[subject.name],
        due:v.date,time:v.time,mailFingerprint:fp,mailEvidenceFingerprint:evidenceFingerprint,assistantItemId:itemId}};
    };
    if (existingCards.length)
      return {status:'duplicate', reason:'Esta actividad ya existe. Se mantienen su progreso y sus datos actuales.'};
    if (existingItems.length) {
      if (existingItems.length !== 1) return {status:'review',reason:'Hay varios registros equivalentes. Revisa cuál corresponde antes de crear una tarjeta.'};
      const item=existingItems[0], progress=normalize(item.status);
      if (!actionable.has(p.entity) || item.provenance?.kind!=='email-reviewed' ||
          !['task','practice','exam'].includes(item.entity) || ['cancelled','canceled','cancelado','cancelada'].includes(progress))
        return {status:'duplicate',reason:'El dato ya existe; se conserva su estado y no se vuelve a abrir.'};
      if (!string(item.id,200) || !item.id) return {status:'review',reason:'El registro previo no tiene un identificador válido para vincular la tarjeta.'};
      const complete=['completado','completada','completed','finalizada','finalizado','done'].includes(progress);
      const inProgress=['en curso','in progress'].includes(progress);
      if (!complete&&!inProgress&&!['','pendiente','pending','confirmed','confirmado','confirmada'].includes(progress))
        return {status:'review',reason:'El estado del registro previo no se reconoce; no se crea una tarjeta que pueda reabrirlo.'};
      const fp=/^[a-f0-9]{64}$/u.test(item.provenance.fingerprint||'')?item.provenance.fingerprint:fingerprint;
      return {status:'add',reason:'El aviso ya estaba incorporado; se añade solo su tarjeta conservando el progreso.',
        card:makeCard(item.id,fp,complete?'Finalizada':inProgress?'En curso':'Entrada',complete)};
    }
    const provenance = {kind:'email-reviewed',fingerprint,evidenceFingerprint};
    const receivedDate = (p.evidenceDate || '').slice(0,10);
    if (validDate(receivedDate)) provenance.receivedDate = receivedDate;
    const id = 'usr-mail-' + fingerprint;
    const academicItem = {id,entity:actionable.has(p.entity)?'task':'event',subjectId:p.courseId,
      title,date:v.date,time:v.time,details:'',status:'pendiente',kind:p.entity,provenance};
    if (v.end) academicItem.end = v.end;
    if (p.entity === 'schedule_event') return {status:'add',reason:'Cita propuesta para el calendario, sin crear una tarea.',academicItem};
    const card = makeCard(id,fingerprint);
    return {status:'add',reason:'Tarea propuesta para la asignatura; requiere confirmar su incorporación.',card,academicItem};
  }
  const api = {validateProposal,planImport};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (global) global.UC3MMailKanban = api;
})(typeof window !== 'undefined' ? window : globalThis);
