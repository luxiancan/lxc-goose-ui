import Button from '../../../src/components/button/index.vue'

Button.install = function (Vue) {
  Vue.component(Button.name, Button);
};

export default Button
