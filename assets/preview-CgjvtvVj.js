var M=Object.defineProperty;var l=(r,e)=>M(r,"name",{value:e,configurable:true});import{d as h}from"./index-DFiNSBvt.js";const{useMemo:$,useEffect:k}=__STORYBOOK_MODULE_PREVIEW_API__;const{global:B}=__STORYBOOK_MODULE_GLOBAL__;const{logger:x}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var u="backgrounds";var{document:s,window:O}=B;var S=l(()=>O.matchMedia("(prefers-reduced-motion: reduce)").matches,"isReduceMotionEnabled");var w=l((r,e=[],a)=>{if(r==="transparent")return"transparent";if(e.find(t=>t.value===r))return r;let n=e.find(t=>t.name===a);if(n)return n.value;if(a){let t=e.map(i=>i.name).join(", ");x.warn(h`
        Backgrounds Addon: could not find the default color "${a}".
        These are the available colors for your story based on your configuration:
        ${t}.
      `)}return"transparent"},"getBackgroundColorByName");var _=l(r=>{(Array.isArray(r)?r:[r]).forEach(A)},"clearStyles");var A=l(r=>{var a;let e=s.getElementById(r);e&&((a=e.parentElement)==null?void 0:a.removeChild(e))},"clearStyle");var L=l((r,e)=>{let a=s.getElementById(r);if(a)a.innerHTML!==e&&(a.innerHTML=e);else{let n=s.createElement("style");n.setAttribute("id",r),n.innerHTML=e,s.head.appendChild(n)}},"addGridStyle");var T=l((r,e,a)=>{var t;let n=s.getElementById(r);if(n)n.innerHTML!==e&&(n.innerHTML=e);else{let i=s.createElement("style");i.setAttribute("id",r),i.innerHTML=e;let o=`addon-backgrounds-grid${a?`-docs-${a}`:""}`,d=s.getElementById(o);d?(t=d.parentElement)==null?void 0:t.insertBefore(i,d):s.head.appendChild(i)}},"addBackgroundStyle");var C=l((r,e)=>{var m;let{globals:a,parameters:n}=e,t=(m=a[u])==null?void 0:m.value,i=n[u],o=$(()=>i.disable?"transparent":w(t,i.values,i.default),[i,t]),d=$(()=>o&&o!=="transparent",[o]),g=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",c=$(()=>`
      ${g} {
        background: ${o} !important;
        ${S()?"":"transition: background-color 0.3s;"}
      }
    `,[o,g]);return k(()=>{let p=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!d){_(p);return}T(p,c,e.viewMode==="docs"?e.id:null)},[d,c,e]),r()},"withBackground");var I=l((r,e)=>{var v;let{globals:a,parameters:n}=e,t=n[u].grid,i=((v=a[u])==null?void 0:v.grid)===true&&t.disable!==true,{cellAmount:o,cellSize:d,opacity:g}=t,c=e.viewMode==="docs",m=n.layout===void 0||n.layout==="padded"?16:0,p=t.offsetX??(c?20:m),f=t.offsetY??(c?20:m),y=$(()=>{let b=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",E=[`${d*o}px ${d*o}px`,`${d*o}px ${d*o}px`,`${d}px ${d}px`,`${d}px ${d}px`].join(", ");return`
      ${b} {
        background-size: ${E} !important;
        background-position: ${p}px ${f}px, ${p}px ${f}px, ${p}px ${f}px, ${p}px ${f}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${g/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g/2}) 1px, transparent 1px) !important;
      }
    `},[d]);return k(()=>{let b=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!i){_(b);return}L(b,y)},[i,y,e]),r()},"withGrid");var H=[I,C];var Y={[u]:{grid:{cellSize:20,opacity:.5,cellAmount:5},values:[{name:"light",value:"#F8F8F8"},{name:"dark",value:"#333333"}]}};var z={[u]:null};export{H as decorators,z as initialGlobals,Y as parameters};
