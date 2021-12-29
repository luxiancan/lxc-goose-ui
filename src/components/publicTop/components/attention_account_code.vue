<template>
    <div :class="['account-code-container', {'transition': show_module}]">
        <div @click="closeCodeAccount" class="account-code-bg"></div>
        <div class="content-main">
            <img class="close" @click="closeCodeAccount"  src="@/assets/images/publicTop/icon_close.png"/>
            <div class="t1 c2 title" v-text="account_name"></div>
            <div class="img-code">
                <span class="dec dec-1"></span>
                <span class="dec dec-2"></span>
                <span class="dec dec-3"></span>
                <span class="dec dec-4"></span>
                <img class="code" :src="code_img_url" @touchstart="startPress" @touchend="endPress" :class="{'ios-img-touch':!isWeChat}"/>
            </div>
            <div class="c3 t3 footer">{{hintText}}</div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/lib/eventbus.js';

export default {
  name: 'attention_account_code',
  created() {
    // 显示本组件
    EventBus.$on('showCodeAccount', this.showCodeAccount);
    // 隐藏本组件
    EventBus.$on('closeCodeAccount', this.closeCodeAccount);
  },
  data() {
    return {
      // 二维码名称
      code_img_url: '',
      // 公众号名称
      account_name: '',
      // 二维码提示语句
      // hint_sentence: '',

      // 显示本组件（true, false）
      show_module: false,

      time: null,
      is_long_time: false
    };
  },
  computed: {
    // 是否是微信浏览器
    isWeChat() {
      return window.wx && wx.CLIENT_ENV === 'wechat';
    },
    //是否是PC端
    isPcClient(){
      return window.wx && wx.CLIENT_TYPE === 'PC';
    },
    //提示文案
    hintText(){
      let defaultTxt = '长按识别二维码关注公众号';
      if( !this.isWeChat ){
         defaultTxt = this.isPcClient ? '微信扫描图片二维码，识别并关注' :'长按保存图片后在微信打开扫码';
      }
      return defaultTxt;
    }
  },
  methods: {
    /**
             * 功能：显示本组件
             * 参数：
             * code_data: {
             *      code_img_url: '',  // 二维码链接
             *      account_name: '',  // 公众号名称
             *      hint_sentence: '', // 二维码提示语句
             * }
             */
    showCodeAccount(code_data) {
      this.code_img_url = code_data.code_img_url;
      this.account_name = code_data.account_name;
      this.show_module = true;

      try {
        event_report('home_qr_show');
        console.log('home_qr_show');
      } catch (e) {
        console.log(e);
      }
    },

    /**
             * 功能：隐藏本组件
             */
    closeCodeAccount() {
      const isAndroid = window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1;
      if (isAndroid) {
        EventBus.$emit('isAttention', false);
      }
      this.show_module = false;
      try {
        event_report('home_qr_close');
        console.log('home_qr_close');
      } catch (e) {
        console.log(e);
      }
    },

    // 长按统计事件
    startPress() {
      const that = this;
      that.time = setTimeout(() => {
        that.is_long_time = true;
      }, 1000);
    },

    // 长按统计事件
    endPress() {
      clearTimeout(this.time);
      if (this.is_long_time) {
        this.is_long_time = false;
        try {
          event_report('home_qr_recognition');
          console.log('home_qr_recognition');
        } catch (e) {
          console.log(e);
        }
      }
    }

  },
};
</script>

<style lang="scss" scoped>
    .dec-4 {
        border-bottom: 1px solid #dadada;
        border-right: 1px solid #dadada;
        bottom: 0;
        right: 0;
        transform-origin: bottom right;
    }
    .dec-3 {
        border-bottom: 1px solid #dadada;
        border-left: 1px solid #dadada;
        bottom: 0;
        left: 0;
        transform-origin: bottom left;
    }
    .dec-2 {
        border-top: 1px solid #dadada;
        border-right: 1px solid #dadada;
        top: 0;
        right: 0;
        transform-origin: top right;
    }
    .dec-1 {
        border-top: 1px solid #dadada;
        border-left: 1px solid #dadada;
        top: 0;
        left: 0;
        transform-origin: top left;
    }
    .dec {
        display: block;
        width: 0.8rem;
        height: 0.8rem;
        position: absolute;
        transform: scale(0.5);
    }
    .img-code {
        margin: 0.4rem auto;
        position: relative;
        width: 2.3rem;
        height: 2.3rem;
    }
    @keyframes opacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    .account-code-container {
        display: none;
        &.transition {
          animation: opacity 0.5s;
          display: block;
        }
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100000000;
    }
    .account-code-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }
    .content-main {
        position: absolute;
        top: 2.6rem;
        left: 50%;
        transform: translateX(-50%);
        width: 5rem;
        height: 5.4rem;
        border-radius: 0.14rem;
        background-color: #fff;
    }
    .content-main .close {
        width: 0.24rem;
        height: 0.24rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        padding: 0.2rem;
        box-sizing: content-box;
    }
    .content-main > .title {
        margin-top: 0.7rem;
        text-align: center;
        color: #fdab46;
    }
    .content-main > .hint-sentence {
        margin-top: 0.2rem;
        text-align: center;
    }
    .code {
        display: block;
        width: 1.9rem;
        height: 1.9rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .ios-img-touch{
      -webkit-touch-callout: initial;
    }
    .content-main > .footer {
        margin-top: 0.22rem;
        text-align: center;
    }


</style>
