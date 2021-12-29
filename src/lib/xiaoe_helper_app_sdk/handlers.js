/**
 * 操作类方法。如何使用：
 *      该文件中：const abc = params => { console.log(1); }
 *      业务侧这样调用操作方法：$xiaoEHelperAppSdk.handler("abc");
 */
import { isXiaoEHelperApp } from '@/utils/judgeEnv';

 /**
 * @description 直播间2.0 - 通知APP视频左上角显示的人次信息
 * @param {Object} params - 传参
 * @param {Number|String} params.live_num - 在线人次
 * @param {String} params.live_status - 直播状态显示文本
 */
const updateLiveNumber = params => {
    window.wx.updateLiveNumber && window.wx.updateLiveNumber(params);
};

/**
 * @description 直播间2.0 - 有播放权益之后，通知原生初始化播放器
 */
let updateLiveStateKey = false; // 防止重复调用
const updateLiveState = () => {
    if (!isXiaoEHelperApp() || updateLiveStateKey) {
        return;
    }
    updateLiveStateKey = true;
    window.wx.updateLiveState && window.wx.updateLiveState("");
};

/**
 * @description 查询原生播放器的播放状态
 * @returns {Promise} 播放器状态 0-查询失败 1-缓冲 2-播放 3-暂停 4-结束 5-失败
 */
const queryVideoPlayerState = () => {
    return new Promise((resolve) => {
        if (window.wx.queryVideoPlayerState) {
            window.wx.queryVideoPlayerState({
                success: function(res) {
                    let videoPlayerState = res.data.state;
                    resolve(+videoPlayerState);
                },
                fail: function(res) {
                    console.log(res);
                    resolve(0);
                },
            });
        } else {
            resolve(0);
        }
    })
}

/**
 * @description 是否展示原生播放器
 * @param {Boolean} isShow 
 */
const showVideo = isShow => {
    window.wx.showVideo && window.wx.showVideo({ isShow });
}

/**
 * @description 是否展示原生播放器（课件模式，播放器位于左上角小框）
 * @param {Boolean} isShow 
 */
const showCourseware = isShow => {
    window.wx.showCourseware && window.wx.showCourseware({ isShow });
}

/**
 * @description 控制原生播放器暂停/开始
 * @param {String} action - pause:暂停 resume:开始
 */
const handleLive = action => {
    wx.handleLive && wx.handleLive({ action });
}

/**
 * @description 通知原生APP，直播已经手动结束
 * @returns {Promise}
 */
const manualStopLive = () => {
    return new Promise((resolve, reject) => {
        if (wx.manualStopLive) {
            wx.manualStopLive({
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("manualStopLive not define");
        }
    })
}

/**
 * @description 通知原生APP，直播已开始
 * @returns {Promise}
 */
const manualStartLive = () => {
    return new Promise((resolve, reject) => {
        if (wx.manualStartLive) {
            wx.manualStartLive({
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("manualStartLive not define");
        }
    })
}

/**
 * @description 直播间 - 更多 - 店铺首页（原生生成分享弹框内容，分享店铺）
 * @returns {Promise}
 */
const goMainPage = () => {
    return new Promise((resolve, reject) => {
        if (wx.clickMainPage) {
            wx.clickMainPage({
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("clickMainPage not define");
        }
    });
}

/**
 * @description 分享课程（原生生成分享弹框内容，分享课程）
 * @param {Object} params - 传参
 * @param {String} params.target_url - 跳转链接，即生成的二维码地址
 * @param {String} params.img_url - 图片地址
 * @param {String|Number} params.price - 价格
 * @param {String|Number} params.line_price - 划线价格
 * @param {String} params.title - 课程标题
 * @param {String} params.app_id - 店铺id
 * @returns {Promise}
 */
const shareCourse = params => {
    return new Promise((resolve, reject) => {
        if (wx.shareCourse) {
            wx.shareCourse({
                ...params,
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("shareCourse not define");
        }
    });
}

/**
 * @description 打开原生APP新页面
 * @param {Object} params - 传参
 * @param {String} params.title - 页面标题
 * @param {String} params.url - 要打开的url
 * @returns {Promise}
 */
const openPage = params => {
    return new Promise((resolve, reject) => {
        if (wx.openPage) {
            wx.openPage({
                ...params,
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("openPage not define");
        }
    });
}

/**
 * @description 直播间2.0 - 打开分享弹窗
 */
const openSharePopUp = () => {
    if (!isXiaoEHelperApp()) {
        return;
    }
    return new Promise((resolve, reject) => {
        if (wx.openSharePopUp) {
            wx.openSharePopUp({
                success: function(res) {
                    resolve(res);
                },
                fail: function(error) {
                    reject(error);
                },
            });
        } else {
            reject("openSharePopUp not define");
        }
    });
};

export {
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