module.exports=function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=245)}({10:function(e,n){e.exports=require("vue")},11:function(e,n,t){"use strict";var o=t(5),i=t(8);n.a={jump:function(e,n){var t="";o.a.$on("eJumpCallBack",(function(e){"function"==typeof e&&(t=e)})),""!==t&&"function"==typeof t&&t();var r="",a=window.location.hostname.indexOf(".h5.");if(null==e||null==e||""==e)r=-1===a?"".concat(window.location.protocol,"//").concat(window.location.hostname,"/").concat(window.APPID):"".concat(window.location.protocol,"//").concat(window.location.hostname);else{"/"!==e&&0===e.indexOf("/")&&(e=e.substr(1));var c=e.split("?")[0];r=0===c.indexOf("http")?e:-1===a?"".concat(window.location.protocol,"//").concat(window.location.hostname,"/").concat(window.APPID,"/").concat(e):"".concat(window.location.protocol,"//").concat(window.location.hostname,"/").concat(e),c.indexOf("content_page")>=0&&(r=r.replace("".concat(window.APPID,"/"),"")),"javascript:"==c&&(r=e)}r=i.a.serviceDomainTransform(e,r),n?window.location.replace(r):window.location.href=r}}},21:function(e,n){e.exports=require("@babel/runtime/helpers/typeof")},245:function(e,n,t){"use strict";t.r(n);var o=t(5),i=t(21),r=t.n(i),a=["APPID","USERID","USERIP","MACHINEIP","WXNICKNAME","WXAVATAR"],c=function(e){var n=[];!(arguments.length>1&&void 0!==arguments[1])||arguments[1]||(n=["USERID","USERIP","MACHINEIP"]),window.e_report||(window.e_report=function(){}),e&&"object"===r()(e)&&a.forEach((function(t){e.hasOwnProperty(t)&&!n.includes(t)&&(window[t]=e[t])}))},s=t(11),l=t(90),u=t.n(l),f=0,d=function(e,n,t){e.$emit("onShareSucceed",{res:n,type:t})},p=function(e,n,t){e.$emit("onShareCanceled",{res:n,type:t})},w=function e(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;setTimeout((function(){wx&&wx.apiLoadCompleted?(n(),console.log("apiLoadCompleted sdkApi is completed",f)):(f<4?e(n):n(),console.log("initCount uncompleted",f)),f++}),t)},h=function(e,n){return e.replace(/(?![?&])(entry_type)=\w+/gi,"entry_type=".concat(n))},m=function(e){var n=e.selfConf,t=e.wxInfo,o=e.loadVoice,i=e.wxReadyCallBack,r=e.wxErrorCallBack,a=e.EventBus,c=t.jsApiList;"string"!=typeof c&&(c=JSON.stringify(c)),(c=JSON.parse(c.replace(/'/g,'"')))&&c.push("hideOptionMenu"),t.debug=!1,t.share_desc&&(t.share_desc=function(e){var n={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return e.replace(/&(lt|gt|nbsp|amp|quot);/gi,(function(e,t){return n[t]}))}(t.share_desc));var s={debug:t.debug,beta:t.beta,appId:t.appId,nonceStr:t.nonceStr,timestamp:t.timestamp,url:t.url,signature:t.signature,jsApiList:c};console.log("selfConf@@@@@@@@@@@@@@@@@@@---\x3e",n),n&&(s=Object.assign(s,n),console.log("confs@@@@@@@@@@@@@@@@@@@---\x3e",s)),wx.config(s),console.timeEnd("init time"),wx.error((function(e){try{"function"==typeof r&&r(e,s)}catch(e){console.error(e)}console.log("微信初始化失败",e)})),window.isWxReady=!1,wx.ready((function(){try{"function"==typeof i&&i()}catch(e){console.error(e)}if(window.isWxReady=!0,t.need_share){console.log("init ok");var e=t.share_link,n=t.share_link,r=t.share_link,c=t.share_link,s=t.share_link;if(t&&t.share_link&&t.share_link.indexOf("?")>-1)try{var l=function(e){var n={},t=e.match(/[?&][^?&]+=[^?&]+/g);return t&&t.forEach((function(e){var t=e.substring(1).split("="),o=decodeURIComponent(t[0]),i=decodeURIComponent(t[1]);n[o]=i})),n}(t.share_link);l.hasOwnProperty("entry")||l.hasOwnProperty("entry_type")?(e=h(t.share_link,"2001"),n=h(t.share_link,"2002"),r=h(t.share_link,"2003"),c=h(t.share_link,"2004"),s=h(t.share_link,"2005")):(e+="&entry=2&entry_type=2001",n+="&entry=2&entry_type=2002",r+="&entry=2&entry_type=2003",c+="&entry=2&entry_type=2004",s+="&entry=2&entry_type=2005")}catch(t){e+="&entry=2&entry_type=2001",n+="&entry=2&entry_type=2002",r+="&entry=2&entry_type=2003",c+="&entry=2&entry_type=2004",s+="&entry=2&entry_type=2005"}else e+="?entry=2&entry_type=2001",n+="?entry=2&entry_type=2002",r+="?entry=2&entry_type=2003",c+="?entry=2&entry_type=2004",s+="?entry=2&entry_type=2005";wx.onMenuShareAppMessage({title:t.share_title,desc:t.share_desc,link:e,imgUrl:t.share_img_url,trigger:function(){},success:function(e){d(a,e,"onMenuShareAppMessage")},cancel:function(e){p(a,e,"onMenuShareAppMessage")},fail:function(e){!function(e,n,t){e.$emit("onShareFailed",{res:n,type:"onMenuShareAppMessage"})}(a,e)}}),wx.onMenuShareTimeline({title:t.shareTimeTitle||t.share_title,desc:t.share_desc,link:n,imgUrl:t.share_img_url,success:function(e){d(a,e,"onMenuShareTimeline")},cancel:function(e){p(a,e,"onMenuShareTimeline")}}),wx.onMenuShareQQ({title:t.share_title,desc:t.share_desc,link:r,imgUrl:t.share_img_url,success:function(e){d(a,e,"onMenuShareQQ")},cancel:function(e){p(a,e,"onMenuShareQQ")}}),wx.onMenuShareWeibo({title:t.share_title,desc:t.share_desc,link:c,imgUrl:t.share_img_url,success:function(e){d(a,e,"onMenuShareWeibo")},cancel:function(e){p(a,e,"onMenuShareWeibo")}}),wx.onMenuShareQZone({title:t.share_title,desc:t.share_desc,link:s,imgUrl:t.share_img_url,success:function(e){d(a,e,"onMenuShareQZone")},cancel:function(e){p(a,e,"onMenuShareQZone")}})}else console.log("隐藏菜单"),wx.hideOptionMenu();if(t.voiceId&&o){var u=navigator.userAgent;if((u.indexOf("iPhone")>-1||u.indexOf("iphone")>-1)&&window.location.href.indexOf("homepage")>-1)if(localStorage){var f=localStorage.getItem("nbpTime"),w=(new Date).getTime();f&&!isNaN(parseInt(f))&&w-parseInt(f)<3e5?y():_(t)}else _(t);else(u.indexOf("iPhone")>-1||u.indexOf("iphone")>-1)&&y()}}))},_=function(e){wx.checkJsApi({jsApiList:["downloadVoice"],success:function(){wx.downloadVoice({serverId:e.voiceId,isShowProgressTips:0,success:function(e){var n=e.localId;wx.playVoice({localId:n});var t=(new Date).getTime();localStorage.setItem("nbpTime",t)}})}})},y=function(){wx.stopRecord()};window.eJump=s.a.jump,n.default={init:function(e){var n=e.selfConf,t=e.initData,i=e.sdkInfo,r=void 0===i?{CLIENT_ENV:null}:i,a=e.initGlobalVar,s=void 0===a||a,l=e.loadVoice,f=void 0!==l&&l,d=e.smartCampusCallBack,p=e.wxReadyCallBack,h=e.wxErrorCallBack,_=e.EventBus,y=void 0===_?o.a:_;if(console.log("init begin",t),console.time("init time"),t.hasOwnProperty("wxData")&&window.wx){var g=t.wxData;if("smartCampus"===r.CLIENT_ENV)w((function(){"function"==typeof d&&wx.init&&d()}));else if("wechat"===r.CLIENT_ENV||"wxwork"===r.CLIENT_ENV||"wx_miniProgram"===r.CLIENT_ENV){if(w((function(){wx.config&&(u.a&&(window.wx=u.a,Object.assign(window.wx,r)),m({selfConf:n,wxInfo:g,loadVoice:f,wxReadyCallBack:p,wxErrorCallBack:h,EventBus:y}))})),"wx_miniProgram"===r.CLIENT_ENV){var x={title:g.share_title||document.title,imageUrl:g.share_img_url||"",share_link:g.share_link||location.href};wx.miniProgram&&wx.miniProgram.postMessage({data:{shareConfig:x}})}}else if("xiaoeapp"===r.CLIENT_ENV||"xiaoehelperapp"===r.CLIENT_ENV){var v={share_title:g.share_title||document.title,share_image:g.share_img_url||"",share_content:g.share_desc||"",share_link:g.url||location.href};w((function(){window.wx&&wx.init&&window.wx.init(v,{fail:function(e){console.error(e)}})}))}else if("qq"===r.CLIENT_ENV){var b={title:g.share_title||document.title,summary:g.share_desc||" ",pic:g.share_img_url||"",url:g.share_link||location.href,callback:g.callback,swapTitle:g.swapTitle};console.log("=== qq终端 options=== ",b),w((function(){!function(e){var n={title:e.title,desc:e.summary,share_url:e.url,image_url:e.pic};window.mqq?function(){try{e.callback?window.mqq.ui.setOnShareHandler((function(t){3==t&&(e.swapTitle||e.WXconfig&&e.WXconfig.swapTitleInWX)?n.title=e.summary:n.title=e.title,n.share_type=t,n.back=!0,window.mqq.ui.shareMessage(n,(function(n){0===n.retCode&&e.callback&&e.callback.call(this,n)}))})):window.mqq.data.setShareInfo(n)}catch(e){}}():console.log("window.mqq is not defined")}(b)}))}}s&&t.hasOwnProperty("commonData")&&(t.bizData&&t.bizData.data&&t.bizData.data.alive_info?c(t.commonData,!1):c(t.commonData))}}},5:function(e,n,t){"use strict";var o=t(10),i=t.n(o);n.a=new i.a},8:function(e,n,t){"use strict";var o="service",i="//"+o+".",r=["search"];function a(){return window.location.origin.indexOf(i)>-1}n.a={isServiceDomain:a,serviceDomainTransform:function(e,n){return n&&(e&&"/"!==e&&0===e.indexOf("/")&&(e=e.substr(1)),e&&function(e){var n=e.indexOf("/");0===n&&(e=e.substr(n+1));var t=e.indexOf("?");return t>0&&(e=e.substr(0,t)),r.indexOf(e)>-1}(e)?n=function(e){var n=window.location.origin;return"/"!==e&&0===e.indexOf("/")&&(e=e.substr(1)),n.indexOf(".inside.")>-1?"http://"+o+".h5.inside.xiaoeknow.com/"+window.APPID+"/"+e:n.indexOf(".test.")>-1?"http://"+o+".h5.test.xiaoeknow.com/"+window.APPID+"/"+e:"https://"+o+".h5.xiaoeknow.com/"+window.APPID+"/"+e}(e):a()&&(n=function(e){if(e&&window&&window.APPID){var n="//"+window.APPID+".";e=e.replace(i,n)}return e}(n))),n}}},90:function(e,n){e.exports=require("weixin-js-sdk")}}).default;