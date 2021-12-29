import phoneInput from '@/components/phoneInput'

phoneInput.install = function (Vue) {
  Vue.component(phoneInput.name, phoneInput);
};

export default phoneInput