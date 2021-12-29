import { isXiaoEHelperApp } from '@/utils/judgeEnv';

// queue 内的格式： { eventName: [...eventCb] }
let queue = {};
/**
 * @param {String} eventName
 * @param {Function} callback
 */
const on = (eventName, callback) => {
    if (!isXiaoEHelperApp()) {
        return;
    }
    let isHasKey = Object.prototype.hasOwnProperty.call(queue, eventName);
    !isHasKey && (queue[eventName] = []);
    queue[eventName].push(callback);
};

const emit = (eventName, res) => {
    // progress 触发频率太高，log多了有点烦…
    eventName !== "progress" && console.log("=====> xiaoehelperAppSdk on", eventName, res);
    queue[eventName] && queue[eventName].forEach(fn => {
        fn(res);
    });
};

export {
    on,
    emit
}