// 是否PC端
export function getIsPC() {
    return Boolean(!window.navigator.userAgent.toLowerCase().match(/micromessenger|xiaoeapp|weibo|xiaoehelperapp|android|iphone|ipad/));
}
// 是否Ipad
export function getIsIpad() {
    return Boolean(window.navigator.userAgent.toLowerCase().match(/ipad/));
}
// 是否为安卓设备
export function isAndroid() {
    return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1;
}
// 是否微信环境
export function getIsWx() {
    return Boolean(window.navigator.userAgent.toLowerCase().match(/micromessenger|windowswechat/));
}
// 是否小鹅通助手APP
export function isXiaoEHelperApp() {
    return window.navigator.userAgent.toLowerCase().indexOf('xiaoehelperapp') > -1;
}
// 是否是小鹅SDK
export function isXiaoESDK() {
    return window.navigator.userAgent.toLowerCase().indexOf('xiaoeapp') > -1;
}
// 是否为企业微信浏览器
export function isQywxBrowser() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') > -1 && ua.indexOf('wxwork') > -1;
}