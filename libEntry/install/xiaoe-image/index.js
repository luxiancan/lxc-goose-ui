import xiaoeImage from '@/components/xiaoeImage'

import LazyImage from '../../../src/components/xiaoeImage/lazyImage'

xiaoeImage.install = function (Vue, options = {}) {
  Vue.component(xiaoeImage.name, xiaoeImage);
  options.offset = parseInt(options.offset, 10) || 0;
  const lazyImg = new LazyImage(options);
  Vue.prototype.$lazyImages = lazyImg;
};
export default xiaoeImage