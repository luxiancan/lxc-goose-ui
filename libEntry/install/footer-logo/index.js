import FooterLogo from '@/components/footer'

FooterLogo.install = function (Vue) {
  Vue.component(FooterLogo.name, FooterLogo);
  Vue.config.ignoredElements = ['wx-open-launch-weapp'];//注册wx-open-launch-weapp组件
};

export default FooterLogo
