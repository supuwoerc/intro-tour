const n="[intro-tour]";var o=(...o)=>{console.log(n,...o)},e=(...o)=>{console.error(n,...o)},t=(...o)=>{console.warn(n,...o)};class i{errorHandler=n=>{e(n)};warnHandler=n=>{t(n)};range=null;root=document.createElement("div");constructor(n={}){const{errorHandler:e,warnHandler:t}=n;e&&(this.errorHandler=e),t&&(this.warnHandler=t),this.initEvent(),this.initTooltip(),o("plugin initialization is complete!")}initTooltip=()=>{document.body.appendChild(this.root)};initEvent=()=>{document.addEventListener("mouseup",this.onMouseup)};onMouseup=()=>{const n=window.getSelection();if(n){const o=n.getRangeAt(0);o.collapsed?this.warnHandler("range is collapsed"):(this.range=o.cloneRange(),this.showTooltip(this.range))}};showTooltip=n=>{const e=n.getBoundingClientRect();o(e)}}export{i as default};
