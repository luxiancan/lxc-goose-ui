import couponList from '@/components/couponList'

couponList.install = function (Vue) {
  Vue.component(couponList.name, couponList);
};

export default couponList
