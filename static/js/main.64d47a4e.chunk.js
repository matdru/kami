(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{219:function(e,t,n){e.exports=n(393)},388:function(e,t,n){},393:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(29),i=n(158),c=n(77),l=n(6),s=n.n(l),u=(n(228),n(34)),d=n(35),m=n(37),p=n(36),f=n(38),h=n(19),b=n(20),g=n(399),v=n(13),O=n(405),j=n(204);function E(){var e=Object(h.a)(["\n\theight: 100%;\n\tpadding: 24;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbackground: '#fff';\n\tjustify-content: center;\n\talign-items: center;\n"]);return E=function(){return e},e}var y=b.a.div(E()),x=function(){return r.a.createElement(y,null,r.a.createElement(j.a,{size:"large"}))},k=n(396);function C(){var e=Object(h.a)(["\n\tcolor: black;\n\tfont-weight: bold;\n\tmargin-top: 2px;\n"]);return C=function(){return e},e}function w(){var e=Object(h.a)(["\n\tcolor: black;\n"]);return w=function(){return e},e}function S(){var e=Object(h.a)(["\n\twidth: 46px;\n\tpadding: 5px;\n"]);return S=function(){return e},e}function A(){var e=Object(h.a)(["\n\tdisplay: flex;\n\tflex-direction: row;\n\tmargin-bottom: 2px;\n"]);return A=function(){return e},e}var R=b.a.div(A()),I=b.a.div(S()),D=b.a.div(w()),T=b.a.div(C()),N=function(e){var t=e.children,n=e.name;return e.isConsecutive?r.a.createElement(R,null,r.a.createElement(I,null),r.a.createElement(D,null,t)):r.a.createElement(R,null,r.a.createElement(I,null,r.a.createElement(k.a,{size:35,shape:"square",icon:"user"})),r.a.createElement(D,null,r.a.createElement(T,null,n),t))},_=n(18),L=n(87),M=n.n(L),P=(n(197),n(208)),B=n.n(P),J=M.a.initializeApp({apiKey:"AIzaSyB2tCxT6yP0CWtCbD9JDj3ZKaxxW8T25PI",authDomain:"slacker-c3b01.firebaseapp.com",databaseURL:"https://slacker-c3b01.firebaseio.com",projectId:"slacker-c3b01",storageBucket:"slacker-c3b01.appspot.com",messagingSenderId:"286218247810"}),G=new B.a(J),U=M.a.firestore(),z=new M.a.auth.GithubAuthProvider,H=M.a.auth(),K=n(209),W=n.n(K),V=function(e,t){return new Date(e.createdAt).getTime()-new Date(t.createdAt).getTime()},q=function(e){var t=e.id,n=e.name,a=e.people,r=e.messages;return{type:"CREATE_ROOM",room:{id:t,name:n,people:a,messages:void 0===r?[]:r}}},X=function(e){return{type:"ERROR_MESSAGE",message:e}},F=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return function(a,r){var o=r().auth;if(o){var i={sender:{uid:o.uid,displayName:o.displayName},text:e,createdAt:W()().format(),status:n};return U.collection("rooms/".concat(t,"/messages")).add(i)}}},Y=function(e){return{type:"AVAILABLE_ROOMS",rooms:e}},Z=function(e,t){var n=[];return e.forEach(function(e){n.push(Object(_.a)({id:e.id},e.data()))}),n.sort(V),function(e,t){return{type:"UPDATE_MESSAGES",messages:e,roomId:t}}(n,t)};function Q(){var e=Object(h.a)(["\n\tflex-shrink: 0;\n\tpadding: 0px 15px;\n\tbackground: none;\n\tborder: none;\n"]);return Q=function(){return e},e}function $(){var e=Object(h.a)(["\n\tpadding-left: 14px;\n\tborder: none;\n\tborder-radius: 4px;\n\tflex-grow: 1;\n\toutline: none;\n"]);return $=function(){return e},e}function ee(){var e=Object(h.a)(["\n\theight: 44px;\n\tbackground-color: #fff;\n\tborder-radius: 4px;\n\tborder: 1px solid #acacac;\n\tdisplay: flex;\n\tflex-direction: row;\n\tflex-shrink: 0;\n"]);return ee=function(){return e},e}var te=b.a.form(ee()),ne=b.a.input($()),ae=b.a.button(Q()),re=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).state={value:""},n.handleTyping=function(e){n.setState({value:e.target.value})},n.handleSend=function(e){e.preventDefault();var t=n.props.room,a=n.state.value;t&&t.id&&a.length>0&&(n.props.trySendMessage(a,t.id),n.setState({value:""}))},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return r.a.createElement(te,{onSubmit:this.handleSend},r.a.createElement(ne,{value:this.state.value,onChange:this.handleTyping}),r.a.createElement(ae,{type:"submit"},"Send"))}}]),t}(a.Component),oe=Object(o.b)(null,{trySendMessage:F})(re),ie=n(401),ce=n(403),le=n(404),se=n(402),ue=n(397),de=n(398),me=n(39),pe=function(e,t){return{type:"LOGIN",uid:e,displayName:t}};function fe(){var e=Object(h.a)(["\n\tdisplay: flex;\n\tflex-direction: row;\n\tjustify-content: center;\n\talign-items: center;\n"]);return fe=function(){return e},e}le.a.TextArea,ie.a.Text;var he=ie.a.Title,be=b.a.div(fe()),ge=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).handleTryLogin=function(){n.props.tryLoginProvider().then(function(){n.props.handleClose()})},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return r.a.createElement(se.a,{title:"Profile",visible:this.props.isOpen,onOk:this.props.handleClose,onCancel:this.props.handleClose,okButtonProps:{disabled:!this.props.auth.uid},cancelButtonProps:{disabled:!this.props.auth.uid}},r.a.createElement("div",null,r.a.createElement(he,{level:4},"Login with"),r.a.createElement(ue.a,null,r.a.createElement(de.a,{span:24},r.a.createElement(be,null,r.a.createElement(me.a,{onClick:this.handleTryLogin,style:{margin:5}},r.a.createElement(v.a,{style:{fontSize:24},type:"github"})),r.a.createElement(me.a,null,r.a.createElement(v.a,{style:{fontSize:24},type:"google"})))))))}}]),t}(a.Component),ve=Object(o.b)(function(e){return{auth:e.auth}},{tryLoginProvider:function(){return function(e){return H.signInWithPopup(z).then(function(t){var n=t.user;if(console.log({user:n}),n){var a=n.displayName||"Ninja";return e(pe(n.uid,a))}}).catch(function(e){console.log({error:e}),e.code,e.message})}}})(ge);function Oe(){var e=Object(h.a)(["\n\tdisplay: flex;\n\tflex-direction: row;\n"]);return Oe=function(){return e},e}function je(){var e=Object(h.a)(["\n\tbackground: none;\n\tborder: 1px solid transparent;\n\tborder-radius: 4px;\n\ttransition: border 0.5s;\n\toutline: none;\n\tpadding: 0px;\n\tline-height: normal;\n\tcursor: pointer;\n"]);return je=function(){return e},e}var Ee=g.a.Header,ye=ie.a.Title,xe=b.a.button(je()),ke=b.a.div(Oe()),Ce=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).state={profileOpen:!1},n.handleProfileOpen=function(){n.setState({profileOpen:!0})},n.handleProfileClose=function(){n.setState({profileOpen:!1})},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this.props.room,t=r.a.createElement(O.b,null,r.a.createElement(O.b.Item,{onClick:this.handleProfileOpen},r.a.createElement("a",null,"Profile")),r.a.createElement(O.b.Item,null,r.a.createElement("a",null,"2nd menu item")),r.a.createElement(O.b.Item,null,r.a.createElement("a",null,"3rd menu item")));return r.a.createElement(Ee,{style:{background:"#fff",borderBottom:"1px solid #acacac",padding:16,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}},r.a.createElement(ye,{style:{margin:0},level:3},"# ",e?e.name:""),r.a.createElement(ke,null,r.a.createElement(ce.a,{overlay:t,placement:"bottomLeft"},r.a.createElement(xe,{onClick:this.handleProfileOpen},r.a.createElement(k.a,{size:35,shape:"square",icon:"user"}))),r.a.createElement(ve,{isOpen:this.state.profileOpen,handleClose:this.handleProfileClose})))}}]),t}(a.Component),we=Object(o.b)()(Ce),Se=n(214),Ae=function(e,t){return new Date(e.createdAt).getTime()-new Date(t.createdAt).getTime()},Re=Object(Se.a)(function(e,t){var n=t.match.params.roomId;return e.rooms.joined[n]},function(e,t){var n=t.match.params.roomId,a=e.rooms.joined[n];return a?Object.values(a.messages).sort(Ae):[]},function(e){return e.auth},function(e,t,n){return{auth:n,room:e,messages:t,isLoading:!e}});function Ie(){var e=Object(h.a)(["\n\tpadding-top: 8px;\n\tpadding-bottom: 8px;\n\tflex-grow: 1;\n\toverflow-y: scroll;\n\toverflow-x: hidden;\n"]);return Ie=function(){return e},e}function De(){var e=Object(h.a)(["\n\theight: 100%;\n\tpadding: 24;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbackground: '#fff';\n"]);return De=function(){return e},e}var Te=g.a.Content,Ne=b.a.div(De()),_e=b.a.div(Ie()),Le=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).messagesEnd=null,n.messagesContainer=null,n.scrollToBottom=function(){n.messagesEnd&&n.messagesEnd.scrollIntoView({behavior:"auto"})},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"componentWillMount",value:function(){var e=this.props.match.params.roomId;console.log(e)}},{key:"componentDidMount",value:function(){this.scrollToBottom()}},{key:"componentDidUpdate",value:function(e){if(0===e.messages.length&&this.props.messages.length>0)this.scrollToBottom();else if(e.messages.length!==this.props.messages.length&&e.messages.length>0&&this.props.messages.length>0){var t=e.messages.slice(-1)[0],n=this.props.messages.slice(-1)[0];if(t.id!==n.id&&n&&n.sender.uid===this.props.auth.uid)this.scrollToBottom();else if(this.messagesContainer){var a=this.messagesContainer,r=a.scrollHeight,o=a.scrollTop,i=(a.offsetHeight,a.clientHeight);Math.abs(i-(r-o-45))<45&&this.scrollToBottom()}}}},{key:"render",value:function(){var e=this,t=this.props,n=t.room,o=t.messages,i=t.isLoading,c=r.a.createElement(x,null);return i||(c=r.a.createElement(Ne,null,r.a.createElement(_e,{ref:function(t){e.messagesContainer=t}},o.map(function(e,t){return r.a.createElement(N,{isConsecutive:!!o[t-1]&&o[t-1].sender.uid===e.sender.uid,name:e.sender.displayName||"",key:e.id},e.text)}),r.a.createElement("div",{style:{float:"left",clear:"both"},ref:function(t){e.messagesEnd=t}})),r.a.createElement(oe,{room:this.props.room}))),r.a.createElement(a.Fragment,null,r.a.createElement(we,{room:n}),r.a.createElement(Te,{style:{margin:"0px 16px 24px 16px",overflow:"initial"}},c))}}]),t}(a.Component),Me=Object(o.b)(function(e,t){return Re(e,t)},{trySendMessage:F})(Le),Pe=n(42);function Be(){var e=Object(h.a)(["\n\tmargin-top: 5px;\n\tmargin-bottom: 5px;\n"]);return Be=function(){return e},e}var Je=le.a.TextArea,Ge=ie.a.Text,Ue=b.a.div(Be()),ze=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).state={roomName:"",description:""},n.handleChange=function(e){console.log(e.target.name),n.setState(Object(Pe.a)({},e.target.name,e.target.value))},n.handleSubmit=function(){var e=n.props.auth,t=e.uid,a=e.displayName;if(t){console.log("Create this room pls");var r=n.state.roomName;if(r&&r.length>0){var o={name:r,people:{id:t,name:a,unread:0,lastRead:0}};n.props.tryCreateRoom(o),n.props.handleClose()}}},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return r.a.createElement(se.a,{title:"Create Room",visible:this.props.isOpen,onOk:this.handleSubmit,onCancel:this.props.handleClose,okButtonProps:{disabled:!this.props.auth.uid},cancelButtonProps:{disabled:!this.props.auth.uid}},r.a.createElement(Ue,null,r.a.createElement(Ge,null,"Name:")),r.a.createElement(le.a,{name:"roomName",value:this.state.roomName,onChange:this.handleChange}),r.a.createElement(Ue,null,r.a.createElement(Ge,null,"Description:")),r.a.createElement(Je,{name:"description",value:this.state.description,onChange:this.handleChange,rows:4}))}}]),t}(a.Component),He=Object(o.b)(function(e){return{auth:e.auth}},{tryCreateRoom:function(e,t){return function(n,a){var r={name:e.name};return U.collection("rooms").get().then(function(a){var o=[];return a.forEach(function(e){console.log(e);var t=e.data();o.push(Object(_.a)({},t))}),o.find(function(e){return e.name===r.name})?t("Room name not available!"):U.collection("rooms").add(r).then(function(t){return U.collection("rooms/".concat(t.id,"/people")).doc(e.people.id).set(e.people).then(function(){U.collection("users/".concat(e.people.id,"/rooms")).doc(t.id).set({roomName:r.name}),n(q(Object(_.a)({id:t.id},e,{people:[e.people]}))),e.people.name})})})}}})(ze),Ke=n(400);function We(){var e=Object(h.a)(["\n\tpadding: 10px;\n"]);return We=function(){return e},e}var Ve=b.a.div(We()),qe=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).handleJoinRoom=function(e){if(!e.canJoin)return console.log("redirect to that room"),void n.props.handleClose();n.props.tryJoinRoom(e.id)},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement(se.a,{title:"Browse Rooms",visible:this.props.isOpen,onOk:this.props.handleClose,onCancel:this.props.handleClose,okButtonProps:{disabled:!this.props.auth.uid},cancelButtonProps:{disabled:!this.props.auth.uid},bodyStyle:{maxHeight:450,overflowY:"scroll"}},r.a.createElement(Ke.a,{dataSource:this.props.roomList,renderItem:function(t){return r.a.createElement(Ke.a.Item,{key:t.id},r.a.createElement(Ke.a.Item.Meta,{avatar:t.avatarUrl?r.a.createElement(k.a,{src:t.avatarUrl}):null,title:r.a.createElement("a",{onClick:function(){return e.handleJoinRoom(t)}},t.name),description:"TODO room descriptions"}),r.a.createElement("div",null,t.canJoin?r.a.createElement(me.a,{onClick:function(){return e.handleJoinRoom(t)}},"Join"):r.a.createElement(Ve,null,"joined")))}}," "))}}]),t}(a.Component),Xe=Object(o.b)(function(e){var t=e.rooms,n=t.available,a=t.joined;return{roomList:Object.values(n).map(function(e){var t=void 0===Object.values(a).find(function(t){return t.id===e.id});return Object(_.a)({},e,{canJoin:t})}),auth:e.auth}},{tryJoinRoom:function(e){return{type:"JOIN_ROOM_SAGA",roomId:e}}})(qe);n(388);function Fe(){var e=Object(h.a)(["\n\tfont-size: 16px;\n\tbackground: none;\n\tborder: none;\n\t-webkit-transition: color 0.5s;\n\ttransition: color 0.5s;\n\tcursor: pointer;\n\t&:hover {\n\t\tcolor: #fff;\n\t}\n"]);return Fe=function(){return e},e}function Ye(){var e=Object(h.a)(["\n\tpadding: 10px;\n\tcolor: rgba(255, 255, 255, 0.65);\n\tdisplay: flex;\n\tjustify-content: space-between;\n\talign-items: center;\n"]);return Ye=function(){return e},e}function Ze(){var e=Object(h.a)(["\n\theight: 100%;\n"]);return Ze=function(){return e},e}function Qe(){var e=Object(h.a)(["\n\ttext-align: center;\n\tpadding: 10px;\n\theight: 64px;\n\tborder-bottom: 1px solid grey;\n"]);return Qe=function(){return e},e}var $e=g.a.Sider,et=b.a.div(Qe()),tt=b.a.img(Ze()),nt=b.a.div(Ye()),at=b.a.button(Fe()),rt=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(m.a)(this,(e=Object(p.a)(t)).call.apply(e,[this].concat(r)))).state={openDialog:!1},n.handleCloseDialog=function(){n.setState({openDialog:!1})},n.handleOpenDialog=function(e){n.setState({openDialog:e})},n.handleRoomSelect=function(e){var t=e.key;n.props.history.push(t)},n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.props.initAuth()}},{key:"componentWillUpdate",value:function(e){!this.props.auth.uid&&e.auth.uid&&this.props.initSlacker()}},{key:"componentDidUpdate",value:function(e){var t=this.props,n=t.location,a=t.joinedRooms,r=t.history;"/"===n.pathname&&0===e.joinedRooms.length&&0!==a.length&&(console.log("redirect to first room?"),r.push("/r/".concat(a[0].id)))}},{key:"render",value:function(){var e=this;return r.a.createElement(g.a,{style:{height:"100%"}},r.a.createElement($e,{style:{overflow:"auto",height:"100vh",position:"fixed",left:0}},r.a.createElement(et,null,r.a.createElement(tt,{src:"fox.png"})),r.a.createElement(nt,null,r.a.createElement(at,{onClick:function(){return e.handleOpenDialog("browseRooms")}},r.a.createElement("span",null,"Rooms:")),r.a.createElement(at,{onClick:function(){return e.handleOpenDialog("createRoom")}},r.a.createElement(v.a,{type:"plus-circle"}))),r.a.createElement(He,{isOpen:"createRoom"===this.state.openDialog,handleClose:this.handleCloseDialog}),r.a.createElement(Xe,{isOpen:"browseRooms"===this.state.openDialog,handleClose:this.handleCloseDialog}),r.a.createElement(O.b,{theme:"dark",mode:"inline",onSelect:this.handleRoomSelect,selectedKeys:[this.props.location.pathname]},this.props.joinedRooms.map(function(e){return r.a.createElement(O.b.Item,{key:"/r/".concat(e.id)},r.a.createElement("span",{className:"nav-text"},"# ",e.name))}))),r.a.createElement(g.a,{style:{marginLeft:200,background:"#fff"}},r.a.createElement(c.c,null,r.a.createElement(c.a,{path:"/r/:roomId",component:Me}),r.a.createElement(c.a,{path:"/"},0===this.props.joinedRooms.length?r.a.createElement(x,null):r.a.createElement("div",null,"No chat selected")))))}}]),t}(a.Component),ot=Object(o.b)(function(e){return{auth:e.auth,joinedRooms:Object.values(e.rooms.joined),availableRooms:Object.values(e.rooms.available)}},{initAuth:function(){return function(e){return H.onAuthStateChanged(function(t){if(t){if(console.log("user from saved whatever ?",t),t){var n=t.displayName||"Ninja";return e(pe(t.uid,n))}}else console.log("user is undefined here lol")})}},initSlacker:function(){return{type:"INIT_SLACKER_SAGA"}}})(rt),it=n(52),ct=n(216),lt=n(85),st={joined:{},available:{}},ut=Object(it.c)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOGIN":return{uid:t.uid,displayName:t.displayName};case"LOGOUT":return{};default:return e}},rooms:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:st,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"CREATE_ROOM":case"JOINED_ROOM":return Object(_.a)({},e,{joined:Object(_.a)({},e.joined,Object(Pe.a)({},t.room.id,t.room))});case"AVAILABLE_ROOMS":return Object(_.a)({},e,{available:Object(_.a)({},t.rooms.reduce(function(e,t){return Object(_.a)({},e,Object(Pe.a)({},t.id,t))},{}))});case"SEND_MESSAGE":return Object(_.a)({},e,{joined:Object(_.a)({},e.joined,Object(Pe.a)({},t.roomId,Object(_.a)({},[e.joined[t.roomId]],{messages:Object(_.a)({},e.joined[t.roomId].messages,Object(Pe.a)({},t.message.id,t.message))})))});case"UPDATE_MESSAGES":return Object(_.a)({},e,{joined:Object(_.a)({},e.joined,Object(Pe.a)({},t.roomId,Object(_.a)({},e.joined[t.roomId],{messages:Object(_.a)({},e.joined[t.roomId].messages,t.messages.reduce(function(e,t){return Object(_.a)({},e,Object(Pe.a)({},t.id,t))},{}))})))});default:return e}},redirect:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"REDIRECT_TO":return{redirectTo:t.redirectTo};default:return e}}}),dt=n(32),mt=n.n(dt),pt=n(16),ft=mt.a.mark(gt),ht=mt.a.mark(vt),bt=mt.a.mark(Ot);function gt(e){var t,n,a,r,o,i,c;return mt.a.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return console.log("try fetch room ",e),t=U.collection("rooms").doc(e),l.next=4,Object(pt.call)(G.firestore.getDocument,t);case 4:if(!(n=l.sent).exists){l.next=24;break}return a=n.data(),r=[],o={},l.next=11,Object(pt.call)(G.firestore.getCollection,t.collection("people"));case 11:return l.sent.forEach(function(e){r.push(Object(_.a)({id:e.id},e.data()))}),console.log({people:r}),i=t.collection("messages").orderBy("createdAt","desc").limit(25),l.next=17,Object(pt.call)(G.firestore.getCollection,i);case 17:return l.sent.forEach(function(e){o[e.id]=Object(_.a)({id:e.id},e.data())}),l.next=21,Object(pt.put)(q({id:t.id,name:a?a.name:"Error",people:r,messages:o}));case 21:return c=t.collection("messages").orderBy("createdAt","desc").limit(1),l.next=24,Object(pt.fork)(G.firestore.syncCollection,c,{successActionCreator:function(t){return Z(t,e)}});case 24:case"end":return l.stop()}},ft)}function vt(e){var t,n,a,r,o,i,c,l,s,u;return mt.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(pt.select)(function(e){return e.auth});case 2:if((t=e.sent).uid){e.next=6;break}return console.log("no auth!"),e.abrupt("return");case 6:return n=U.collection("rooms").get(),e.next=9,n;case 9:return a=e.sent,r=[],a.forEach(function(e){var t=Object(_.a)({id:e.id},e.data());r.push(t)}),e.next=14,Object(pt.put)(Y(r));case 14:return o=r.find(function(e){return"general"===e.name}),e.next=17,Object(pt.call)(G.firestore.getCollection,"users/".concat(t.uid,"/rooms"));case 17:if((i=e.sent).empty){e.next=35;break}c=[],i.forEach(function(e){return c.push(e.id)}),l=0,s=c;case 22:if(!(l<s.length)){e.next=30;break}return u=s[l],e.next=26,Object(pt.fork)(gt,u);case 26:e.sent;case 27:l++,e.next=22;break;case 30:if(!o||c.includes(o.id)){e.next=33;break}return e.next=33,Object(pt.put)({type:"JOIN_ROOM_SAGA",roomId:o.id,room:o});case 33:e.next=38;break;case 35:if(!o){e.next=38;break}return e.next=38,Object(pt.put)({type:"JOIN_ROOM_SAGA",roomId:o.id,room:o});case 38:case"end":return e.stop()}},ht)}function Ot(){return mt.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(pt.takeLatest)("INIT_SLACKER_SAGA",vt);case 2:case"end":return e.stop()}},bt)}var jt=Ot,Et=mt.a.mark(xt),yt=mt.a.mark(kt);function xt(e){var t,n,a,r,o,i,c,l;return mt.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return t=e.roomId,s.next=3,Object(pt.select)(function(e){return e.auth});case 3:return n=s.sent,a=n.uid,r=n.displayName,o=U.doc("rooms/".concat(t)),s.next=9,Object(pt.call)(G.firestore.getDocument,o);case 9:if(i=s.sent,(c=Object(_.a)({id:i.id},i.data()))&&i.exists){s.next=17;break}return s.next=14,Object(pt.put)(X("Room not found!"));case 14:return s.abrupt("return");case 17:if(!c.people||!c.people.find(function(e){return e.id===a})){s.next=21;break}return s.abrupt("return");case 21:return l={name:r,id:a,unread:0,lastRead:0},s.next=24,Object(pt.call)(G.firestore.setDocument,"rooms/".concat(t,"/people/").concat(l.id),l);case 24:return s.next=26,Object(pt.call)(G.firestore.setDocument,"users/".concat(l.id,"/rooms/").concat(t),{roomName:c.name});case 26:return s.next=28,Object(pt.call)(gt,t);case 28:case"end":return s.stop()}},Et)}function kt(){return mt.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(pt.takeEvery)("JOIN_ROOM_SAGA",xt);case 2:case"end":return e.stop()}},yt)}var Ct=kt,wt=mt.a.mark(St);function St(){return mt.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(pt.all)([jt(),Ct()]);case 2:case"end":return e.stop()}},wt)}var At=Object(lt.default)(),Rt=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||it.d,It=function(){var e=Object(it.e)(ut,Rt(Object(it.a)(ct.a,At)));return At.run(St),e}(),Dt=r.a.createElement(o.a,{store:It},r.a.createElement(i.a,null,r.a.createElement(c.a,{path:"/",component:ot})));s.a.render(Dt,document.getElementById("container"))}},[[219,1,2]]]);
//# sourceMappingURL=main.64d47a4e.chunk.js.map