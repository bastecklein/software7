var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function n(t,e,n){return t?t.indexOf(e)<0?t:t.replace(new RegExp(function(t){return t.replace(/([.*+?^=!:${}()|[]\/\\])/g,"\\$1")}(e),"g"),n):""}function o(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function i(t,e,n){return"#"+s(t)+s(e)+s(n)}function s(t){let e=t.toString(16);return 1==e.length?"0"+e:e}t.d(e,{Ay:()=>_,iE:()=>v,Mc:()=>U,XL:()=>F,mU:()=>A});class a{constructor(){this.id=o(),this.frames=[],this.layers=[],this.rulers=[],this.lastSave=(new Date).getTime(),this.created=(new Date).getTime(),this.authors=[],this.firstAuthor=null,this.lastAuthor=null,this.height=0,this.width=0,this.createdApp=null,this.savedApp=null,this.createdAppVer=null,this.savedAppVer=null}}class l{constructor(){this.id=o(),this.mode=null,this.name=null,this.visible=!0,this.opacity=100}}class r{constructor(){this.id=o(),this.layerData={}}}function c(t){const e=new a;if("string"==typeof t)try{t=JSON.parse(t)}catch(t){return console.log(t),e}let n=null;t.data&&(n=t.data);for(let n in e)t[n]&&(e[n]=t[n]);n&&e.layers.push({data:n,mode:null,name:null,visible:!0});const o=[];let i=null;for(let t=0;t<e.layers.length;t++){const n=e.layers[t];if(!n)continue;const s=new l;for(let t in s)n[t]&&(s[t]=n[t]);n.data&&(i||(i={layerData:{}}),i.layerData[s.id]=n.data),o.push(s)}i&&e.frames.push(i),e.layers=o;const s=[];for(let t=0;t<e.frames.length;t++){const n=e.frames[t],o=new r;for(let t in o)n[t]&&(o[t]=n[t]);s.push(o)}if(e.frames=s,0==e.layers.length){const t=new l,n=new r;n.layerData[t.id]=[],e.frames.push(n),e.layers.push(t)}return e}const h=function(t){if(!t.source)return void console.log("No source data!");let e=null,n=1,s=0,a=null,l=null,r=[],h=null,u=null,d=1;t.color&&7==t.color.trim().length&&(l=t.color),t.outlineColor&&(u=t.outlineColor),t.colorReplacements&&(r=t.colorReplacements),null!=t.frame&&null!=t.frame&&(s=t.frame),null!=t.scale&&null!=t.scale&&(n=t.scale),t.callback&&(e=t.callback),t.gridlineImage&&(h=t.gridlineImage),null!=t.opacity&&null!=t.opacity&&(d=t.opacity),a=c(t.source);let f=a.height,g=a.width;if(t.accessories)for(let e=0;e<t.accessories.length;e++){const n=t.accessories[e];if(n.source){const t=n.source;t.width&&t.width>g&&(g=t.width),t.height&&t.height>f&&(f=t.height)}}const m=f*n,p=g*n;let w=p;-1==s&&(w=p*a.frames.length);const y=document.createElement("canvas"),v=y.getContext("2d");y.style.imageRendering="pixelated",v.imageSmoothingEnabled=!1,y.height=m,y.width=w,t.fill&&(v.fillStyle=t.fill,v.fillRect(0,0,w,m));let M=s,x=s+1;-1==s&&(M=0,x=a.frames.length);let k=0;const R=[];if(R.push({source:a,colorReplacements:r}),t.accessories)for(let e=0;e<t.accessories.length;e++){const n=t.accessories[e];R.push(JSON.parse(JSON.stringify(n)))}for(let t=0;t<R.length;t++){k=0;const e=R[t],o=e.source;let i=0;o.height<f&&(i+=f-o.height);let s=null,r={},c=0;e.colorReplacements&&(s=e.colorReplacements);for(let t=M;t<x;t++){const e=o.frames[t];if(e){for(let t=0;t<o.layers.length;t++){v.globalCompositeOperation="source-over";const a=o.layers[t];if(!a.visible)continue;const h=e.layerData[a.id];if(h){a.mode&&(v.globalCompositeOperation=a.mode),a.opacity&&a.opacity<100?v.globalAlpha=a.opacity/100:v.globalAlpha=1;for(let t=0;t<h.length;t++){const e=h[t];r[e.x+c+":"+e.y]=!0;const o=e.x*n+k,a=(e.y+i)*n;let u=e.c;if(l&&"#ff00ff"==u&&(u=l),s)for(let t=0;t<s.length;t++){const e=s[t].c,n=s[t].r;if(u==e){u=n;break}}v.fillStyle=u,v.fillRect(o,a,n,n)}}}c+=a.width,k+=p}}if(v.globalCompositeOperation="source-over",h)for(let t=0;t<o.width;t++)for(let e=0;e<o.height;e++){const o=t*n,i=e*n;v.drawImage(h,o,i,n,n)}if(u){const t=document.createElement("canvas"),e=t.getContext("2d");t.width=y.width,t.height=y.height,e.drawImage(y,0,0),v.fillStyle=u,v.globalCompositeOperation="source-over",v.globalAlpha=1;for(let t in r){const e=t.split(":"),o=parseInt(e[0]),i=parseInt(e[1]);for(let t=o-1;t<=o+1;t++)for(let e=i-1;e<=i+1;e++){const o=t*n,i=e*n;v.fillRect(o,i,n,n)}}v.drawImage(t,0,0)}}if(d<1){const t=document.createElement("canvas"),e=t.getContext("2d");t.height=m,t.width=w,e.drawImage(y,0,0),y.height=m,y.width=w,v.globalAlpha=d,v.drawImage(t,0,0)}if(t.asVPP)return void function(t,e,n){const s=e.getImageData(0,0,t.width,t.height),a=s.data;let l=0;const r={author:null,size:0,id:o(),voxels:[],precompiledat:null,vars:{created_timestamp:(new Date).getTime(),last_edit_timestamp:(new Date).getTime(),last_edit_app:null}};r.size=s.width,s.height>s.width&&(r.size=s.height),l=Math.floor(r.size/2);for(let t=0;t<a.length;t+=4){const e=Math.floor(t/4),n=Math.floor(e/s.width),o=e-n*s.width,c=a[t+0],h=a[t+1],u=a[t+2],d=a[t+3];if(0==d)continue;const f=i(c,h,u);let g={x:o-l,y:0,z:s.height-n-1,c:f,op:d/255};r.voxels.push(g)}n(r)}(y,v,e);if(t.asCanvas)return e?void e(y):y;const b=y.toDataURL();if(t.asDataURL)return e?void e(b):b;if(!e)return void console.log("Missing callback");const z=new Image;z.onload=function(){e(z)},z.src=b};window.addEventListener("resize",(function(){A()}));const u=2*Math.PI,d=320,f=300,g=1e3/30;let m={},p={},w=null,y=0;function v(t){const e=new M(t);if(m[e.id]=e,t.holders)for(const n of t.holders)e.addCamera(n.element,n.tag);return e}class M{constructor(t){this.id=o(),this.options=t,this.backgroundColor="black",this.ground=null,this.sky=null,this.undersky=null,this.oversky=null,this.track=null,this.tileReference={},this.tileMap=null,this.tileSize=8,this.minTileZ=0,this.maxTileZ=0,this.cameras=[],this.sprites=[],this.loopFunction=t.onLoop||null}destroy(){delete m[this.id];for(const t of this.cameras)t.holder.innerHTML=""}addCamera(t,e){const n=new x(t,e);return this.cameras.push(n),n}setOversky(t){const e=this;if(e.oversky=null,!t)return void(e.oversky=null);const n=U(t,null);e.oversky=n.name}setUndersky(t){const e=this;if(!t)return e.undersky=null,void(e.backgroundColor="black");const n=U(t,null);e.undersky=n.name}setSky(t){const e=this;if(e.sky=null,!t)return void(e.sky=null);const n=U(t,null);e.sky=n.name}setGround(t,e=null){const n=this;if(n.ground=null,!t)return void(n.ground=null);const o=U(t,e);n.ground=o.name}setTrack(t){const e=this;if(e.track=null,!t)return void(e.track=null);const n=U(t,null);e.track=n.name}setTile(t){if(Array.isArray(t))for(const e of t)Z(this,e.x,e.y,e.z,e.id);else{if(null==t)return void(this.tileMap=null);Z(this,t.x,t.y,t.z,t.id)}if(this.minTileZ=0,this.maxTileZ=0,this.tileMap)for(const t of this.tileMap)t.z<this.minTileZ&&(this.minTileZ=t.z),t.z>this.maxTileZ&&(this.maxTileZ=t.z)}setTileReference(t){if(Array.isArray(t))for(const e of t)N(this,e.id,e.src,e.colorReplacements);else{if(null==t)return void(this.tileReference={});N(this,t.id,t.src,t.colorReplacements)}}addSprite(t){t.instance||(t.instance=this);const e=new k(t);return this.sprites.push(e),e}}class x{constructor(t,e){this.id=o(),this.holder=t,this.tag=e,this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d",{willReadFrequently:!0}),this.canvas.style.width="100%",this.canvas.style.height="100%",t.appendChild(this.canvas),this.x=84,this.y=142,this.z=16,this.width=d,this.height=240,this.angle=0,this.camScale=1,this.scaleX=f,this.scaleY=f,this.horizonDivider=3,this.horizon=Math.floor(this.height/this.horizonDivider),I(this)}setAngle(t){const e=t/360;this.angle=e*u,this.angle<0&&(this.angle+=u),this.angle>u&&(this.angle-=u)}setResolution(t){this.width=t,I(this)}}class k{constructor(t){this.x=t.x||0,this.y=t.y||0,this.z=t.z||0,this.options=t,this.scaleX=t.scaleX||t.scale||.16,this.scaleY=t.scaleY||t.scale||.16;const e=U(t.src,null);this.frame=-1,this.texture=e.name,this.instance=t.instance||null}remove(){if(this.instance){const t=this.instance.sprites.indexOf(this);-1!=t&&this.instance.sprites.splice(t,1)}}}class R{constructor(t){this.url=t.url,this.id=o(),this.frames=t.frames||1,this.images=[],this.loaded=!1,this.colorReplacements=t.colorReplacements||[],this.name=F(this.url,this.colorReplacements),this.height=0,this.width=0,this.onLoad=t.onLoad||null,this.currentFrame=0,function(t){if("object"==typeof t.url&&t.url.createdApp&&"Pixel Paint"==t.url.createdApp)return void z(t);if(t.url.toLowerCase().endsWith(".ppp"))return void z(t);if(t.url.toLowerCase().endsWith(".svg"))return void function(t){const e=[];if(t.colorReplacements&&t.colorReplacements.length>0)for(let n=0;n<t.colorReplacements.length;n++){const o=t.colorReplacements[n],i=o.c,s=o.r;e.push({from:i,to:s})}(function(t,e=[]){return new Promise((function(o,i){const s=new XMLHttpRequest;s.open("GET",t,!0),s.responseType="document",s.onload=function(){const t=s.responseXML;let i=(new XMLSerializer).serializeToString(t);for(const t of e)i=n(i,"fill:"+t.from+";","fill:"+t.to+";"),i=n(i,"stroke:"+t.from+";","stroke:"+t.to+";");const a=new Blob([i],{type:"image/svg+xml"}),l=window.URL.createObjectURL(a),r=new Image;r.crossOrigin="anonymous",r.onload=function(){window.URL.revokeObjectURL(a),o(r)},r.src=l},s.onerror=function(){i()},s.send()}))})(t.url,e).then((function(e){S(t,e)}))}(t);const e=new Image;e.onload=function(){S(t,e)},e.src=t.url}(this)}}class b{constructor(t,e){this.canvas=t,this.data=e}}function z(t){h({source:t.url,frame:-1,scale:1,colorReplacements:t.colorReplacements,callback:function(e){t.frames=Math.floor(e.width/e.height),S(t,e)}})}function S(t,e){const n=document.createElement("canvas"),o=n.getContext("2d");n.width=e.width,n.height=e.height,o.drawImage(e,0,0);const i=Math.floor(e.width/t.frames);t.width=i,t.height=e.height;for(let o=0;o<t.frames;o++){const s=document.createElement("canvas"),a=s.getContext("2d");s.style.imageRendering="pixelated",a.imageSmoothingEnabled=!1,s.width=i,s.height=e.height,a.drawImage(n,i*o,0,i,e.height,0,0,i,e.height);const l=a.getImageData(0,0,i,e.height);t.images.push(new b(s,l))}t.loaded=!0,t.onLoad&&(t.onLoad(t),t.onLoad=null)}function A(){for(const t in m)T(m[t])}function T(t){for(const e of t.cameras)I(e)}function I(t){const e=t.holder,n=e.offsetWidth,o=e.offsetHeight,i=t.width/n,s=Math.floor(o*i);t.height=s,t.canvas.width=t.width,t.canvas.height=t.height,t.canvas.style.imageRendering="pixelated",t.context.imageSmoothingEnabled=!1,t.horizon=Math.floor(t.height/t.horizonDivider),t.camScale=t.width/d,t.scaleX=Math.round(f*t.camScale),t.scaleY=Math.round(f*t.camScale)}function C(t){for(const e of t.cameras)L(t,e)}function L(t,e){e.context.fillStyle=t.backgroundColor,e.context.fillRect(0,0,e.width,e.height);const n=e.horizon+1,o=e.angle/u;t.undersky&&D(e,t.undersky,n,o,!1),t.sky&&D(e,t.sky,n,o,!0),t.oversky&&D(e,t.oversky,n,o,!1);const i=e.context.getImageData(0,0,e.width,e.height),s=Math.cos(e.angle),a=Math.sin(e.angle);!function(t,e,n,o,i,s){let a=null,l=null,r=null;t.track&&(l=t.track,l&&l.loaded&&(r=l.images[l.currentFrame].data)),t.ground&&(a=p[t.ground]);for(let c=s+1;c<e.height;c++){const h=e.z*e.scaleY/(c-s),u=-i*(h/e.scaleX),d=o*(h/e.scaleY);let f=e.x+o*h-e.width/2*u,g=e.y+i*h-e.height/2*d;for(let o=0;o<e.width;o++){const e=Math.floor(f),i=Math.floor(g);let s=!1;if(r&&e>=0&&i>=0&&e<l.width&&i<l.height){const t=O(r,e,i);E(n,o,c,t),255==t.a&&(s=!0)}if(t.tileMap){const a=Math.floor(e/t.tileSize),l=Math.floor(i/t.tileSize);for(let r=t.maxTileZ;r>=t.minTileZ;r--){const h=P(t,a,l,r);if(h){const a=t.tileReference[h];if(a){const l=p[a];l&&l.loaded&&(s=j(t,l,n,e,i,o,c))}}if(s)break}}a&&a.loaded&&!s&&j(t,a,n,e,i,o,c),f+=u,g+=d}}}(t,e,i,s,a,e.horizon),function(t,e,n,o,i){for(const s of t.sprites){if(!s.texture)continue;const t=p[s.texture];if(!t||!t.loaded)continue;let a=t.currentFrame;-1!=s.frame&&s.frame<t.frames&&(a=s.frame);const l=s.x-e.x,r=s.y-e.y,c=l*o+r*i,h=r*o-l*i,u=t.width,d=t.height,f=Math.floor(u*e.scaleX/c*s.scaleX),g=Math.floor(d*e.scaleY/c*s.scaleY);if(f<1||g<1)continue;const m=Math.floor(e.scaleX/c*h+e.width/2),w=Math.floor(e.z*e.scaleY/c+e.horizon);let y=0;0!=s.z&&(y=s.z*e.scaleY/c);const v=Math.floor(m-f/2),M=Math.floor(w-g-y);v+f<0||v>e.width||M+g<0||M>e.height||X(e,n,t,a,v,M,f,g)}}(t,e,i,s,a),e.context.putImageData(i,0,0)}function D(t,e,n,o,i){const s=p[e];if(!s||!s.loaded)return;const a=s.images[s.currentFrame].canvas;let l=Math.round(s.height*t.camScale),r=Math.round(s.width*t.camScale);if(i&&r<1.25*t.width){r=Math.round(1.25*t.width);const e=r/s.width;l=Math.round(s.height*e)}let c=0-Math.round(r*o),h=n-l,u=!1;for(;!u;)t.context.drawImage(a,c,h,r,l),c+r<t.width?c+=r:u=!0}function O(t,e,n){const o=4*(Math.floor(Math.abs(n))*t.width+Math.floor(Math.abs(e)));return{r:t.data[o],g:t.data[o+1],b:t.data[o+2],a:t.data[o+3]}}function E(t,e,n,o){const i=4*(n*t.width+e);t.data[i]=o.r,t.data[i+1]=o.g,t.data[i+2]=o.b,t.data[i+3]=o.a}function F(t,e){let n=t;if("object"==typeof n&&n.createdApp&&"Pixel Paint"==n.createdApp&&(n=function(t){if(Array.isArray(t)){const e=t;t="";for(let n=0;n<e.length;n++)t+=e[n]}let e,n,o=0;if(0===t.length)return o;for(e=0;e<t.length;e++)n=t.charCodeAt(e),o=(o<<5)-o+n,o|=0;return o}(JSON.stringify(n))),e&&e.length>0)for(let t=0;t<e.length;t++){const o=e[t];n+="."+o.c+":"+o.r}return n}function X(t,e,n,o,i,s,a,l){const r=n.images[o].data;for(let o=s;o<s+l;o++)if(!(o<0||o>=t.height))for(let c=i;c<i+a;c++){if(c<0||c>=t.width)continue;const h=Math.floor((c-i)/a*n.width),u=4*(Math.floor((o-s)/l*n.height)*n.width+h),d=r.data[u],f=r.data[u+1],g=r.data[u+2],m=r.data[u+3];if(255==m){const t=4*(o*e.width+c);e.data[t]=d,e.data[t+1]=f,e.data[t+2]=g,e.data[t+3]=m}}}function P(t,e,n,o){return t.tileMap.get(Y(e,n,o))}function Y(t,e,n){return Math.floor(t)+":"+Math.floor(e)+":"+Math.floor(n)}function Z(t,e,n,o,i){t.tileMap||(t.tileMap=new Map),t.tileMap.set(Y(e,n,o),i)}function N(t,e,n,o){t.tileReference||(t.tileReference={});const i=U(n,o);t.tileReference[e]=i.name}function U(t,e){const n=F(t,e);return p[n]||(p[n]=new R({url:t,colorReplacements:e})),p[n]}function j(t,e,n,o,i,s,a){const l=e.width/t.tileSize,r=e.height/t.tileSize;let c=o%t.tileSize*l,h=i%t.tileSize*r;c<0&&(c+=e.width),h<0&&(h+=e.height);const u=O(e.images[e.currentFrame].data,c,h);return E(n,s,a,u),255==u.a}requestAnimationFrame((function t(e){null==w&&(w=e);const n=e-w;w=e;let o=n/g;const i=1e3/n;isNaN(o)&&(o=1);for(const t in m){const e=m[t];C(e),e.loopFunction&&e.loopFunction(o,i)}!function(t){for(y+=t;y>=5;){y-=5;for(const t in p){const e=p[t];e.frames<=1||e.loaded&&(e.currentFrame++,e.currentFrame>=e.frames&&(e.currentFrame=0))}}}(o),requestAnimationFrame(t)}));const _={getInstance:v,getTexture:U,getTextureName:F};var q=e.Ay,J=e.iE,H=e.Mc,V=e.XL,W=e.mU;export{q as default,J as getInstance,H as getTexture,V as getTextureName,W as resizeAllInstances};