const t="[intro-tour]:";var n=(...n)=>{console.log(t,...n)},e=(...n)=>{console.error(t,...n)},o=(...n)=>{console.warn(t,...n)};!function(t,n){void 0===n&&(n={});var e=n.insertAt;if(t&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css","top"===e&&o.firstChild?o.insertBefore(i,o.firstChild):o.appendChild(i),i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t))}}(".intro-tour-outer-container {\n  display: none;\n  cursor: pointer;\n  position: absolute;\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  text-align: center;\n  border-radius: 6px;\n  padding: 5px 8px; }\n  .intro-tour-outer-container.show {\n    display: block; }\n");class i{errorHandler=t=>{e(t)};warnHandler=t=>{o(t)};range=null;root=document.createElement("div");constructor(t={}){if(window.introTour)throw new Error("plugin has been initialized. Do not call it again");const{errorHandler:e,warnHandler:o}=t;e&&(this.errorHandler=e),o&&(this.warnHandler=o),this.initEvent(),this.initTooltip(),n("plugin initialization is complete!"),window.introTour=this}initTooltip=()=>{this.root.appendChild(function(...t){const n=document.createDocumentFragment();try{for(let e=0;e<t.length;e+=1){const o=t[e],i=document.createRange().createContextualFragment(o);n.appendChild(i)}}catch(t){e(t)}return n}("<div>\n    <span>123</span>\n    <span>评论</span>\n    <span>复制</span>\n</div>\n")),this.root.classList.add("intro-tour-outer-container"),document.body.appendChild(this.root)};initEvent=()=>{document.addEventListener("mousedown",this.onMousedown),document.addEventListener("mouseup",this.onMouseup),this.root.addEventListener("click",this.onMenuClick)};onMenuClick=t=>{t.stopPropagation(),t.preventDefault(),e(t)};onMouseup=()=>{const t=window.getSelection();if(t){const n=t.getRangeAt(0);n.collapsed?this.warnHandler("range is collapsed"):(this.range=n.cloneRange(),this.showTooltip(this.range))}};onMousedown=()=>{this.root.classList.remove("show")};showTooltip=t=>{const n=t.getBoundingClientRect(),{left:e,top:o}=n;this.root.classList.add("show"),this.root.style.left=`${e}px`,this.root.style.top=`${o}px`}}export{i as default};
