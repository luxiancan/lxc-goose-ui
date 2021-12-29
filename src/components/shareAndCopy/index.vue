<template>
    <div class="new-card-alert">
        <div class="weixin-item" v-show="!copyErrorShow && isWeChat" @click="shareWeixin">
            <img src="@/assets/images/shareAndCopy/icon_weixin.png"/>
            <div class="common-item-title">分享到微信</div>
        </div>
        <div class="link-item btn-copy" v-show="!copyErrorShow && !isWxMiniProgram" @click="copyUrl" :data-clipboard-text="share_url">
            <img src="@/assets/images/shareAndCopy/copy_link.png"/>
            <div class="common-item-title">复制链接</div>
        </div>
        <div class="copy-error" v-show="copyErrorShow && !isWxMiniProgram">
            <div class="copy-error-tit">长按复制链接，转发推广:</div>
            <div class="copy-error-url">{{share_url}}</div>
        </div>
        <div class="shade-box" v-show="openShareWx" @click="openShareWx=false">
        </div>
        <div class="share-to-wx" v-show="openShareWx">
            <img class="share-arrows-icon" src="@/assets/images/shareAndCopy/arrows_share.png"/>
            <p class="share-tit">立即分享给好友吧</p>
            <p class="share-tit">
                点击屏幕右上角
                <img class="share-dot-icon" src="@/assets/images/shareAndCopy/dot.png"/>
                将本页面分享给好友
            </p>
        </div>
    </div>
</template>
<script>
import Clipboard from 'clipboard'; // 复制插件
import toast from "@/lib/toast.js";
export default {
    name: 'SsShareAndCopy',
    props: {
        share_url: {
            default: '',
            type: String
        },
        linkToastTxt:{
            type: String,
            default: '链接已复制'          
        }
    },
    data () {
        return {
            openShareWx: false,
            copyErrorShow: false, //复制失败时，手动复制
            isWxMiniProgram: false,
        };
    },
    created() {
        this.judgeTerminal();
    },
    mounted() {
    },
    computed: {
        // 是否是微信浏览器
        isWeChat(){
            const UA = window.navigator.userAgent.toLowerCase();
            return UA && UA.indexOf('micromessenger') > -1;
        }
    },
    methods: {
        // 判断是否小程序端
        judgeTerminal() {
            if(wx && wx.CLIENT_ENV === 'wx_miniProgram') {
                this.isWxMiniProgram = true;
            }
        },
        shareWeixin() {
            this.openShareWx = true;
            // 直播间邀请成功回调 显示分享弹窗
            this.$emit('shareSuccess');
        },
        copyUrl() {
            // 设置复制按钮
            let clipboard = new Clipboard('.btn-copy');
            clipboard.on('success', (e) => {
                toast(`${this.linkToastTxt}`);
                this.$emit('copySuccess')
                e.clearSelection();
            });
           

            clipboard.on('error', (e) => {
                this.copyErrorShow = true;
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        }
    }
};
</script>
<style scoped lang="scss">
    .new-card-alert{
        width: 100%;
        height: 1.44rem;
        background: #FFFFFF;
        display: flex;
        box-sizing: border-box;
        .weixin-item,.link-item{
            flex: 1;
            display: flex;
            text-align: center;
            justify-content: center;
            img{
                width: 0.96rem;
                height:  0.96rem;
                display: block;
                margin-right: 0.08rem;
                margin-top: 0.24rem;
            }
            .common-item-title{
               color: #666666;
               font-size: 0.28rem; 
               line-height: 1.44rem;
            }
        }
        .shade-box{
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 5;
            background:#000000;
            opacity:0.7;
        }
        .share-to-wx{
            width: 100%;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 10;
            padding-top: 1.34rem;
            .share-arrows-icon{
                position: absolute;
                right: 1.04rem;
                top: 0.28rem;
                width: 1.04rem;
                height: 1.04rem;
            }
            .share-tit{
                line-height:0.52rem;
                font-size:0.28rem;
                font-weight:500;
                color: #FFFFFF;
                text-align: center;
                padding-bottom: 0.16rem;
            }
            .share-dot-icon{
                width: 0.4rem;
                height: 0.08rem;
                vertical-align: middle;
            }
        }
        .copy-error{
            width: 100%;
            color: #666666;
            .copy-error-tit{
                text-align: center;
                font-size: 0.28rem; 
            }
            .copy-error-url{
                font-size: 0.2rem;
                word-break:break-all;
            }
        }
    }
</style>