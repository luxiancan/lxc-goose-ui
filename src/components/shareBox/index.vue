<template>
    <div class="share-box-container">
      <div class="share-box-bg"></div>
      <div class="share-box-main" v-show="showShareBox">
          <div class ="box-main-title">{{boxTitle}}</div>
          <img class="close" src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS04MTQzMjU4Mg.png"
          @click.stop="close" />
          <div class="box-content" :style="{padding: showWechatBtn ? '0 .7rem' : '0 1.6rem'}">
              <div class="box-btn" v-if="showWechatBtn">
                  <img src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/k8h1q8bf0eoe80egmfwk.png"
                   @click.stop="shareWechat"/>
                  <span class="btn-text">微信好友</span>
              </div>
              <div class="box-btn">
                  <img src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS02MTk2MDQwNw.png"
                   @click.stop="showQrcode"/>
                  <span class="btn-text">二维码</span>
              </div>
              <div class="box-btn">
                  <button class="copybtn" @click="copyLink" :data-clipboard-text="copy_url"></button>
                  <span class="btn-text">复制链接</span>
              </div>
          </div>
      </div>
      <qrcodeBox v-show="showCode" :qrTitle="qrTitle" :qrCodeUrl="copy_url" @qrclose="qrclose" :saveTips="saveTips"/>
      <shareTip v-show="showShareTip" @tipsclose="tipsclose"/>
    </div>
</template>

<script>
import NetWork from "@/lib/network.js";
import toast from "@/lib/toast.js";
import qrcodeBox from './component/qrcodeBox';
import shareTip from './component/shareTips';
import Clipboard from 'clipboard';

export default {
  name:'SsShareBox',
  props: {
    boxTitle:{
        type:String,
        default:'分享给好友,前1000000000人免费听'
    },
    qrTitle:{
        type:String,
        default:'二维码标题'
    },
    copy_url:{
        type:String,
        default:'https://www.xiaoe-tech.com'
    },
    saveTips:{
        type:String,
        default:'长按保存图片后在微信中打开扫码'
    }
  },
  data: function() {
    return {
       btnInfo:[
           {
               btnType:'qrcode',
               imgUrl:'http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS02MTk2MDQwNw.png',
               btnTxt:'二维码'
           },
           {   btnType:'copyLink',
               imgUrl:'http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS03NDcyNDY1OQ.png',
               btnTxt:'复制链接'
           }
        ],
        showCode:false, // 显示二维码弹框
        showShareBox:true, //显示分享框
        showShareTip: false // 显示右上角分享提示
    };
  },
  created () {

  },
  components:{
      qrcodeBox,
      shareTip
  },
  computed: {
      showWechatBtn() {
          const UA = window.navigator.userAgent.toLowerCase();
          return UA && UA.indexOf('weibo') > -1;
      }
  },
  methods: {
    close(){
        this.$emit('boxClose', 'shareBox');
    },
    qrclose(){
       this.close();
    },
    // 处理响应
    showQrcode(){
      this.showShareBox = false;
      this.showCode = true;      
    },
    shareWechat() {
        this.showShareBox = false;
        this.showShareTip = true;
    },
    tipsclose() {
        this.showShareTip = false;
        this.close();
    },
    copyLink(){
         // 设置复制按钮
        let clipboard = new Clipboard('.copybtn');
        let that = this;
        clipboard.on('success', function(e) {
          toast('复制链接成功')
          e.clearSelection();
          that.close();
        });

        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
  },
  destroyed () {
  },
};
</script>

<style lang="scss" scoped>
.share-box-container{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
    max-width: 480px;
    height: 100%;
    z-index: 11;
    .share-box-bg{
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background-color: rgba(0, 0, 0, 0.6);
    }
    .share-box-main{
        position: absolute;
        bottom:0;
        left: 0;
        height:4.64rem;
        width:100%;
        background: #FFF;
        border-radius:0.24rem 0.24rem 0rem 0rem
    }
    .close{
        position: absolute;
        top:0.58rem;
        right:0.34rem;
        width:0.26rem;
        height:0.26rem;
    }
    .box-main-title{
        width:6.2rem;
        font-size:0.32rem;
        text-align: center;
        padding:0.48rem 0 ;
        line-height: 0.44rem;
        font-weight:500;
        margin: 0 auto;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .box-content{
        display: flex;
        padding: 0 1.6rem;
        justify-content: space-between;
    }
    .box-btn{
        text-align: center;
        cursor: pointer;
        img{
            width:1.2rem;
            height:1.2rem;
        }
        .btn-text{
            display: block;
            margin-top: 0.26rem;
            font-size:0.28rem;
            color:#666666;
        }
        .copybtn{
            width:1.2rem;
            height:1.2rem;
            background: url('http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS03NDcyNDY1OQ.png');
            user-select: none;
            background-size:100% 100%;
            border: none;
        }

    }

}
</style>