var l=Object.defineProperty;var u=(n,s)=>l(n,"name",{value:s,configurable:true});var x={exports:{}};var e={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var a;function p(){if(a)return e;a=1;var n=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function R(d,r,t){var i=null;void 0!==t&&(i=""+t);void 0!==r.key&&(i=""+r.key);if("key"in r){t={};for(var o in r)"key"!==o&&(t[o]=r[o])}else t=r;r=t.ref;return{$$typeof:n,type:d,key:i,ref:void 0!==r?r:null,props:t}}u(R,"jsxProd");e.Fragment=s;e.jsx=R;e.jsxs=R;return e}u(p,"requireReactJsxRuntime_production");var v;function E(){if(v)return x.exports;v=1;{x.exports=p()}return x.exports}u(E,"requireJsxRuntime");var j=E();export{j};
