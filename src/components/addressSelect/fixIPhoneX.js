// 判断是否IPhoneX
const isIPhoneX = () => {
    let flag = false;
    if (navigator.userAgent.indexOf('iPhone') !== -1) {
        flag = window.screen.height === 812 || window.screen.height === 896;
    }
    return flag;
};

// 判断微信底部导航条是否出现
const isWxBottomNavShow = () => {
    const windowInnerHeight = window.innerHeight;
    return windowInnerHeight === 641 || windowInnerHeight === 725;
};

// 缓存元素与样式
const elements = [];

// 导航条消失和出现时
window.onresize = () => {
    const isWxNavShow = isWxBottomNavShow();
    if (!isWxNavShow) {
        elements.forEach(item => {
            Object.keys(item.style).forEach(key => {
                item.el.style[key] = item.style[key];
            });
        });
    } else {
        elements.forEach(item => {
            Object.keys(item.style).forEach(key => {
                item.el.style[key] = null;
            });
        });
    }
};

export default {
    bind(el, binding) {
        if (isIPhoneX()) {
            let style = binding.value || {};
            elements.push({
                el,
                style
            });
            if (!isWxBottomNavShow()) {
                Object.keys(style).forEach(key => {
                    el.style[key] = style[key];
                });
            }
        }
    }
};
