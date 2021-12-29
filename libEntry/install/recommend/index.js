import recommend from '@/components/recommend'

recommend.install = function (Vue) {
  Vue.component(recommend.name, recommend);
};

export default recommend
