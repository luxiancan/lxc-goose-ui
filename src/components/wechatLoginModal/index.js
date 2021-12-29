import Vue from "vue";
import Component from "./floatBox.vue";
const Constructor = Vue.extend(Component);

let instance;

const FloatBox = (options = {}) => {
  if (instance) return;
  const onCloseCb = options.onClose;
  const onConfirmCb = options.onConfirm;
  options.onConfirm = () => {
    instance = null;
    onConfirmCb && onConfirmCb();
  };
  options.onClose = () => {
    instance = null;
    onCloseCb && onCloseCb();
  };
  instance = new Constructor({
    data: options
  });
  instance.visible = true;
  instance.$mount();
  document.body.appendChild(instance.$el);
};

FloatBox.install = Vue =>
  Object.defineProperty(Vue.prototype, "$vxBox", {
    get() {
      return FloatBox;
    }
  });

export default FloatBox;
