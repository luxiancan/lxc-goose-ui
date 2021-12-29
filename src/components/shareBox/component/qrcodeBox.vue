<template>
    <div class="qrcode-box">
         <div class ="qrcodeBox-title">{{qrTitle}}</div>
          <img class="close" src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS04MTQzMjU4Mg.png"
          @click.stop="close" />
          <div class="qrcode-content" v-if="qrCodeUrl">
              <img :src="qrCode" v-if="qrCode" :class="{'ios-img-touch':!isWeChat}"/>
          </div>
          <span class="save-tips">{{saveTips}}</span>
          <!-- <a class="save" :href="qrCode">保存图片</a> -->
    </div>
</template>

<script>
import NetWork from '@/lib/network.js';
import toast from '@/lib/toast.js';
import QRCode from 'qrcode';

export default {
  props: {
    qrTitle: {
      type: String,
      default: '分享标题'
    },
    qrCodeUrl: {
      type: String,
      default: ''
    },
    saveTips: {
      type: String,
      default: '长按保存图片后在微信中打开扫码'
    }
  },
  data() {
    return {
      qrCode: ''
    };
  },
  created() {
    if (this.qrCodeUrl) {
      this.createQrcode(this.qrCodeUrl);
    }
  },
  computed: {
    // 是否是微信浏览器
    isWeChat() {
      const UA = window.navigator.userAgent.toLowerCase();
      return UA && UA.indexOf('micromessenger') > -1;
    }
  },
  methods: {
    close() {
      this.$emit('qrclose');
    },
    // 生成二维码
    createQrcode(qrUrl) {
      QRCode.toDataURL(qrUrl)
        .then((url) => {
          const str = navigator.userAgent.toLowerCase();
          const ver = str.match(/cpu iphone os (.*?) like mac os/);
          if (ver) { 
            const version = ver[1].replace(/_/g, '.').split('.')[0]; 
            if (version <= 9) {
              const blob = this.b64toBlob(url.split(',')[1]);
              this.qrCode = URL.createObjectURL(blob);
            } else {
              this.qrCode = url;
            }
          } else {
            this.qrCode = url;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /**
         * b64toBlob base64转blod
         */
    b64toBlob(b64Data, contentType = 'image/png', sliceSize = 512) {
      const byteCharacters = window.atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
  },
  destroyed() {
  },
};
</script>

<style lang="scss" scoped>
.qrcode-box{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width:5.9rem;
    height:7.48rem;
    background:#fff;
    border-radius:0.24rem;

    .qrcodeBox-title{
        width:100%;
        text-align: center;
        padding:0.8rem 0.2rem 0.4rem;
        margin: 0 auto;
        font-size:0.32rem;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight:500;
    }
    .qrcode-content{
        text-align: center;
        img{
            width:4rem;
            height:4rem;
            border-radius:0.08rem;
        }
    }
    .ios-img-touch{
      -webkit-touch-callout: initial;
    }
    .close{
        position: absolute;
        top:0.32rem;
        right:0.34rem;
        width:0.32rem;
        height:0.32rem;
    }
    .save{
        display: block;
        margin: 0 auto;
        width:4.2rem;
        height:0.8rem;
        font-size:0.28rem;
        background:rgba(16,92,251,1);
        border-radius:0.38rem;
        color:#fff;
        text-align: center;
        line-height: 0.8rem;
        text-decoration: none;
    }
    .save-tips{
        display: block;
        text-align: center;
        height:0.34rem;
        font-size:0.24rem;
        font-weight:400;
        color:rgba(136,136,136,1);
        line-height:0.34rem;
    }
}
</style>