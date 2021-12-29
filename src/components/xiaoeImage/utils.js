/**
 *  checkView 检查此图片是否可处于加载窗口内
 */
const checkView = function (el, offset = 0) {
  let clientHeight; let 
    clientWidth;
  let top; let left; let right; let bottom; let 
    rect;
  let showLoad;
  clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  rect = el.getBoundingClientRect();
  top = rect.top - offset;
  left = rect.left - offset;
  bottom = rect.bottom + offset;
  right = rect.right + offset;
  showLoad = top < clientHeight && bottom > 0 && left < clientWidth && right > 0
  return showLoad;
}
/**
 * 
 * @param  fn 
 * @param  interval 
 * @return 返回
 * 节流： 只允许一个函数在N秒内执行一次
 */
const throttle = function (fun, interval) {
  let startTime = new Date(); let 
    timeout;
  if (!interval || interval <= 0) {
    return fun; 
  }
  return function () {
    const curTime = new Date();
    clearTimeout(timeout);
    if (curTime - startTime >= interval) {
      fun.apply(this, arguments);
      startTime = curTime;
    } else {
      timeout = setTimeout(fun.bind(this, ...arguments), interval - (curTime - startTime));
    }
  }
}
/**
 * 防抖
 * @param  fun
 * @param  wait 
 */
const debounce = function (fun, wait) {
  let timeout;
  if (!wait || wait <= 0) {
    return fun; 
  }
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fun.bind(this, ...arguments), wait);
  }
}

export {
  checkView,
  throttle,
  debounce
}

