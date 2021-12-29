<template>
  <div class="ss-Attention-qr"
    v-show="isShow">
    <div class="ss-Att-qr-mask"></div>
    <div class="ss-Att-qr-main">
      <img class="ss-Att-qr-close"
        src="@/assets/images/footer/icon_close.png"
        @click="close" />
      <p class="ss-Att-qr-titel">{{qrTitle}}</p>
      <div class="ss-Att-qr-code">
        <img :src="qrSrc"
          :class="{'ios-img-touch':!isWeChat}"
          @touchstart="startPress"
          @touchend="endPress">
      </div>
      <div class="ss-Att-qr-footer">{{qrHint}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示弹框
    isShow: {
      type: Boolean,
      default: false
    },
    // 二维码链接
    qrSrc: {
      type: String,
      default: ''
    },
    // 公众号名称
    qrTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: '', // 计时器
      isLongPress: false, // 是否是长按
    }
  },
  watch: {
    isShow(newVal) {
      try {
        if (newVal) {
          // 显示本组件埋点
          event_report('home_qr_show');
          console.log('home_qr_show');
        } else {
          event_report('home_qr_close');
          console.log('home_qr_close');
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    // 是否是微信浏览器
    isWeChat() {
      const UA = window.navigator.userAgent.toLowerCase();
      if (UA.indexOf('miniprogram') > -1 || this.getQueryStr('app_env_type') === 'mini_program_wechat') {
        // 微信小程序特殊处理
        return false;
      }
      return UA && UA.indexOf('micromessenger') > -1;
    },
    qrHint(){
        let txtHint = '长按识别二维码关注公众号';
        if(!this.isWeChat){
            //这里不用公共sdk判断,因为这个组件所有页面均有引入，避免业务方某页面未引入sdk库造成环境变量不存在，导致判断无意义
            let mobileMatch = /(iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone)/i;
            const UA = window.navigator.userAgent.toLowerCase();
            txtHint = mobileMatch.test(UA) ? '长按保存图片后在微信打开扫码' : '微信扫描图片二维码，识别并关注';                 
        }
        return txtHint;
    }
  },
  methods: {
    // 关闭事件
    close() {
      this.$emit('update:isShow', false)
    },
    // 开始长按
    startPress() {
      this.timer = setTimeout(() => {
        this.isLongPress = true
      }, 1000);
    },
    // 结束长按
    endPress() {
      clearTimeout(this.timer)
      if (this.isLongPress) {
        this.isLongPress = false
        try {
          event_report('home_qr_recognition');
          console.log('home_qr_recognition');
        } catch (e) {
          console.log(e);
        }
      }
    },
    getQueryStr (key) {
      let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {return unescape(r[2]);} return null;
    }
  }
}
</script>

<style lang="scss" scoped>
.ss-Attention-qr {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  .ss-Att-qr-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .ss-Att-qr-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 2.6rem;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 0.44rem;
    width: 6rem;
    height: 7.44rem;
    border-radius: 0.08rem;
    background-color: #fff;
    .ss-Att-qr-close {
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      top: 0.3rem;
      right: 0.3rem;
    }
    .ss-Att-qr-titel {
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.44rem;
      text-align: center;
    }
    .ss-Att-qr-code {
      margin: 0.2rem 0 0.12rem;
      width: 5rem;
      height: 5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .ios-img-touch{
      -webkit-touch-callout: initial;
    }
    .ss-Att-qr-footer {
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #888;
    }
  }
}
</style>
