/* Presentation state only: never written into the academic data or Markdown. */
(function(global){
  'use strict';
  function detailKey(detail){
    const column=detail.closest('.uc3m-column');
    const parts=[];
    for(let current=detail;current;current=current.parentElement?.closest('details')){
      const label=current.querySelector(':scope > summary')?.textContent.trim()||'';
      parts.unshift(current.dataset.uiKey||[current.className,label.replace(/\s*·\s*\d+.*$/u,'')].join(':'));
    }
    return JSON.stringify([column?.dataset.subject||'',...parts]);
  }
  function create(){
    const states=new Map(),scopes=new WeakMap();
    let previousScope;
    return {
      capture(root){
        previousScope=scopes.get(root);
        if(previousScope===undefined)return;
        const state=states.get(previousScope)||{details:new Map()};
        for(const detail of root.querySelectorAll('details'))state.details.set(detailKey(detail),detail.open);
        const active=root.ownerDocument.activeElement;
        state.focus=active?.matches('summary')&&root.contains(active)?detailKey(active.parentElement):null;
        state.inputFocus=root.contains(active)&&active?.dataset?.uiFocus?{key:active.dataset.uiFocus,start:active.selectionStart,end:active.selectionEnd}:null;
        state.scrollTop=root.scrollTop;state.scrollLeft=root.scrollLeft;
        states.set(previousScope,state);
      },
      restore(root,scope){
        scopes.set(root,scope);
        const state=states.get(scope);
        if(!state)return;
        for(const detail of root.querySelectorAll('details')){
          const key=detailKey(detail);
          if(state.details.has(key))detail.open=state.details.get(key);
          if(scope===previousScope&&key===state.focus)detail.querySelector(':scope > summary')?.focus({preventScroll:true});
        }
        if(scope===previousScope&&state.inputFocus){
          const field=[...root.querySelectorAll('[data-ui-focus]')].find(item=>item.dataset.uiFocus===state.inputFocus.key);
          if(field){field.focus({preventScroll:true});if(Number.isInteger(state.inputFocus.start))field.setSelectionRange(state.inputFocus.start,state.inputFocus.end);}
        }
        if(scope===previousScope){root.scrollTop=state.scrollTop;root.scrollLeft=state.scrollLeft;}
      }
    };
  }
  const api={create};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(global)global.UC3MViewState=api;
})(typeof window!=='undefined'?window:globalThis);
