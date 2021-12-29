<template>
  <div
    class="xiaoe-image__box"
    @click="handleClick"
  >
    <img
      v-if="!isLoadError"
      ref="target"
      :data-src="realSrc"
      class="xiaoe-image lazyImg"
      :style="initStyle"
      :alt="alt"
      :draggable="draggable"
      @load="onload"
      @error="error"
      :class="imageClass"
    >
    <transition name="error">
      <div
        v-if="isLoadError && showError && !isLoading"
        class="xiaoe-image__error"
      >
        <svg
          v-if="!errorIcon"
          t="1593682301812"
          class="icon xiaoe-image__error__icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2413"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="200"
          height="200"
        ><defs /><path
          d="M959.256366 512C959.256366 264.98713 759.01287 64.743634 512 64.743634 264.98713 64.743634 64.743634 264.98713 64.743634 512 64.743634 759.01287 264.98713 959.256366 512 959.256366 759.01287 959.256366 959.256366 759.01287 959.256366 512L959.256366 512 959.256366 512 959.256366 512 959.256366 512 959.256366 512ZM117.36203 512C117.36203 294.047467 294.047467 117.36203 512 117.36203 729.952533 117.36203 906.63797 294.047467 906.63797 512 906.63797 729.952533 729.952533 906.63797 512 906.63797 294.047467 906.63797 117.36203 729.952533 117.36203 512L117.36203 512 117.36203 512 117.36203 512 117.36203 512 117.36203 512Z"
          p-id="2414"
          fill="#969799"
        /><path
          d="M484.457558 599.560299C484.457558 622.580963 495.008537 634.091122 516.110812 634.091122 537.213087 634.091122 547.764066 622.580963 547.764066 599.560299L547.764066 280.150193C547.764066 257.129529 537.213087 245.61937 516.110812 245.61937 495.008537 245.61937 484.457558 257.129529 484.457558 280.150193L484.457558 599.560299ZM478.702421 740.561158C480.62081 763.581821 493.090149 775.091981 516.110812 775.091981 539.131476 775.091981 551.600815 763.581821 553.519203 740.561158 551.600815 717.540494 539.131476 705.071155 516.110812 703.152767 493.090149 705.071155 480.62081 717.540494 478.702421 740.561158L478.702421 740.561158Z"
          p-id="2415"
          fill="#969799"
        /></svg>
        <img
          v-if="errorIcon && errorIconType === 'img'"
          :src="errorIcon"
          alt=""
          class="xiaoe-image__error__icon"
        >
        <i
          v-if="errorIcon && errorIconType === 'icon'"
          class="xiaoe-image__error__icon"
          :class="errorIcon"
        />
        <span
          v-if="errorText"
          class="xiaoe-error__text"
        >{{ errorText }}</span>
      </div>
    </transition>
    <transition name="loading">
      <div
        v-if="showLoading && isLoading"
        class="xiaoe-image__load"
      >
        <svg
          t="1593747473424"
          class="icon xiaoe-image__load__icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1643"
          data-spm-anchor-id="a313x.7781069.0.i8"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="200"
          height="200"
        ><defs /><path
          d="M904 176v672H120V176h784m0-56H120c-30.9 0-56 25.1-56 56v672c0 30.9 25.1 56 56 56h784c30.9 0 56-25.1 56-56V176c0-30.9-25.1-56-56-56z"
          p-id="1644"
          fill="#969799"
        /><path
          d="M204 708c-5.4 0-10.8-1.5-15.5-4.7-12.9-8.6-16.4-26-7.8-38.8l180.1-270.2c15.1-22.6 40.3-36.6 67.5-37.4 27.2-2.5 53.2 11.8 69.6 33.6l93.7 125c14-21.1 36.6-34.7 62.3-37.1 29.4-2.5 57.2 9.8 74.8 33.2l113.7 151.6c9.2 12.4 6.7 29.9-5.6 39.2-12.3 9.3-29.9 6.7-39.2-5.6L683.9 545.2c-8.4-11.3-20.2-11.4-24.9-11-4.6 0.4-16.2 2.8-22.5 15.4l-15.5 31c-4.3 8.7-12.9 14.5-22.5 15.4-9.7 0.5-19.1-3.3-24.9-11.1L453 424.1c-5.5-7.4-14.4-11.4-23.2-11.2-9.2 0.3-17.4 4.8-22.5 12.5l-180 270.1C221.9 703.6 213 708 204 708zM792 288c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56-25.1-56-56-56z"
          p-id="1645"
          fill="#969799"
        /></svg>
        <img
          v-if="loadIcon && loadIconType === 'img'"
          :src="loadIcon"
          alt=""
          class="xiaoe-image__load__icon"
        >
        <i
          v-if="loadIcon && loadIconType === 'icon'"
          class="xiaoe-image__load__icon"
          :class="loadIcon"
        />
        <span
          v-if="loadText"
          class="xiaoe-load__text"
        >{{ loadText }}</span>
      </div>
    </transition>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'xiaoeImage',
  props: {
    src: String,
    fit: String,
    alt: String,
    round: Boolean,
    width: [Number, String],
    height: [Number, String],
    radius: [Number, String],
    showCompress: Boolean,
    draggable: Boolean,
    lazyLoad: {
      type: Boolean,
      default: true
    },
    format: {
      validator(value) {
        const formatType = ['', 'jpg', 'bmp', 'gif', 'png', 'webp'];
        return formatType.indexOf(value) > -1
      },
      default: '',
    },
    compress: {
      validator(value) {
        return value >= 0 && value <= 100
      },
      default: 100
    },
    compressWidth: {
      validator(value) {
        const res = /^[0-9]+.?[0-9]*$/;
        return res.test(value)
      },
      default: null
    },
    compressHeight: {
      validator(value) {
        const reg = /^[0-9]+.?[0-9]*$/;
        return reg.test(value)
      },
      default: null
    },
    compressType: {
      validator(value) {
        const intReg = /^[1-5]+$/;
        return intReg.test(value)
      },
      default: 1
    },
    showError: {
      type: Boolean,
      default: true,
    },
    showLoading: {
      type: Boolean,
      default: true,
    },
    errorIcon: {
      type: String,
      default: '',
    },
    errorIconType: {
      type: String,
      validator(t) {
        return t === 'img' || t === 'icon'
      },
      default: 'img',
    },
    loadIconType: {
      type: String,
      validator(t) {
        return t === 'img' || t === 'icon'
      },
      default: 'img',
    },
    errorText: {
      type: String,
      default: '加载错误',
    },
    loadText: {
      type: String,
      default: '加载中',
    },
    loadIcon: {
      type: String,
      default: '',
    },
    eventElement: {
      type: String,
      default: ''
    },
    imageClass: {
      type: [Array, String, Object],
      default: ''
    }
  },
  data() {
    return {
      isLoadError: false,
      isLoading: true,
    }
  },
  computed: {
    initStyle() {
      const reg = /^[0-9]+.?[0-9]*$/;
      const imageWidth = reg.test(this.width) && String(this.width).indexOf('%') < 0 ? `${this.width}px` : this.width;
      const imageHeight = reg.test(this.height) && String(this.height).indexOf('%') < 0 ? `${this.height}px` : this.height;
      let borderRadius = reg.test(this.radius) && String(this.radius).indexOf('%') < 0 ? `${this.radius}px` : this.radius;
      if (this.round) {
        borderRadius = '50%';
      }
      return {
        width: imageWidth,
        height: imageHeight,
        borderRadius,
        objectFit: this.fit
      }
    },
    realSrc() {
      // 腾讯云图片才会支持去压缩裁剪
      if (this.src.indexOf('myqcloud') > 0 && this.showCompress) {
        const formatSrc = this.src.replace(/^http:/, 'https:');
        const curSrc = `${formatSrc.replace('file', 'picsh')}?imageView2`;
        const compressType = this.compressType ? `/${this.compressType}` : '';
        const compressWidth = this.compressWidth ? `/w/${this.compressWidth}` : '';
        const compressHeight = this.compressHeight ? `/h/${this.compressHeight}` : '';
        const compress = this.compress ? `/q/${this.compress}` : '';
        const format = this.format ? `/format/${this.format}` : '';
        return curSrc + compressType + compressWidth + compressHeight + compress + format;
      } else {
        return this.src;
      }
    }
  },
  mounted() {
    this.$lazyImages.addImage(this.$refs.target, this.lazyLoad, this.eventElement);
    this.$lazyImages.loadImage();
  },
  watch: {
    realSrc(val) {
      setTimeout(() => {
        this.$lazyImages.removeImage(this.$refs.target);
        this.$lazyImages.addImage(this.$refs.target, this.lazyLoad, this.eventElement);
        this.$lazyImages.loadImage();
      }, 0)
    }
  },
  methods: {
    onload() {
      this.isLoading = false;
      this.$emit('load', event)
    },
    error(event) {
      this.isLoading = false;
      this.isLoadError = true;
      this.$emit('error', event)
    },
    handleClick(event) {
      this.$emit('handleClick', event);
    }
  },
  beforeDestroy() {
    this.$lazyImages.removeImage(this.$refs.target);
  },
}
</script>
<style lang="scss">
.loading-enter-active, .loading-leave-active {
    transition: opacity .3s;
}
.loading-enter, .loading-leave-to{
    opacity: 0;
}
.error-enter-active, .error-leave-active {
    transition: opacity .3s;
  }
.error-enter, .error-leave-to{
    opacity: 0;
}
.xiaoe-image__box {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.xiaoe-image {
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: top;

}
.xiaoe-image__error,.xiaoe-image__load {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #f7f8fa;
    overflow: hidden;
}
.xiaoe-image__error__icon,.xiaoe-image__load__icon {
    margin-bottom: 4px;
    width: 20px;
    height: 20px;
    font-size: 14px;
    color: #969799;
}
.xiaoe-image__load__icon {
    width: 24px;
    height: 24px;
}
.xiaoe-error__text,.xiaoe-load__text {
    padding: 0 4px;
    width: 100%;
    font-size: 14px;
    color: #969799;
    user-select:none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
}
.lazyImg{opacity: 1;
    transform: translateZ(0);
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
    -o-transition-duration: .5s;
    transition-duration: .5s;
    }
</style>