<template>
  <div class="ss-popup">
    <transition name="fade" v-if="overlay">
      <div
        v-if="visible"
        class="ss-popup__overlay"
        @click="onClickOverlay"
      ></div>
    </transition>
    <transition :name="position === 'center' ? 'fade' : 'slide'">
      <div
        v-if="visible"
        class="safe-area-inset-bottom"
        :class="[
          `ss-popup--${position}`,
          { [`ss-popup--${position}--round`]: round }
        ]"
        :style="customStyle"
      >
        <span
          v-if="closeable"
          class="iconfont icon-icon_close ss-popup__close"
          @click.stop="onClickClose"
        ></span>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
// import { fixIPhoneX } from "@/../lib/directives";

export default {
  name: "SsPopup",
  // directives: {
  //   fixIPhoneX
  // },
  model: {
    prop: "visible",
    event: "change"
  },
  props: {
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "bottom",
      validator: value => {
        return ["top", "bottom", "left", "right", "center"].includes(value);
      }
    },
    round: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    customStyle: {
      type: [Object, String],
      default: () => ({})
    }
  },
  watch: {
    visible(val) {
      if (!this.lockScroll) {
        return;
      }
      if (val) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }
  },
  methods: {
    onClickOverlay() {
      this.$emit("click-overlay");
      if (this.closeOnClickOverlay) {
        this.$emit("change", false);
      }
    },
    onClickClose() {
      this.$emit("change", false);
    }
  },
  beforeDestroy() {
    this.lockScroll && document.body.classList.remove("overflow-hidden");
  }
};
</script>

<style lang="scss" scoped>
 @import '@/assets/scss/packages/popup.scss';
</style>