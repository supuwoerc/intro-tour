"use strict";const n="[intro-tour]";var e=(...e)=>{console.log(n,...e)},o=(...e)=>{console.error(n,...e)},t=(...e)=>{console.warn(n,...e)};module.exports=class{errorHandler=n=>{o(n)};warnHandler=n=>{t(n)};range=null;constructor(n={}){const{errorHandler:o,warnHandler:t}=n;o&&(this.errorHandler=o),t&&(this.warnHandler=t),this.initEvent().then((()=>{e("plugin initialization is complete!")}))}initEvent=()=>new Promise((n=>{document.addEventListener("mouseup",this.onMouseup),n()}));onMouseup=()=>{const n=window.getSelection();if(n){const e=n.getRangeAt(0);e.collapsed?this.warnHandler("range is collapsed"):(this.range=e.cloneRange(),this.showTooltip(this.range))}};showTooltip=n=>{const o=n.getBoundingClientRect();e(o)}};