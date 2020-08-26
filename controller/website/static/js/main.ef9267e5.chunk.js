(this.webpackJsonpvjoy=this.webpackJsonpvjoy||[]).push([[0],{40:function(e,t,n){e.exports=n(89)},45:function(e,t,n){},46:function(e,t,n){},85:function(e,t){},88:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),i=n(35),c=n.n(i),r=(n(45),n(10)),o=l.a.createContext(),s=o.Provider,u=o,m=(n(46),n(36)),d=n.n(m);n(56);function x(e){var t=e.xg,n=e.yg,i=e.pwidth,c=void 0===i?150:i,r=e.pheight,o=void 0===r?150:r,s=e.snap,m=void 0===s||s,x=Object(a.useContext)(u);return l.a.createElement("div",null,l.a.createElement(d.a,{options:{mode:"static",color:"green",position:{top:"50%",left:"50%"}},style:{outline:"1px dashed green",width:c,height:o},onMove:function(e,a){var l=a.angle.radian,i=a.force,c=Math.cos(l)*i,r=Math.sin(l)*i,o=Math.min(c/3+.5,1),s=Math.min(-r/3+.5,1);x.on_axis(o,t),x.on_axis(s,n)},onEnd:function(){m&&(x.on_axis(.5,t),x.on_axis(.5,n))}}))}var h=document.documentElement;function E(){document.fullscreenElement?document.exitFullscreen&&(document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()):h.requestFullscreen?h.requestFullscreen():h.mozRequestFullScreen?h.mozRequestFullScreen():h.webkitRequestFullscreen?h.webkitRequestFullscreen():h.msRequestFullscreen&&h.msRequestFullscreen()}var v=n(9),f=n(7),p=n(8),b=n(37),y=n.n(b),g=function(){function e(){var t=this;Object(f.a)(this,e),this.socket=null,this.initialized=!1,this.connect(),this.socket.on("connect",(function(){if(!t.initialized){t.initialized=!0;var e=new Uint8Array([255]);t.socket.emit("data",e.buffer)}}))}return Object(p.a)(e,[{key:"connect",value:function(e){e||(e="ws://".concat(document.location.host)),this.socket=new y.a(e)}},{key:"send",value:function(e){this.socket&&(this.socket.connected&&this.socket.emit("data",e.buffer),this.socket.connected||(console.log("Reconnecting to websocket"),this.connect()))}},{key:"on_axis",value:function(e,t){var n=new Uint8Array(new Float32Array([e]).buffer),a={x:131,y:132,z:133,rx:134,ry:135,rz:136,sl0:137,sl1:144}[t];this.send(new Uint8Array([a].concat(Object(v.a)(n))))}},{key:"on_button_press",value:function(e){this.send(new Uint8Array([129,255&e]))}},{key:"on_button_release",value:function(e){this.send(new Uint8Array([130,255&e]))}}]),e}(),w=n(11),k=n(38),j=n(39),F=(n(88),function(e){Object(j.a)(n,e);var t=Object(k.a)(n);function n(e){var a;return Object(f.a)(this,n),(a=t.call(this,e)).state={enabled:!0,x:null,y:null},a}return Object(p.a)(n,[{key:"componentDidMount",value:function(){var e=this;window.addEventListener("deviceorientation",(function(t){return e.handle_orientation(t)}))}},{key:"handle_orientation",value:function(e){if(this.setState(Object(w.a)({},this.state,{x:0,y:0})),this.state.enabled){var t=e.beta,n=e.gamma;if(null!=t&&null!=n){t=((t=this.clip(t,-90,90))+90)/180,n=((n=this.clip(n,-90,90))+90)/180;var a=this.context,l=new Uint8Array(new Float32Array([t,n]).buffer);a.send(new Uint8Array([175].concat(Object(v.a)(l)))),this.setState(Object(w.a)({},this.state,{x:t,y:n}))}else this.setState(Object(w.a)({},this.state,{x:t,y:n}))}}},{key:"clip",value:function(e,t,n){return Math.min(Math.max(e,t),n)}},{key:"toggle",value:function(){this.setState({enabled:!this.state.enabled})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement("button",{className:this.state.enabled?"gyro-enabled":"",onClick:function(){return e.toggle()}},"Gyro"),l.a.createElement("label",{style:{marginLeft:"2px"}},"x: ",this.state.x||"?",", y: ",this.state.y||"?"))}}]),n}(a.Component));function O(e){var t=e.axis,n=e.text,i=e.default_value,c=void 0===i?50:i,o=e.snap,s=void 0===o||o,m=e.step,d=void 0===m?10:m,x=Object(a.useContext)(u),h=Object(a.useState)(c),E=Object(r.a)(h,2),v=E[0],f=E[1],p=Object(a.useState)(s),b=Object(r.a)(p,2),y=b[0],g=b[1];function w(){x.on_axis(c/100,t),f(c)}function k(){y&&w()}return l.a.createElement("div",{className:"w-100"},l.a.createElement("input",{className:"w-75",type:"range",value:v,max:100,min:0,step:d,onChange:function(e){var n=e.target.value/100;x.on_axis(n,t),f(e.target.value)},onMouseUp:k,onTouchEnd:k}),l.a.createElement("button",{className:y?"snapped-slider":"",onClick:function(){y?g(!1):(g(!0),w())}},n))}function _(e){var t=e.id,n=e.text,i=Object(a.useState)(!1),c=Object(r.a)(i,2),o=c[0],s=c[1],m=Object(a.useContext)(u);function d(){s(!0),m.on_button_press(t)}function x(){s(!1),m.on_button_release(t)}return l.a.createElement("button",{className:o?"pressed-btn":"",onMouseDown:d,onMouseUp:x,onTouchStart:d,onTouchEnd:x,style:{margin:"5px"}},n)}F.contextType=u;var A=function(){var e=new g;return e.connect(),l.a.createElement(s,{value:e},l.a.createElement("div",{className:"container noselect"},l.a.createElement("div",{className:"left-panel"},l.a.createElement(x,{xg:"x",yg:"y",pwidth:250,pheight:250}),l.a.createElement(O,{axis:"sl0",text:"spoilers",snap:!1,step:1,default_value:0}),l.a.createElement("div",null,l.a.createElement(_,{id:22,text:"PT Up"}),l.a.createElement(_,{id:23,text:"PT Down"})),l.a.createElement(F,null)),l.a.createElement("div",{className:"mid-panel"},l.a.createElement(x,{xg:"rx",yg:"ry",pwidth:250,pheight:250,snap:!0}),l.a.createElement("div",null,l.a.createElement(_,{id:15,text:"Reset Camera"}),l.a.createElement(_,{id:16,text:"Ext Camera"}),l.a.createElement(_,{id:13,text:"Menu"}),l.a.createElement(_,{id:14,text:"Alt"}),l.a.createElement(_,{id:17,text:"Map"}),l.a.createElement(_,{id:18,text:"Drone"}),l.a.createElement("div",null,l.a.createElement("label",null,l.a.createElement("small",null,"Instruments")),l.a.createElement(_,{id:19,text:"Prev"}),l.a.createElement(_,{id:20,text:"Next"})))),l.a.createElement("div",{className:"right-panel"},l.a.createElement(O,{axis:"z",text:"rudder",step:1}),l.a.createElement(O,{axis:"rz",text:"flaps",snap:!1,step:1}),l.a.createElement("div",{style:{textAlign:"center"}},l.a.createElement(_,{id:12,text:"Flaps Up"}),l.a.createElement(_,{id:2,text:"Flaps Down"})),l.a.createElement("div",{style:{textAlign:"center"}},l.a.createElement(_,{id:3,text:"Gear"}),l.a.createElement(_,{id:4,text:"Brakes"}),l.a.createElement(_,{id:5,text:"PBrakes"})),l.a.createElement(O,{axis:"sl1",text:"eng",snap:!1,step:1}),l.a.createElement("div",{style:{textAlign:"center"}},l.a.createElement(_,{id:6,text:"Y"}),l.a.createElement("div",null,l.a.createElement(_,{id:7,text:"X"}),l.a.createElement(_,{id:8,text:"B"})),l.a.createElement(_,{id:9,text:"A"})),l.a.createElement("div",{style:{textAlign:"center"}},l.a.createElement(_,{id:10,text:"Select"}),l.a.createElement(_,{id:11,text:"Start"}),l.a.createElement(_,{id:21,text:"AI Pilot"})),l.a.createElement("div",{style:{marginTop:"10px",float:"right"}},l.a.createElement("button",{onClick:E},l.a.createElement("b",null,"\u26f6"))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(A,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[40,1,2]]]);
//# sourceMappingURL=main.ef9267e5.chunk.js.map