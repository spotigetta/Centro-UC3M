'use strict';
(function(global){
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function inline(value){
    return escape(value).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/&lt;br\s*\/?&gt;/gi,'<br>');
  }
  function render(value){
    const lines=String(value??'').replace(/\r\n?/g,'\n').split('\n');
    const output=[],stack=[];
    const close=()=>{while(stack.length){const current=stack.pop();if(current.open)output.push('</li>');output.push('</'+current.tag+'>')}};
    for(const raw of lines){const line=raw.trim();if(!line){close();continue}
      const heading=line.match(/^(#{1,4})\s+(.+)$/);
      if(heading){close();const level=Math.min(heading[1].length+2,6);output.push('<h'+level+'>'+inline(heading[2])+'</h'+level+'>');continue}
      const bullet=line.match(/^[-*]\s+(.+)$/),number=line.match(/^\d+[.)]\s+(.+)$/);
      if(bullet||number){const wanted=bullet?'ul':'ol',indent=raw.match(/^\s*/)[0].replace(/\t/g,'    ').length;
        while(stack.length&&indent<stack.at(-1).indent){const current=stack.pop();if(current.open)output.push('</li>');output.push('</'+current.tag+'>')}
        if(stack.length&&indent===stack.at(-1).indent&&stack.at(-1).tag!==wanted){const current=stack.pop();if(current.open)output.push('</li>');output.push('</'+current.tag+'>')}
        if(!stack.length||indent>stack.at(-1).indent){output.push('<'+wanted+'>');stack.push({tag:wanted,indent,open:false})}
        else if(stack.at(-1).open)output.push('</li>');
        output.push('<li>'+inline((bullet||number)[1]));stack.at(-1).open=true;continue}
      close();output.push('<p>'+inline(line)+'</p>');
    }
    close();return output.join('');
  }
  function toMarkdown(root){
    const parts=node=>Array.from(node.childNodes||[]).map(inlineNode).join('');
    function inlineNode(node){
      if(node.nodeType===3)return node.nodeValue||'';
      if(node.nodeType!==1)return '';
      const tag=node.tagName.toLowerCase(),body=parts(node);
      if(tag==='br')return '\n';
      if(tag==='strong'||tag==='b')return '**'+body+'**';
      if(tag==='em'||tag==='i')return '*'+body+'*';
      if(tag==='code')return '`'+body+'`';
      if(tag==='a')return '['+body+']('+node.getAttribute('href')+')';
      if(tag==='ul'||tag==='ol')return '';
      return body;
    }
    function listMarkdown(node,level=0){return Array.from(node.children).map((item,index)=>{
      const nested=Array.from(item.children).find(child=>/^(UL|OL)$/.test(child.tagName));
      const text=Array.from(item.childNodes).filter(child=>child!==nested).map(inlineNode).join('').trim();
      const prefix='  '.repeat(level)+(node.tagName==='OL'?(index+1)+'. ':'- ');
      return prefix+text+(nested?'\n'+listMarkdown(nested,level+1):'');
    }).join('\n')}
    function block(node){
      if(node.nodeType===3)return (node.nodeValue||'').trim();
      if(node.nodeType!==1)return '';
      const tag=node.tagName.toLowerCase();
      if(/^h[3-6]$/.test(tag))return '#'.repeat(Number(tag[1])-2)+' '+parts(node)+'\n\n';
      if(tag==='ul'||tag==='ol')return listMarkdown(node)+'\n\n';
      if(tag==='p'||tag==='div')return parts(node)+'\n\n';
      return parts(node)+'\n\n';
    }
    return Array.from(root.childNodes).map(block).join('').replace(/\n{3,}/g,'\n\n').trim();
  }
  global.UC3MMarkdown={render,toMarkdown,plain:value=>String(value??'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/\*\*/g,'').trim()};
})(window);
