import { checkView, throttle, debounce } from './utils';


const DEFAULT_EVENTS_LIST = ['scroll'];

class LazyImage {
  constructor($options = {}) {
    this.init($options);
  }

  init(options = {}) {
    this.images = [];      
    this.options = options;
    this.eventsList = options.eventsList || DEFAULT_EVENTS_LIST;
  }

  /**
   * addImage 添加图片
   * @param {*} el 添加元素
   */
  addImage(el, isLazy = true, evenEl) {
    if (!el.tagName || el.tagName.toLowerCase() !== 'img') {
      return; 
    }
    const image = {
      el,
      isLazy
    };
    this.images.push(image);
    this.initListener(evenEl);
  }

  initListener(evenEl) {
    let loadFn;
    if (this.options.throttle) {
      loadFn = throttle(this.loadImage, this.options.throttle);
    } else if (this.options.debounce) {
      loadFn = debounce(this.loadImage, this.options.debounce);
    } else {
      loadFn = this.loadImage
    }
    this.eventsList.forEach((event) => {
      if (evenEl) {
        document.getElementById(evenEl).addEventListener(event, loadFn.bind(this));
      } else {
        window.addEventListener(event, loadFn.bind(this));
      }
    })
  }

  /**
 * loadImage 加载图片
 */
  loadImage() {
    const images = this.images;
    for (let i = 0; i < images.length; i++) {
      const el = images[i].el;
      // 确定是否能加载图片
      if (checkView(el, this.options.offset) || !images[i].isLazy) {
        const src = el.dataset.src;
        if (!src) {
          console.error(`${el} has no attribute 'data-src'!`);
        }
        el.src = el.dataset.src;
        // el.dataset.isload = true;
        el.onload = function () {
          this.style.opacity = '1.0';
          this.onload = null;
        };
        images.splice(i--, 1);
      }
    }
  }

  /**
   * 
   * removeImage 手动移除该图片数组里的某个元素
   */
  removeImage(el) {
    const index = this.images.findIndex(item => item.el === el);
    this.images.splice(index, 1);
  }
}

export default LazyImage;