# goose 初始化组件文档
- **公共初始化SDK组件基于原有的各工程的`init_wechat.js`文件做的封装**。内部根据不同终端环境，初始化了各终端的功能API(如：微信环境下做了微信的初始化，小鹅通知识助手APP下做了小鹅通知识助手的初始化等);
- **该组件保留原有的全局变量**，业务侧可选择是否将一些变量(`APPID、USERID、USERIP、MACHINEIP、WXNICKNAME、WXAVATAR`)，进行了全局赋值并挂载在`window`上
- **目前初始化的终端包含微信端(`wechat`)、企业微信端(`wxwork`)、智慧校园、app的通用新版SDK、小鹅通知识助手app、QQ端(`qq`)**
- **==组件向外部抛出`init`方法==**
- **==引入该组件即将跳转函数(`eJump`)全局赋值并挂载在`window`上==**



## 各终端初始化的方法列表
| 终端类型 | 包含的初始化API | 处理的功能|
| :-----| :----: | :----: | 
| 微信端(wechat) | `config、error、ready、onMenuShareAppMessage、onMenuShareTimeline、onMenuShareQQ、onMenuShareWeibo、onMenuShareQZone、checkJsApi、downloadVoice、playVoice、stopRecord`  | 分享给朋友、分享到朋友圈、微博、QQ空间、音频锁屏播放(业务侧可通过参数决定是否初始化)|
| 企业微信端(wxwork) | `config、error、ready、onMenuShareAppMessage、onMenuShareTimeline、onMenuShareQQ、onMenuShareWeibo、onMenuShareQZone、checkJsApi、downloadVoice、playVoice、stopRecord`  | 分享给朋友、分享到朋友圈、微博、QQ空间、音频锁屏播放(业务侧可通过参数决定是否初始化)|
| app通用新版SDK(xiaoeapp)| init  |初始化分享信息|
| 小鹅通知识助手app | init  |初始化分享信息|
|智慧校园| 初始化API的功能由业务侧决定|业务侧传入回调函数(`smartCampusCallBack`)即可|
| QQ端(qq) | `data.setShareInfo ...其余参考文档 https://open.mobile.qq.com/api/mqq/index` | QQ分享给QQ好友、分享到QQ空间、微信、朋友圈 |


## `init`方法组件参数列表
- ==**组件以解构的方式取参数，请业务方调用时，保证传入参数的名称与给出的参数名称一致！！！**==


| 参数名称 | 类型 | 说明|
| :-----| :----: | :----: | 
| initData | Object |必传；初始化必要的相关配置信息,包含`jsApiList、signature、beta`等初始化的基本信息(业务方从特定接口获取) |
| sdkInfo | Object |必传；公共sdk终端变量信息,从公共的SDK库`@xiaoe/xiaoe-common-jssdk`中获取 |
| initGlobalVar | Boolean |默认`true`。是否初始化`APPID、USERID`等全局变量,若不想初始化，传入`false` 即可 |
| loadVoice | Boolean |默认`false`。是否锁屏播放,若要锁屏播放，传入`true` 即可 |
| smartCampusCallBack | Function |默认`null`。环境为`智慧校园`时，业务方需要处理的初始化智慧校园SDK API的功能的回调函数，传入则执行 |
| wxReadyCallBack | Function |默认`null`。调用`wx.ready`API时，业务方需要处理初始化前的回调函数，传入则执行 |
| wxErrorCallBack | Function |默认`null`。调用`wx.Error(初始化失败)`API时，业务方需要处理的初始化失败的回调函数，传入则执行 |

## 组件使用方式
```
// 应用到原init_wechat.js初始化文件中
// 简单调用,业务侧无初始化前置事件`wxReadyCallBack`、无初始化失败回调事件`wxErrorCallBack`,无智慧校园环境下初始化逻辑`smartCampusCallBack`
// 无需锁屏播放`loadVoice === false`、默认`initGlobalVar === true`,初始化`APPID、USERID`等全局变量

import {initSdk} from '@xiaoe/goose';
import sdkInfo from '@xiaoe/xiaoe-common-jssdk';

// 拿到组件的初始化的方法
exports.init = (initData)=>{
    // initSdk.init 此处的参数传入为解构，请注意字段保持一致
    return initSdk.init({initData,sdkInfo});
  };
```


```
// 包含smartCampusCallBack、wxReadyCallBack、wxErrorCallBack的调用方式

import {initSdk} from '@xiaoe/goose';
import sdkInfo from '@xiaoe/xiaoe-common-jssdk';
// 企业通讯录
import agentConfig from '~publicAsset/libs/agentConfig.js';

// 智慧校园初始化
const smartCampusCallBack = (initData)=>{
    wx.setParams && wx.setParams({
        appid: initData.appid,
        corpid: initData.corpid
    });

    wx.init && wx.init(function(err) {
        if (err) {console.error('初始化失败', err); }
        else {
            console.log('智慧校园初始化成功');
        }
    });  
};

// 初始化前置事件，wx.ready时的回调函数
const wxReadyCallBack = ()=>{
    // 企业通讯录初始化
    agentConfig.init();
};

// 初始化报错wx.Error(初始化失败)时的回调函数
const wxErrorCallBack = (res,confs)=>{
    // doSomething
};


// 拿到组件的初始化的方法
exports.init = (initData)=>{
    // loadVoice === true 锁屏播放
    let loadVoice = true;
    // initSdk.init 此处的参数传入为解构，请注意字段保持一致
    return initSdk.init({initData,sdkInfo,loadVoice,smartCampusCallBack,wxReadyCallBack,wxErrorCallBack});
  };
```