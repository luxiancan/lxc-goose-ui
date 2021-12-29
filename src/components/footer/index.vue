<template>
  <div class="ss-footer">
    <ul class="ss-footer-nav" v-if="SDKConf.is_show_bottom_nav">
      <li class="ss-footer-nav-item"
        v-for="(item,index) of navList"
        :key="index"
        @click="clickHandler(item, $event)">
        {{item.title}}
         <!-- <img v-if="showSigleLi" class="rightRowImg" src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/b_u_5b2225aa46488_oGKN7IvA/knacmqef06mi.png"> -->
       </li>
    </ul>
    <div class="ss-footer-logo"
      @click="gotoOfficialWeb">
      <div class="ss-footer-logo--default"
        v-if="isDefaultImg">
        <img src="@/assets/images/footer/bottom_logo.png" alt="小鹅通提供技术支持">
      </div>
      <div class="ss-footer-logo--custom"
        v-else>
        <div class="ss-footer-logo--first">
          <img :src="customLogo">
        </div>
        <div class="ss-footer-logo--last">
            <img src="@/assets/images/footer/bottom_logo1.png" alt="小鹅通提供技术支持">
        </div>
      </div>
    </div>
    <attentionQrCode :isShow.sync="isShowQr"
      :qrSrc="qrSrc"
      :qrTitle="qrTitle"
      :qrHint="qrHint"
       />
  </div>
</template>

<script>
import NetWork from '@/lib/network';
import eJump from '@/lib/eJump';

import attentionQrCode from './attentionQrCode';
import initAppSDK from '../../mixins/initAppSDK';
import {navigateTo} from '../../../libEntry/install/func-tool/index.js'

export default {
    name: 'SsFooter',
    mixins: [initAppSDK],
    props: {
    // 是否缓存数据，默认缓存
        hasCacheData: {
            type: Boolean,
            default: true
        },
        fromLive: {
            type: Boolean,
            default: false
        },
        sensorsProps: {
           type: Object,
            default: ()=>{
                return {
                    channel: "1285-1351-1352-13037" // H5店铺底部技术支持-官网注册更换chnnel
                }
            }
        }
    },
    components: {
        attentionQrCode
    },
    data() {
        return {
            isDefaultImg: true, // 是否是默认页脚图片
            isShowQr: false, // 是否显示关注我们二维码弹窗
            customLogo: '', // 商家logo
            qrSrc: '', // 关注我们二维码图片链接
            qrTitle: '', // 公众号名称
            navList: [], // 链接列表
            isAssistantGray:false // 商家助手小程序是否在灰度，默认不在灰度
        }
    },
    created(){  
        this.getAssistantGray()
    },
    mounted() {
        this.asyncData()
    },
    methods: {
        // 数据请求
        asyncData() {
            const footerData = window.sessionStorage.getItem(`footData_${window.APPID}`)

            // 判断数据是否有缓存
            if (footerData && this.hasCacheData) {
                this.processFooterData(JSON.parse(footerData))
            } else {
                this.getFooterData()
            }
        },
        getFooterData() {
            // http://115.159.100.182:8886/index.php?s=/179
            const url = this.fromLive ? '_alive/footer' : 'footer'
            NetWork.request(url, {
                app_id: window.APPID,
                type: 1, // 支付和邀请码页面传0 顶部和页脚传1
                resourceType: 0,
                resourceId: '',
            }, (data) => {
                if (data) {
                    // 兼容为字符串形式的返回
                    let resData = data;
                    if (typeof (resData) == 'string') {
                        resData = JSON.parse(resData);
                    }
                    if (resData.code === 0) {
                        // 缓存请求数据
                        window.sessionStorage.setItem(`footData_${window.APPID}`, JSON.stringify(resData.data))
                        this.processFooterData(resData.data)
                    } else {
                        console.log(resData);
                    }
                }
            });
        },
        // 处理数据
        processFooterData(data) {
            const res = data
            let navLinkList = res.link || [];
            
            if( window.wx && window.wx.SHOP_TYPE_ENV ){
                let tmpNav = [];
                if( window.wx.SHOP_TYPE_ENV ==='scrm_assistant' ){
                    // 如果是企微助手环境只保留意见反馈导航
                    Array.isArray(navLinkList) && navLinkList.forEach(ele => {
                          if( ele.name === 'feedback'){
                              tmpNav.push(ele);
                          }
                    });
                }else if( window.wx.SHOP_TYPE_ENV ==='qlive_shop' ){
                    // 企业直播类型不显示关注我们(name==='follow')
                    Array.isArray(navLinkList) && navLinkList.forEach(ele => {
                          if( ele.name !== 'follow'){
                              tmpNav.push(ele);
                          }
                    });
                }
                this.navList = tmpNav;
            }else{
                this.navList = navLinkList;
            }

            // 是否存在商家自定义链接
            if (res.footer_logo) {
                this.isDefaultImg = false
                this.customLogo = res.footer_logo
            }
            // 数据加载完成，只有数据请求完成且正确才会响应
            this.$nextTick(() => {
                this.$emit('data-finish')
            })
        },
        // 点击事件
        clickHandler(item, e) {
            // 点击跳转前的钩子函数，可用于埋点等相关操作
            ({}).toString.call(item.beforeFn) === '[object Function]' && item.beforeFn(item, e)

            // 针对feedback写特殊的跳转逻辑
            if (item.name === 'feedback') {
                this.goToFeedback(item)
            } else if (item.name === 'follow') {
                // 针对follow写特殊逻辑
                this.followUs(item)
            } else if (item.action === 'jump') {
                // 带有‘jump’动作的进行跳转,微信小程序3.0店铺主页、个人中心跳转至小程序
                if( item.name === 'homepage' || item.name === 'user' ){
                      navigateTo(item.data.url,true)
                }else{
                     navigateTo(item.data.url)
                }
                
            }
        },
        // 关注我们，弹出二维码
        followUs(item) {
            this.isShowQr = true
            this.qrSrc = item.data.wx_qr_url
            this.qrTitle = item.data.wx_app_name
        },
        // 跳转至意见反馈
        goToFeedback(item) {
            let resourceId = '';
            let resourceType = '';
            const flagStr = 'content_page';
            const flagIndex = window.location.href.indexOf(flagStr);
            if (flagIndex >= 0) { // 课程详情页
                const start = flagIndex + flagStr.length + 1;
                let decodeStr = window.location.href.substring(start);
                /**
         * 对部分页面，点击公共组件，无法意见投诉，无效进行处理
         *  原因： 1.部分页面使用<a>标签跳转，导致获取的decodeStr字符串末尾存在#，导致base64解密失败
         *        2.部分页面通过浏览器链接截取获取的decodeStr字符串末尾存在?*****，导致base64解密失败
         */
                if (decodeStr.indexOf('#') >= 0 || decodeStr.indexOf('?') >= 0) {
                    decodeStr = decodeStr.substring(0, decodeStr.indexOf('#')) || decodeStr.substring(0, decodeStr.indexOf('?'));
                }
                const decodeObj = JSON.parse(window.atob(decodeStr));
                console.log('decodeObj123', decodeObj);
                // const needResource = [1,2,3,4,20]; // 只有图文、音频、视频、直播、电子书需要传递resource_id和resource_type用于获取课程资源信息
                if (decodeObj.type == 2 && ((decodeObj.resource_type > 0 && decodeObj.resource_type < 5) || decodeObj.resource_type == 20)) { // 单笔资源页（1-图文、2-音频、3-视频、4-直播  5-活动报名  7-社群 20-电子书 21-实物商品 16-小鹅打卡）
                    resourceId = decodeObj.resource_id;
                    resourceType = decodeObj.resource_type;
                } else if (decodeObj.type === 3) { // 专栏，大专栏，会员；专栏，大专栏，会员没有resource_id和resource_type，有product_id，默认resource_type = 5,由后台作区分
                    resourceId = decodeObj.product_id;
                    resourceType = 5;
                }
            }
            // 添加埋点统计
            const dataUpArr = {
                et: 1, // 1 表示自定义事件
                sc: 2, // 一级场景 2表示详情页
                cpg: '意见反馈', // 当前页面名称
                actn: 'adviceFeedback'// 自定义动作
            };
            const dadaArray = [dataUpArr];
            window._YS_report && window._YS_report.push(dadaArray); // 使用方法 dadaArray 一定要是数组 不是数组时候不会上报成功
            eJump.jump(`${item.data.url}?resource_id=${resourceId}&resource_type=${resourceType}`);
        },
        // 跳转至官网
        gotoOfficialWeb() {
            /**   
             *  以下场景点击不跳转官网
             *  智慧校园(window.__shop_type !== 6)、
             *  sdk(wx.CLIENT_ENV==='xiaoeapp')
             *  店铺小程序(wx.CLIENT_ENV==='wx_miniProgram')
             */           
            const _CLIENT_ENV = ['xiaoeapp','wx_miniProgram']
            if ( window.__shop_type !== 6 && wx && !_CLIENT_ENV.includes(wx.CLIENT_ENV)) {
                 // 增加上报参数
                let baseUrl = "https://www.xiaoe-tech.com";
                // H5店铺底部技术支持-官网注册更换chnnel 新渠道 1285-1351-1352-13037
                let channel = this.sensorsProps.channel? this.sensorsProps.channel: "1285-1351-1352-13037";
                let app_id = this.sensorsProps.app_id;
                let cmm1 = this.sensorsProps.cmm1;
                let jumpUrl = `${baseUrl}?channel=${channel}${app_id ? "&app_id=" + app_id : ""}${cmm1 ? "&cmm1=" + cmm1 : ""}`;
                console.log('jumpUrl',jumpUrl)
                if(!this.isAssistantGray){
                     eJump.jump(jumpUrl);
                    }else{
                        // 在灰度，但是不在微信公众网页，也跳转官网(微信开放标签只支持微信网页打开小程序)
                        if( wx && wx.CLIENT_ENV != 'wechat' ){
                            eJump.jump(jumpUrl);
                        }else{
                            // 跳转h5商家助手小程序落地页，然后唤起商家助手小程序
                            eJump.jump('/v1/usercenter/lp_assistant_login/spread_page')
                        }
                    } 
            }
        },
        //获取商家助手小程序灰度控制
        getAssistantGray(){
            let that = this;
            NetWork.request('/is_code_gray', {
                gray_mode_id:'assistant_app_2'
            }, (data) => {
                if (data) {
                    // code -0在灰度中 -1不在灰度中
                    let resData = data;
                    if (resData.code === 0) {
                        that.isAssistantGray = true;
                    } else {
                        console.log(resData,'商家助手小程序不在灰度');                       
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
 @import '@/assets/scss/packages/footer.scss';
//  .ss-grey{
//      color: #999999!important;
//      background: transparent;
//  }
//  .rightRowImg{
//      width: 0.32rem;
//      height: 0.32rem;
//      vertical-align: bottom;
//      margin-bottom: -1px;
//      margin-left: -0.06rem;
//  }
</style>
