module.exports=function(n){var t={};function o(e){if(t[e])return t[e].exports;var r=t[e]={i:e,l:!1,exports:{}};return n[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=n,o.c=t,o.d=function(n,t,e){o.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:e})},o.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},o.t=function(n,t){if(1&t&&(n=o(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(o.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var r in n)o.d(e,r,function(t){return n[t]}.bind(null,r));return e},o.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(t,"a",t),t},o.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},o.p="",o(o.s=449)}({3:function(n,t,o){"use strict";var e=o(9),r=o.n(e),i=o(8),a={};a.init=function(){var n=encodeURIComponent,t=Array.isArray||function(n){return n instanceof Array};function o(n){return null!=n&&n==n.window}function e(n){return function(n){return"object"==a(n)}(n)&&!o(n)&&Object.getPrototypeOf(n)==Object.prototype}function r(n,t){var e,r;if(function(n){var t=!!n&&"length"in n&&n.length,e=a(n);return"function"!=e&&!o(n)&&("array"==e||0===t||"number"==typeof t&&t>0&&t-1 in n)}(n)){for(e=0;e<n.length;e++)if(!1===t.call(n[e],e,n[e]))return n}else for(r in n)if(!1===t.call(n[r],r,n[r]))return n;return n}var i={};function a(n){return null==n?String(n):i[toString.call(n)]||"object"}return r("Boolean Number String Function Array Date RegExp Object Error".split(" "),(function(n,t){i["[object "+t+"]"]=t.toLowerCase()})),function(o,i){var c=[];return c.add=function(t,o){(function(n){return"function"==a(n)})(o)&&(o=o()),null==o&&(o=""),this.push(n(t)+"="+n(o))},function n(o,i,c,u){var s,p=t(i),f=e(i);r(i,(function(t,e){s=a(e),u&&(t=c?u:u+"["+(f||"object"==s||"array"==s?t:"")+"]"),!u&&p?o.add(e.name,e.value):"array"==s||!c&&"object"==s?n(o,e,c,t):o.add(t,e)}))}(c,o,i),c.join("&").replace(/%20/g,"+")}}();var c={paramForm:a},u={},s={},p=function(n){try{u[n]=parseInt(performance.now())}catch(n){console.log(n)}},f=function(n){if(u[n])try{return parseInt(performance.now())-u[n]}catch(n){console.log(n)}return 0},d=function(n){"alive_room"===(s&&s.common_data&&s.common_data.page?s.common_data.page:"")&&(function(n){if("[object Object]"===Object.prototype.toString.call(n)){var t={};for(var o in s&&s.common_data&&(t.common_data=s.common_data),s&&s.report_type&&(t.report_type=s.report_type),n)n.hasOwnProperty(o)&&(t[o]=n[o]);return s=t,!0}}(n),function(n){try{if(!window._eReport)return;setTimeout((function(){var t=c.init(n),o="".concat("https://report.h5.xeknow.com/error_report","?").concat(t),e=new Image,r="log_"+Math.floor(2147483648*Math.random()).toString(36);window[r]=e,e.onload=e.onerror=e.onabort=function(){e.onload=e.onerror=e.onabort=null,e=window[r]=null},e.src=o,setTimeout((function(){e&&!e.complete&&(e.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC")}),1e3)}),2e3)}catch(n){console.log(n)}}(s))},l=null;t.a={request:function(n,t,o,e){null==l&&-1==(l=window.location.origin).indexOf("localhost:")&&(-1==l.indexOf(".h5.")||i.a.isServiceDomain())&&(l=l+"/"+window.APPID),e=e||"json";var a=(new Date).getTime();p(a),r.a.ajax({type:"POST",url:l+"/"+n,dataType:e,timeout:6e4,data:{bizData:t},success:function(e,r,i){try{var c=e&&0===e.code?1:0;d({report_type:2,api_data:{api_type:"ajax",api_url:n,api_is_success:c,api_params:t,api_time:f(a),api_code:i.status,api_msg:1===c?"":e}})}catch(n){console.log(n)}"function"==typeof o&&o(e)},error:function(e,r,i){try{d({report_type:2,api_data:{api_type:"ajax",api_url:n,api_is_success:0,api_params:t,api_time:f(a),api_code:e.status,api_msg:i}})}catch(n){console.log(n)}"function"==typeof o&&o({code:-10})}})},get:function(n,t,o,e){null==(l="wx_voice_error_report"===n?"182.254.245.226:6996/wx_voice_error_report":null)&&(l=window.location.origin),e=e||"json";var i=(new Date).getTime();p(i),r.a.ajax({url:l+"/"+n,dataType:e,timeout:6e4,data:t,success:function(e,r,a){try{var c=e&&0===e.code?1:0;d({report_type:2,api_data:{api_type:"ajax",api_url:n,api_is_success:c,api_params:t,api_time:f(i),api_code:a.status,api_msg:1===c?"":e}})}catch(n){console.log(n)}"function"==typeof o&&o(e)},error:function(e,r,a){try{d({report_type:2,api_data:{api_type:"ajax",api_url:n,api_is_success:0,api_params:t,api_time:f(i),api_code:e.status,api_msg:a}})}catch(n){console.log(n)}"function"==typeof o&&o({code:-10})}})}}},449:function(n,t,o){"use strict";o.r(t);var e=o(3),r="teas/wework/agent_js_init_data";function i(n){var t=document.createElement("script");t.src=n,document.head.appendChild(t)}function a(){var n=window&&window.navigator&&window.navigator.userAgent,t=n.indexOf("Android")>-1||n.indexOf("Adr")>-1,o=/wxwork/.test(n);t&&o&&i("https://res.wx.qq.com/open/js/jweixin-1.2.0.js"),i("https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js");var a=window.location;!function(n){console.log("当前店铺已接入企业微信");var t={page_url:n};e.a.get(r,t,(function(n){var t=n.code,o=n.data;if(window.__qywx_corp_id=o.corpid,0===t){var e={corpid:o.corpid,agentid:o.agentid,timestamp:o.timestamp,nonceStr:o.nonceStr,signature:o.signature,jsApiList:["selectExternalContact"],success:function(){window.WWOpenData&&(window.WWOpenData.checkSession&&window.WWOpenData.checkSession({success:function(){console.info("open-data 登录态校验成功")},fail:function(){console.error("open-data 登录态过期")}}),window.WWOpenData.on&&(window.WWOpenData.on("update",(function(){console.log("渲染数据发生变更!!!!!!!!!!!")})),window.WWOpenData.on("error",(function(n){console.log(JSON.stringify(n),"获取数据失败")}))))},fail:function(n){console.log(JSON.stringify(n),"agentConfig失败！！！！！"),n.errMsg.indexOf("function not exist")>-1&&alert("版本过低请升级")}};wx.agentConfig(e)}}))}(a.origin+a.pathname+a.search)}t.default={init:function(){console.log("进入agentConfig！！！！"),window.__shop_type&&1==window.__shop_type&&(r="training_api/v2/qywx/agent_js_init_data",a()),window.__org_type&&1==window.__org_type&&a()}}},8:function(n,t,o){"use strict";var e="service",r="//"+e+".",i=["search"];function a(){return window.location.origin.indexOf(r)>-1}t.a={isServiceDomain:a,serviceDomainTransform:function(n,t){return t&&(n&&"/"!==n&&0===n.indexOf("/")&&(n=n.substr(1)),n&&function(n){var t=n.indexOf("/");0===t&&(n=n.substr(t+1));var o=n.indexOf("?");return o>0&&(n=n.substr(0,o)),i.indexOf(n)>-1}(n)?t=function(n){var t=window.location.origin;return"/"!==n&&0===n.indexOf("/")&&(n=n.substr(1)),t.indexOf(".inside.")>-1?"http://"+e+".h5.inside.xiaoeknow.com/"+window.APPID+"/"+n:t.indexOf(".test.")>-1?"http://"+e+".h5.test.xiaoeknow.com/"+window.APPID+"/"+n:"https://"+e+".h5.xiaoeknow.com/"+window.APPID+"/"+n}(n):a()&&(t=function(n){if(n&&window&&window.APPID){var t="//"+window.APPID+".";n=n.replace(r,t)}return n}(t))),t}}},9:function(n,t){n.exports=require("n-zepto")}}).default;