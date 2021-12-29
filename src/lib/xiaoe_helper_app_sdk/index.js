/**
 *
 * 小鹅助手APP相关方法统一封装（isXiaoEHelperApp为true时，才有效）
 *
 */

import { isXiaoEHelperApp } from '@/utils/judgeEnv';
import { progress, liveState, pageOffestY, packUpVideo } from "./listeners";
import {
    updateLiveNumber,
    updateLiveState,
    queryVideoPlayerState,
    showVideo,
    showCourseware,
    handleLive,
    manualStopLive,
    manualStartLive,
    goMainPage,
    shareCourse,
    openPage,
    openSharePopUp
} from "./handlers";
import { on } from "./publishToSubscribe";

// SDK加载完毕的标识
let isCompleted = false;
document.addEventListener('apiLoadCompleted', () => {
    isCompleted = true;
}, false);

const init = () => {
    // 只有小鹅APP才需要初始化
    if (!isXiaoEHelperApp()) {
        return;
    }
    // SDK加载完毕后，才能运行
    if (!isCompleted) {
        setTimeout(() => {
            init();
        }, 50);
        return;
    }
    console.log('=====> xiaoehelperAppSdk init ok');
    // JSSDK加载完毕之后，通知原生
    setTimeout(() => {
        window.wx.jsSDKReady && window.wx.jsSDKReady('');
        store.commit('RoomModule/setRoomState', {
            key: "xiaoehelperAppSdkReady",
            value: true
        });
    }, 200);
    // 开启监听
    listeners();
};

/**
 * @description 将页面背景改为白色
 */
const setBgColor = () => {
    if (!isXiaoEHelperApp()) {
        return;
    }
    document.documentElement.style.backgroundColor = 'white';
    document.body.style.backgroundColor = 'white';
}
setBgColor();

/**
 * @description 监听器
 */
const listeners = () => {
    const events = [
        progress,
        liveState,
        pageOffestY,
        packUpVideo
    ]
    events.forEach(fn => {
        let isFn = Object.prototype.toString.call(fn) === "[object Function]";
        isFn && fn();
    });
}

/**
 * @description 事件管理器
 * @param {String} event 需要调用的事件名
 * @param {Object|String} params 传参
 */
const handler = (event, params) => {
    if (!isXiaoEHelperApp()) {
        return;
    }
    const eventsMap = {
        updateLiveNumber,
        updateLiveState,
        queryVideoPlayerState,
        showVideo,
        showCourseware,
        handleLive,
        manualStopLive,
        manualStartLive,
        goMainPage,
        shareCourse,
        openPage,
        openSharePopUp
    }
    const fn = eventsMap[event];
    const isFn = Object.prototype.toString.call(fn) === "[object Function]";
    console.log(`=====> xiaoehelperAppSdk handler , event: ${event}, params: ${JSON.stringify(params)}`);
    if (isFn) {
        return fn(params);
    }
}

const xiaoEHelperAppSdk = {
    init,
    on,
    handler
};
export default xiaoEHelperAppSdk;