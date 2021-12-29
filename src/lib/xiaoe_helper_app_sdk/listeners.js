/**
 * 监听类方法。如何使用：
 *      该文件中：const abc = () => { emit('abc', "我是传过去的参数"); }
 *      业务侧这样调用监听方法：$xiaoEHelperAppSdk.on("abc", res => { console.log("res:", res); // res:我是传过去的参数 });
 */

import { emit } from "./publishToSubscribe";

// 监听播放时长(当前播放时长、播放总时长)
const progress = () => {
    window.wx.syncPlayerProgress && window.wx.syncPlayerProgress({
        success: res => {
            // res: { currentTime, duration }
            emit("progress", res);
        }
    });
};

// 原生将直播播放器状态通知到H5这边（比如断流）
const liveState = () => {
    window.wx.syncLiveState && window.wx.syncLiveState({
        success: res => {
            emit("liveState", res);
        }
    });
};

/*
 * 原生控制webview距离顶部的高度
 * webview 高度始终100%，用 marginTop 起到占位效果来放原生视频区，解决H5闪屏的问题
 */
const pageOffestY = () => {
    window.wx.syncH5offestY && window.wx.syncH5offestY({
        success: res => {
            // res: { offsetY, second }
            emit("pageOffestY", res);
        }
    });
};

/*
 * 原生通知H5，原生视频区域的收起/展开状态
 */
const packUpVideo = () => {
    window.wx.syncPackUpVideo && window.wx.syncPackUpVideo({
        success: res => {
            // res: { isPack: true/false } isPack：true-收起  false-展开
            emit("packUpVideo", res);
        }
    });
};

export {
    progress,
    liveState,
    pageOffestY,
    packUpVideo
}