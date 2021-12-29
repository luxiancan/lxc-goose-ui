import receiveAddress from '@/components/receiveAddress'

receiveAddress.install = function (Vue) {
  Vue.component(receiveAddress.name, receiveAddress);
};

export default receiveAddress
