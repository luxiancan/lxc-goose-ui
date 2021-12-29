import Day from "dayjs";

function isObject(target) {
  return Object.prototype.toString.call(target) === "[object Object]";
}

/* eslint-disable */
export { isObject };

/**
 * 补零
 * @param {Number} num 需要补零的数字
 * @param {Number} n
 */
export function prefixZero(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

/**
 * 倒计时
 * @param {String} 结束时间
 */
export function countdown(endTime, cb) {
  const endDate = Day(endTime);
  if (endDate.diff(Day()) > 0) {
    let dd = endDate.diff(Day(), "day");
    let hh = endDate.diff(Day(), "hour");
    let mm = endDate.diff(Day(), "minute");
    let ss = endDate.diff(Day(), "second");
    let size = Math.max(String(dd).length,2)
    cb(
      null,
      {
        dd: prefixZero(dd, size),
        hh: prefixZero(hh, 2),
        mm: prefixZero(mm, 2),
        ss: prefixZero(ss, 2)
      },
      false
    );
    const handle = setInterval(() => {
      let dd = endDate.diff(Day(), "day");
      let hh = endDate.diff(Day(), "hour");
      let mm = endDate.diff(Day(), "minute");
      let ss = endDate.diff(Day(), "second");

      ss = ss - mm * 60;
      mm = mm - hh * 60;
      hh = hh - dd * 24;
      const end = endDate.diff(Day()) <= 0;
      cb(
        handle,
        {
          dd: prefixZero(dd, size),
          hh: prefixZero(hh, 2),
          mm: prefixZero(mm, 2),
          ss: prefixZero(ss, 2)
        },
        end
      );
    }, 1000);
  } else {
    cb(null, {}, true);
  }
}

/**
 * 格式化数值
 * @param {数值} num
 * @param {保留位数} digit
 */
export function toFixed(num, digit) {
  const str = num.toString();
  if (str.includes(".")) {
    return num.toFixed(digit);
  } else {
    return num;
  }
}

/**
 * 分转为元
 * @param {Number} price 价格
 */
export function formatPrice(price) {
  if (typeof price === "number") {
    price = price / 100;
    return toFixed(price, 2);
  }
  return price;
}

/**
 * time1是否是在time2之前
 * @param {时间} time1
 * @param {时间} time2
 */
export function isBefore(time1, time2) {
  return Day(time1).isBefore(time2);
}
