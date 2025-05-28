var s=Object.defineProperty;var _=(e,t)=>s(e,"name",{value:t,configurable:true});const{global:O}=__STORYBOOK_MODULE_GLOBAL__;const{addons:g}=__STORYBOOK_MODULE_PREVIEW_API__;const{STORY_CHANGED:E}=__STORYBOOK_MODULE_CORE_EVENTS__;var i="storybook/highlight";var a="storybookHighlight";var H=`${i}/add`;var T=`${i}/reset`;var{document:h}=O;var I=_((e="#FF4785",t="dashed")=>`
  outline: 2px ${t} ${e};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
`,"highlightStyle");var n=g.getChannel();var L=_(e=>{let t=a;d();let o=Array.from(new Set(e.elements)),l=h.createElement("style");l.setAttribute("id",t),l.innerHTML=o.map(r=>`${r}{
          ${I(e.color,e.style)}
         }`).join(" "),h.head.appendChild(l)},"highlight");var d=_(()=>{var o;let e=a,t=h.getElementById(e);t&&((o=t.parentNode)==null?void 0:o.removeChild(t))},"resetHighlight");n.on(E,d);n.on(T,d);n.on(H,L);
