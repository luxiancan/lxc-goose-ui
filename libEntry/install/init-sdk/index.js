import ownEventBus from '@/lib/eventbus.js';
import GlobalInit from '@/lib/init_global.js';
import eJump from '@/lib/eJump.js';
import weixinJsSdk from 'weixin-js-sdk';

let initCount = 0; // 记录初始化次数
//分享成功事件,从事件发送出去
const onShareSucceed = (EventBus,res, type) =>{
    EventBus.$emit("onShareSucceed", {
        "res": res,
        "type": type
    }); 
}

// 分享取消事件
const onShareCanceled = (EventBus,res, type) =>{
    EventBus.$emit("onShareCanceled", {
        "res": res,
        "type": type
    }); 
}

// 分享失败事件
const onShareFailed = (EventBus,res, type) =>{
    EventBus.$emit("onShareFailed", {
        "res": res,
        "type": type
    }); 
}
/**
 *  分享描述字段得表情符替换
 * @param {string} str 
 */
const escape2Html = (str)=> {
    let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

/** 初始化sdk，前提是当前环境已经引入sdk
 * sdk 是每个环境下异步加载对应环境的js，给与一定的缓冲时间，初始化方法
 * @param {Object} initData 初始化的数据参数
 * @param {Object} sdkInfo  公共sdk终端变量信息
 * @param {Boolean} initGlobalVar  是否初始化APPID、USERID等全局变量，默认true
 * @param {Boolean} loadVoice  是否锁屏播放，默认false
 * @param {Function} wxReadyCallBack  wx.ready时，业务方需要做的事情
 * @param {Function} wxErrorCallBack  wx.Error(初始化失败)时，业务方需要做的事情
 * @param {Function} smartCampusCallBack  环境为智慧校园时，业务方需要做的事情
 * @param {object} EventBus 业务方的回调事件
 */
const initSdkInfo = ({
    selfConf,
    initData,sdkInfo = {CLIENT_ENV:null},
    initGlobalVar = true, 
    loadVoice = false,
    smartCampusCallBack,
    wxReadyCallBack,
    wxErrorCallBack,
    EventBus = ownEventBus}) => {
        console.log('init begin', initData);
        console.time('init time');
        if ( initData.hasOwnProperty('wxData') && window.wx ) {
            let wxInfo =  initData.wxData;
            if( sdkInfo.CLIENT_ENV === 'smartCampus' ) { 
                initSdkApi(()=>{
                    if( typeof smartCampusCallBack === 'function' && wx.init){
                        smartCampusCallBack();
                    }
            }) 
            }else if( sdkInfo.CLIENT_ENV === 'wechat'|| sdkInfo.CLIENT_ENV === 'wxwork'  || sdkInfo.CLIENT_ENV === 'wx_miniProgram'){    
                initSdkApi(()=>{
                    if( wx.config ){
                        // 这里重新引用weixin-js-sdk，保证后面wx.config方法执行时，可以正常挂在官方接口invoke和on方法
                        if (weixinJsSdk) {
                            window.wx = weixinJsSdk;
                            Object.assign(window.wx, sdkInfo);
                        }

                        initWeChat({selfConf, wxInfo,loadVoice,wxReadyCallBack,wxErrorCallBack,EventBus});
                    }               
                })   
                if( sdkInfo.CLIENT_ENV === 'wx_miniProgram' ){
                    let shareConfig = {
                        title:wxInfo.share_title || document.title,
                        imageUrl:wxInfo.share_img_url || '',
                        share_link: wxInfo.share_link || location.href
                    };
                    wx.miniProgram && wx.miniProgram.postMessage({ data: {shareConfig} })
                }

            }else if( sdkInfo.CLIENT_ENV === 'xiaoeapp' || sdkInfo.CLIENT_ENV === 'xiaoehelperapp'){
                // 通用 h5 新版sdk app及小鹅通知识助手
                let shareInfo = {
                    share_title:wxInfo.share_title || document.title,
                    share_image:wxInfo.share_img_url || '',
                    share_content:wxInfo.share_desc || '',
                    share_link:wxInfo.url || location.href
                };
                initSdkApi(()=>{
                    if(window.wx && wx.init){
                        window.wx.init(shareInfo,{fail:function(res){
                            console.error(res)
                        }});
                    }
                })      
            } else if ( sdkInfo.CLIENT_ENV === 'qq' ){
                // QQ 终端
                let options = {
                    title: wxInfo.share_title || document.title,
                    summary: wxInfo.share_desc || ' ',
                    pic: wxInfo.share_img_url || '',
                    url: wxInfo.share_link || location.href,
                    callback: wxInfo.callback,
                    swapTitle: wxInfo.swapTitle,
                };
                console.log('=== qq终端 options=== ', options);
                initSdkApi(() => {
                    initQQ(options);
                })
            }

        }

        if ( initGlobalVar && initData.hasOwnProperty('commonData') ) {
            if ( initData.bizData && initData.bizData.data && initData.bizData.data.alive_info ) {
                GlobalInit.init(initData.commonData,false);      
            } else {
                GlobalInit.init(initData.commonData);
            }
        }
};

/**
 * 等待公共SDK组件异步加载SDK后初始化
 */
const initSdkApi = (callBack,time = 500)=>{
    // document && document.addEventListener("apiLoadCompleted",callBack);
    setTimeout(()=>{
        if(wx && wx.apiLoadCompleted ){
            callBack();
            console.log('apiLoadCompleted sdkApi is completed',initCount);
        }else{           
           if(initCount < 4){
             initSdkApi(callBack);
           }else{
             callBack();
           }   
           console.log('initCount uncompleted',initCount);        
        } 
        initCount++;      
    },time)
    
}

/**
 * urlParse 解析url参数
 * @param {String} url 页面链接
 * return： Object {id:12345,a:b}
 */
const urlParse = (url) => {
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
}

/**
 * 处理二次分享entry和entryType重复问题
 * @param {String} shareLink 分享链接
 * @param {String} entryType  分享路径类型
 */
const replaceEntry = (shareLink,entryType) => {
    let reg = /(?![?&])(entry_type)=\w+/gi;
    let link = shareLink.replace(reg, `entry_type=${entryType}`);
    return link;
}

/**
 * 微信初始化方法
 * @param {object} configs 微信初始化相关配置信息
 * @param {Boolean} loadVoice  是否锁屏播放，默认false
 * @param {Function} wxReadyCallBack  wx.ready时，业务方需要做的事情
 * @param {Function} wxErrorCallBack  wx.Error(初始化失败)时，业务方需要做的事情
 * @param {object} EventBus 业务方的回调事件
 */
const initWeChat = ({selfConf,wxInfo:configs,loadVoice,wxReadyCallBack,wxErrorCallBack,EventBus}) => {
    let apiList=configs.jsApiList
    if (typeof apiList!=='string') {
      apiList=JSON.stringify(apiList)
    }
    apiList = JSON.parse(apiList.replace(/'/g, "\""));
    // 隐藏分享按钮的方法名
    apiList && apiList.push('hideOptionMenu');
      
    configs.debug = false;
    if( !!configs.share_desc ){
        configs.share_desc = escape2Html(configs.share_desc);
    }

    let confs = {
        "debug": configs.debug,
        "beta": configs.beta,
        "appId": configs.appId,
        "nonceStr": configs.nonceStr,
        "timestamp": configs.timestamp,
        "url": configs.url,
        "signature": configs.signature,
        "jsApiList": apiList
    };
    console.log('selfConf@@@@@@@@@@@@@@@@@@@--->',selfConf)
    if (selfConf) {
        confs = Object.assign(confs, selfConf)        
        console.log('confs@@@@@@@@@@@@@@@@@@@--->',confs)
    }
    wx.config(confs);
    console.timeEnd('init time');
    wx.error((res) => {
        try {
            if( typeof wxErrorCallBack === 'function' ){
                wxErrorCallBack(res,confs);
            }
        } catch (error) {
            console.error(error)
        }
        console.log('微信初始化失败',res);
    });
    window.isWxReady = false;
    wx.ready(() => {       
        // 业务方需要做的事情，比如企业微信SDK初始化
        try {
            if( typeof wxReadyCallBack === 'function' ){
                wxReadyCallBack();
            }
        } catch (error) {
            console.error(error)
        }
        window.isWxReady = true;
        if (configs.need_share) {
            console.log('init ok');
            let onMenuShareAppMessageUrl = configs.share_link;
            let onMenuShareTimelineUrl = configs.share_link;
            let onMenuShareQQUrl = configs.share_link;
            let onMenuShareWeiboUrl = configs.share_link;
            let onMenuShareQZoneUrl = configs.share_link; 

            if (configs && configs.share_link && configs.share_link.indexOf("?") > -1) {
                try {
                    let urlParams = urlParse(configs.share_link);
                    if(urlParams.hasOwnProperty('entry') || urlParams.hasOwnProperty('entry_type')) {
                        onMenuShareAppMessageUrl = replaceEntry(configs.share_link, '2001');
                        onMenuShareTimelineUrl = replaceEntry(configs.share_link, '2002');
                        onMenuShareQQUrl = replaceEntry(configs.share_link, '2003');
                        onMenuShareWeiboUrl = replaceEntry(configs.share_link, '2004');
                        onMenuShareQZoneUrl = replaceEntry(configs.share_link, '2005');
                    } else {
                        onMenuShareAppMessageUrl += '&entry=2&entry_type=2001';
                        onMenuShareTimelineUrl += '&entry=2&entry_type=2002';
                        onMenuShareQQUrl += '&entry=2&entry_type=2003';
                        onMenuShareWeiboUrl += '&entry=2&entry_type=2004';
                        onMenuShareQZoneUrl += '&entry=2&entry_type=2005';
                    }
                }  catch (error) {
                    onMenuShareAppMessageUrl += '&entry=2&entry_type=2001';
                    onMenuShareTimelineUrl += '&entry=2&entry_type=2002';
                    onMenuShareQQUrl += '&entry=2&entry_type=2003';
                    onMenuShareWeiboUrl += '&entry=2&entry_type=2004';
                    onMenuShareQZoneUrl += '&entry=2&entry_type=2005';
                }
            } else {
                onMenuShareAppMessageUrl += '?entry=2&entry_type=2001';
                onMenuShareTimelineUrl += '?entry=2&entry_type=2002';
                onMenuShareQQUrl += '?entry=2&entry_type=2003';
                onMenuShareWeiboUrl += '?entry=2&entry_type=2004';
                onMenuShareQZoneUrl += '?entry=2&entry_type=2005';
            }

            wx.onMenuShareAppMessage({
                title: configs.share_title,
                desc: configs.share_desc,
                link: onMenuShareAppMessageUrl,
                imgUrl: configs.share_img_url,
                trigger: () => {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //                alert('用户点击发送给朋友');
                },
                success: (res) => {
                    onShareSucceed(EventBus,res, 'onMenuShareAppMessage');
                },
                cancel: (res) => {
                    onShareCanceled(EventBus,res, 'onMenuShareAppMessage');
                },
                fail: (res) => {
                    onShareFailed(EventBus,res, 'onMenuShareAppMessage');
                }
            });

            wx.onMenuShareTimeline({
                title: configs.shareTimeTitle || configs.share_title, // 产品说分享朋友圈的主题不一样，这里异化处理下
                desc: configs.share_desc,
                link: onMenuShareTimelineUrl,
                imgUrl: configs.share_img_url,
                success: (res) => {
                    onShareSucceed(EventBus,res, 'onMenuShareTimeline');
                },
                cancel: (res) => {
                    onShareCanceled(EventBus,res, 'onMenuShareTimeline');
                }
            });

            wx.onMenuShareQQ({
                title: configs.share_title,
                desc: configs.share_desc,
                link: onMenuShareQQUrl,
                imgUrl: configs.share_img_url,
                success: (res) => {
                    onShareSucceed(EventBus,res, 'onMenuShareQQ');
                },
                cancel: (res) => {
                    onShareCanceled(EventBus,res, 'onMenuShareQQ');
                }
            });

            wx.onMenuShareWeibo({
                title: configs.share_title,
                desc: configs.share_desc,
                link: onMenuShareWeiboUrl,
                imgUrl: configs.share_img_url,
                success: (res) => {
                    onShareSucceed(EventBus,res, 'onMenuShareWeibo');
                },
                cancel: (res) => {
                    onShareCanceled(EventBus,res, 'onMenuShareWeibo');
                }
            });

            wx.onMenuShareQZone({
                title: configs.share_title,
                desc: configs.share_desc,
                link: onMenuShareQZoneUrl,
                imgUrl: configs.share_img_url,
                success: (res) => {
                    onShareSucceed(EventBus,res, 'onMenuShareQZone');
                },
                cancel: (res) => {
                    onShareCanceled(EventBus,res, 'onMenuShareQZone');
                }
            });
        } else {
            console.log('隐藏菜单');
            wx.hideOptionMenu();
        }

        /**
         * 锁屏播放
         */
        if (configs.voiceId && loadVoice) {
            let userAgent = navigator.userAgent;
            //            iPhone启用下载
            if ((userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iphone') > -1) && window.location.href.indexOf("homepage") > -1) { //苹果手机
                if (localStorage) {
                    let nbpTime = localStorage.getItem("nbpTime");
                    let nowTime = new Date().getTime();
                    if (nbpTime && !isNaN(parseInt(nbpTime)) && (nowTime - parseInt(nbpTime) < 300000)) {
                        $wxStopRecord();
                    } else {
                        $wxDownLoadRecord(configs);
                    }
                } else {
                    $wxDownLoadRecord(configs);
                }
            } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iphone') > -1) {
                $wxStopRecord();
            }
        }
    });
}

/**
 * QQ 初始化方法。目前只有 QQ 自定义分享功能
 * https://open.mobile.qq.com/api/component/share
 * @param {String} title  分享标题
 * @param {String} summary  分享内容
 * @param {String} pic  [可选] 分享图片
 * @param {String} url  [可选] 分享链接
 * @param {Function} callback  [可选] 回调
 * @param {Boolean} swapTitle  [可选] 是否标题内容互换
 */
const initQQ = (data) => {
    let info = { title: data.title, desc: data.summary, share_url: data.url, image_url: data.pic };
    function doQQShare() {
        try {
            if (data.callback) {
                window.mqq.ui.setOnShareHandler(function(type) {
                    if (type == 3 && (data.swapTitle || data.WXconfig && data.WXconfig.swapTitleInWX)) {
                        info.title = data.summary;
                    } else {
                        info.title = data.title;
                    }
                    info.share_type = type;
                    info.back = true;
                    window.mqq.ui.shareMessage(info, function(result) {
                        if (result.retCode === 0) {
                            data.callback && data.callback.call(this, result);
                        }
                    });
                });
            } else {
                window.mqq.data.setShareInfo(info);
            }
        } catch (e) {}
    }
    if (window.mqq) {
        doQQShare();
    } else {
        console.log('window.mqq is not defined');
    }
}

const $wxDownLoadRecord = (configs)=> {
    wx.checkJsApi({
        jsApiList: ['downloadVoice'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: ()=> {
            wx.downloadVoice({
                serverId: configs.voiceId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: (res) =>{
                    let localId = res.localId; // 返回音频的本地ID
                    wx.playVoice({
                        localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
                    });
                    let nowTime = new Date().getTime();
                    localStorage.setItem("nbpTime", nowTime);
                }
            });
        }
    });
}

const $wxStopRecord = ()=> {
   wx.stopRecord();
}
    
// 初始化eJump,不等接口是否调用
window.eJump = eJump.jump;

export default {
    init:initSdkInfo
};