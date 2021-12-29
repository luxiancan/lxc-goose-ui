import phoneCode from '@/components/phoneCode'

phoneCode.install = function (Vue) {
  Vue.component(phoneCode.name, phoneCode);
};

export default phoneCode