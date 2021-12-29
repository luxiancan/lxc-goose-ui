<template>
  <div class="container">
    <div class="components">
      <div class="title">组件</div>
      <div class="routes">
        <a
          v-for="route of components"
          :key="route.name"
          :to="route"
          @click="onPreview(route)"
          >{{ route.name }}</a
        >
      </div>
      <p class="tips">
        注：为模拟h5端的展示和开发（移动端主要用相对单位rem开发），
        html（:root）元素的font-size调整为50px（对应移动端375px宽），body
        font-size调整回14px
      </p>
      <p class="tips">
        注：为避免样式污染，组件命名空间为ss，非组件样式请勿写进assets/scss/index.scss
      </p>
    </div>
    <div class="preview" v-show="emulatorSrc">
      <iframe
        class="emulator"
        ref="emulator"
        name="emulator"
        id="inlineFrameExample"
        title="Inline Frame Example"
        width="375"
        height="667"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
import Router from '@/router';

export default {
    data() {
        return {
            routes: ['button', 'footer', 'publicTop', 'couponList', 'couponItem', 'couponSelect', 'payGiftPromoCode', 'shareBox', 'customerService', 'invoiceSelect', 'messageBox', 'authenticationMessageBox', 'vuePreview', 'accountModal', 'phoneCode', 'entityGift', 'addressSelect', 'invitingRank', 'liveMarketing','shareBtn','teamBuyCountdown', 'taxSign'],
            emulatorSrc: null
        };
    },
    computed: {
        components() {
            return Router.options.routes.filter(item => item.name !== 'index');
        }
    },
    mounted() {
        emulator.document.body.style.fontSize = '50px';
    },
    methods: {
        onPreview(route) {
            this.emulatorSrc = `/#${route.path}?title=${route.name}`;
            this.$refs.emulator.src = `/#${route.path}?title=${route.name}`;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base.scss";

.container {
  display: flex;
  flex-direction: row;
  height: 100%;

  .components,
  .preview {
    flex: 1;
  }

  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    .emulator {
      height: 667px;
      width: 375px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: none;
      margin: 0;
      padding: 0;
      font-size: 50px;
      margin-top: 20px;
    }
  }
}

.title {
  padding: 20px;
  line-height: 50px;
  font-size: 32px;
  font-weight: 600;
  color: #353535;
}
.routes {
  display: flex;
  flex-direction: column;
  a {
    color: #353535;
    padding: 2px 20px;
    font-size: 18px;
    text-decoration: none;
    &:hover {
      color: $mc;
    }
  }
}
.tips {
  margin: 20px;
}
</style>
