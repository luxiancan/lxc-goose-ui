// 进行dom操作
function hasClass(el, cls) {
  if (!el || !cls) {
    return false;
  }
  if (cls.indexOf(' ') !== -1) {
    throw new Error('类名不应包含空格');
  }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (el.className).indexOf(cls) > -1;
  }
}

function addClass(el, cls) {
  if (!el) {
    return;
  }
  let curClass = el.className;
  const classes = (cls || '').split(' ');
  const length = classes.length;

  for (let i = 0; i < length; i++) {
    const clsName = classes[i];
    if (clsName) {
      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += ` ${clsName}`;
      }
    }
  }

  if (!el.classList) {
    el.className = curClass;
  }
}

function removeClass(el, cls) {
  if (!el || !cls) {
    return;
  }

  const classes = cls.split(' ');
  const length = classes.length;

  for (let i = 0; i < length; i++) {
    const clsName = classes[i];
    if (clsName) {
      if (el.classList) {
        el.classList.remove(clsName);
      }
    }
  }

  if (!el.classList) {
    el.className = '';
  }
}

const on = (function () {
  return function (el, event, handle) {
    if (el && event && handle) {
      el.addEventListener(event, handle, false);
    }
  }
}())

const off = (function () {
  return function (el, event, handle) {
    if (el && event && handle) {
      el.removeEventListener(event, handle, el);
    }
  }
}())

export {
  hasClass,
  addClass,
  removeClass,
  on,
  off
}
