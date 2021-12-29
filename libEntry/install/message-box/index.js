import messageBox from '@/components/messageBox'
import $ from 'n-zepto'
import Vue from 'vue';

const MessageBoxConstructor = Vue.extend(messageBox);

messageBox.install = function (Vue) {
    Vue.component(messageBox.name, messageBox);
};

let instance, currentMsg = {};

const callback = (type) => {
    if (type === 'confirm') {
        if (currentMsg.resolve) {
            currentMsg.resolve();
        }
    } else {
        if (currentMsg.reject) {
            currentMsg.reject();
        }
    }
}

const initInstance = () => {
    // 实例化vue实例
    instance = new MessageBoxConstructor();
    document.body.appendChild(instance.$mount().$el);

    instance.callback = callback;
};

Vue.prototype.$alert = function (options) {
    if (!instance) {
        initInstance();
    }
    if (typeof options === 'string') {
        instance.content = options;
    } else if (typeof options === 'object') {
        $.extend(instance, options);
    }

    instance.show = true;
    return new Promise((resolve, reject) => {
        currentMsg.resolve = resolve;
        currentMsg.reject = reject;
    });
}

export default messageBox;
export {messageBox};