<template>
  <div class="ss-float-menu" v-if="SDKConf.is_show_flow_nav">
    <div
      class="btn-menu"
      v-show="isBtnShow"
      v-fixIPhoneX="{ bottom: '2rem' }"
      :class="{ 'is-fold': isFold }"
      @click.prevent="openMenu"
    >
      <img src="@/assets/images/floatMenu/felx_menu_btn.png" alt="" />
    </div>
    <div
      class="over-layer"
      :class="{ 'is-show': isMenuShow }"
      @click="hideMenu"
    ></div>
    <div
      class="container-menu"
      :class="{ 'is-show': isMenuShow, 'is-short-menu': isShortMenu }"
    >
      <ul class="menus">
        <li>
          <figure @click.prevent="toHome">
            <img src="@/assets/images/floatMenu/felx_menu_store.png" />
            <figcaption>{{ textHomePage }}</figcaption>
          </figure>
        </li>
        <li>
          <figure @click.prevent="toAccountCenter">
            <img src="@/assets/images/floatMenu/felx_menu_account.png" />
            <figcaption>{{ textUserCenter }}</figcaption>
          </figure>
        </li>
        <!-- 收藏暂时屏蔽实物-->
        <li v-show="isWeChatEnv" v-if="showFavorite">
          <figure @click.prevent="toggleCollect">
            <img
              v-if="isFavorite"
              src="@/assets/images/floatMenu/felx_menu_likeclick.png"
            />
            <img v-else src="@/assets/images/floatMenu/felx_menu_like.png" />
            <figcaption>{{ isFavorite ? "已收藏" : "收藏" }}</figcaption>
          </figure>
        </li>
        <li>
          <figure @click.prevent="toMessagePage">
            <img src="@/assets/images/floatMenu/felx_menu_message.png" />
            <figcaption>消息</figcaption>
          </figure>
          <span v-show="unreadMsgCount" class="tag-num">
            {{ unreadMsgCount > 99 ? "..." : unreadMsgCount }}
          </span>
        </li>
        <li v-if="showQrcodeIcon && !isSmartCampus && !isWxWorkEnv && isWeChatEnv">
          <figure @click.prevent="openQrCodeModal">
            <img src="@/assets/images/floatMenu/felx_menu_qrcode.png" />
            <figcaption>进入公众号</figcaption>
          </figure>
        </li>
        <li v-show="showContact">
          <figure @click.prevent="toCustomerService">
            <img src="@/assets/images/floatMenu/home_service.png">
            <figcaption>联系客服</figcaption>
          </figure>
        </li>
      </ul>
      <div class="btn-close" @click="hideMenu">
        关闭
      </div>
    </div>
    <attention-code></attention-code>
  </div>
</template>

<script>
import NetWork from '@/lib/network.js';
import toast from '@/lib/toast.js';
import eJump from '@/lib/eJump.js';
import EventBus from '@/lib/eventbus.js';
import loading from '@/lib/loading.js';
import attentionCode from './components/attentionAccountCode.vue';
import { fixIPhoneX } from './directives';
import initAppSDK from '../../mixins/initAppSDK';
import { navigateTo } from '../../../libEntry/install/func-tool/index.js';

export default {
    mixins: [initAppSDK],
    name: 'SsFloatMenu',
    props: {
        resourceId: {
            // 资源id
            type: Number | String,
            default: ''
        },
        resourceType: {
            // 资源类型
            type: Number | String,
            default: ''
        },
        isFavorite: {
            // 是否已经收藏 1 收藏 0 未收藏
            type: Number | Boolean,
            default: 0
        },
        showFavorite: {
            // 是否显示收藏按钮 true收藏，颜值五期社群页加入浮动菜单
            type: Boolean,
            default: true
        }
    },
    directives: {
        fixIPhoneX
    },
    data() {
        return {
            isBtnShow: true,
            isMenuShow: false, // 是否打开menu
            subscribeConfig: null,
            isFavoriteStateChanging: false,
            unreadMsgCount: 0,
            isFold: false,
            isShortMenu: false,
            showContact: false, // 展示联系客服
        };
    },
    components: {
        attentionCode
    },
    computed: {
        showQrcodeIcon() {
            return (this.subscribeConfig || {}).wx_qr_url;
        },
        isSmartCampus() {
            // 判断是智慧校园
            // eslint-disable-next-line no-underscore-dangle
            return window.__shop_type && window.__shop_type === 6;
        },
        textUserCenter() {
            if (this.isSmartCampus) {
                return '我的学习';
            }
            return '个人中心';
        },
        textHomePage() {
            if (this.isSmartCampus) {
                return '课堂主页';
            }
            return '店铺主页';
        },
        // 是否企业微信
        isWxWorkEnv() {
            const UA = window.navigator.userAgent.toLowerCase();
            return UA && UA.indexOf('wxwork') > -1;
        },
        // 是否是微信浏览器
        isWeChatEnv() {
            return window.wx && window.wx.CLIENT_ENV === 'wechat';
        },
    },
    methods: {
    /**
     * openMenu 打开menu并且获取消息数量
     */
        openMenu() {
            // 获取首页数据，设置消息数量
            NetWork.request('message/unread_num', {}, (data) => {
                if (data.code === 0) {
                    this.unreadMsgCount = data.data;
                }
            });
            // 获取二维码数据
            this.get_qrcode().then((res) => {
                if (res) {
                    // 图标少于4个，菜单缩短
                    this.$nextTick(() => {
                        const menuItems = document.querySelectorAll('.menus li');
                        // this.isShortMenu = menuItems.length <= 3
                        if (menuItems && menuItems.length) {
                            const items = Array.from(menuItems).filter(
                                item => !item.style.display
                            );
                            this.isShortMenu = items.length <= 3;
                        }
                        this.isMenuShow = true;
                    });
                }
            });

            this.newDataUpPush('详情页_悬浮窗');
        },

        /**
     * hideMenu 关闭 menu
     */
        hideMenu() {
            this.isMenuShow = false;
        },

        /* 回到首页 */
        toHome() {
            navigateTo('/', true);
            this.newDataUpPush('详情页_悬浮窗_店铺主页');
        },

        /* 去我的页面 */
        toAccountCenter() {
            if ((this.subscribeConfig || {}).version_type === 9) {
                // 人人分销版本
                eJump.jump('/homepage/40');
            } else {
                // 其他版本
                navigateTo('/homepage/30', true);
            }
            this.newDataUpPush('详情页_悬浮窗_个人中心');
        },

        /* 去消息页面 */
        toMessagePage() {
            NetWork.request(
                '/message_showed',
                {
                    showed: true
                },
                (data) => {
                    console.log('消息置为已读');
                }
            );
            navigateTo('/homepage/20', true);
            this.newDataUpPush('详情页_悬浮窗_消息');
        },

        // 收藏|取消收藏
        toggleCollect() {
            if (this.isFavoriteStateChanging) {
                return;
            }
            // 获取连接参数的base64值
            const baseData = location.pathname.substring(
                location.pathname.lastIndexOf('/') + 1
            );
            const targetUrl = baseData;
            let params = {
                type: 1,
                content_type: this.resourceType,
                content_id: this.resourceId,
                target_url: targetUrl
            };

            if (this.isFavorite) {
                params = { del_list: [{ ...params }] };
            }

            const url = this.isFavorite
                ? '/favorite/del_favorite'
                : '/favorite/add_favorite';
            this.isFavoriteStateChanging = true;
            loading.show();
            NetWork.request(url, params, (data) => {
                if (data.code === 0) {
                    this.isFavorite ? toast('取消收藏成功') : toast('收藏成功');
                    this.$emit('changgeFavorite', this.isFavorite ? 0 : 1); // 点击收藏 去更改传入信息
                }
                this.isFavoriteStateChanging = false;
                loading.hide();
            });
            this.newDataUpPush(
                this.isFavorite ? '详情页_悬浮窗_已收藏' : '详情页_悬浮窗_收藏'
            );
            this.dataUpPush('product_collect');
        },
        openQrCodeModal() {
            if (this.showQrcodeIcon) {
                EventBus.$emit('showCodeAccount', {
                    code_img_url: this.subscribeConfig.wx_qr_url,
                    account_name: this.subscribeConfig.wx_app_name
                });
                this.hideMenu();
                this.newDataUpPush('详情页_悬浮窗_进入公众号');
            }
        },
        toCustomerService() { // 跳转小程序 联系客服
          navigateTo('/page/customerService/customerService')
        },
        dataUpPush(data) {
            const dataUpArr = {
                et: 1,
                sc: 2,
                cpg: '详情页',
                actn: data
            };
            try {
                window._YS_report.push([dataUpArr]);
            } catch (error) {
                console.log(error);
            }
        },
        // 颜值正义埋点上报
        newDataUpPush(data) {
            const dataUpArr = {
                et: 1,
                actn: data
            };
            try {
                window._YS_report.push([dataUpArr]);
            } catch (error) {
                console.log(error);
            }
        },
        /**
     * bindScrollEvent 滑动隐藏与收起
     */
        bindScrollEvent() {
            let scrollTimer = null;
            document.addEventListener(
                'scroll',
                () => {
                    this.isFold = true;
                    if (scrollTimer) {
                        window.clearTimeout(scrollTimer);
                        scrollTimer = null;
                    }
                    scrollTimer = setTimeout(() => {
                        this.isFold = false;
                    }, 100);
                },
                false
            );
        },

        /**
     * 获取二维码 (公众号号二维码在公共头部调用，并且已经做了本地缓存)
     */
        get_qrcode() {
            return new Promise((resolve, reject) => {
                let store_info = localStorage.getItem('store_info');
                store_info = JSON.parse(store_info);
                const url =
          this.resourceType == 4 ? '_alive/getSubscribedQr' : 'getSubscribedQr';
                // 有可能 请求回来存进去，但是appid没有存，导致有值但是获取不到取
                if (store_info && store_info[window.APPID]) {
                    this.subscribeConfig = {};
                    this.subscribeConfig.wx_qr_url = store_info[window.APPID].store_code;
                    this.subscribeConfig.wx_app_name =
            store_info[window.APPID].account_name;
                    this.subscribeConfig.version_type =
            store_info[window.APPID].version_type;
                    resolve(true);
                } else {
                    NetWork.request(
                        url,
                        {
                            app_id: window.APPID,
                            type: 1, // 支付和邀请码页面传0  顶部传1
                            resourceType: 0,
                            resourceId: ''
                        },
                        (data) => {
                            if (data && data.code === 0 && data.data) {
                                const subscribeConfig = data.data;
                                this.subscribeConfig = subscribeConfig;
                                resolve(true);
                            } else {
                                reject(false);
                            }
                        }
                    );
                }
            });
        },
        checkCustomer () {
          if(window.wx && window.wx.CLIENT_ENV === 'wx_miniProgram') {
            NetWork.request('mini_program_customer', {}, (res) => {
              if (res.code === 0) {
                  if (
                      res.data.customer_service_state &&
                      res.data.customer_position.good_detail
                  ) {
                      this.showContact = true;
                  }
              }
            });
          }
        }
    },

    mounted() {
        this.bindScrollEvent();
        this.checkCustomer();
    }
};
</script>

<style lang="scss">
.ss-float-menu {
  .btn-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    right: 0.32rem;
    bottom: 1.8rem;
    width: 0.88rem;
    height: 0.88rem;
    border-radius: 100%;
    background: #fff;
    box-shadow: 0rem 0.1rem 0.2rem 0rem rgba(0, 0, 0, 0.1);
    z-index: 4;
    opacity: 1;
    transition: all cubic-bezier(0.46, 0.03, 0.52, 0.96) 300ms;
    &.is-fold {
      opacity: 0.3;
    }
    img {
      width: 0.4rem;
      height: 0.4rem;
      user-select: none;
    }
  }

  @media (min-width: 480px) {
    .btn-menu {
      right: calc(50% - 240px + .32rem);
    }
  }

  .over-layer {
    position: fixed;
    width: 100%;
    height: 0%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 300ms;
    z-index: 6;
    &.is-show {
      opacity: 1;
      height: 100%;
    }
  }

  .container-menu {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background: #fff;
    opacity: 0;
    z-index: 10;
    margin: 0 auto;
    height: 0;
    width: 100%;
    max-width: 480px;
    transform: translate3d(0, 100%, 0);
    border-radius: 0.2rem 0.2rem 0rem 0rem;
    transition: all ease-in-out 300ms;
    &.is-show {
      height: 4.08rem;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    .menus {
      height: 3.06rem;
      width: 100%;
      font-size: 0.24rem;
      color: #4a4c5b;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding-top: 0.4rem;
      box-sizing: border-box;
      li {
        width: 33.33%;
        margin-bottom: 0.36rem;
        text-align: center;
        position: relative;
        img {
          width: 0.52rem;
          height: 0.52rem;
        }
        .tag-num {
          display: inline-block;
          position: absolute;
          left: 1.32rem;
          top: 0rem;
          color: #f2f2f8;
          padding: 0rem 0.1rem;
          background: #ff002a;
          border-radius: 0.16rem;
          border: 0.02rem solid #ffffff;
          line-height: 0.31rem;
          height: 0.28rem;
          min-width: 0.18rem;
          font-size: 0.22rem;
        }
      }
    }
    &.is-short-menu {
      height: 2.58rem;
      .menus {
        height: 1.56rem;
      }
    }
    .btn-close {
      font-size: 0.32rem;
      color: #666666;
      height: 1rem;
      line-height: 100%;
      text-align: center;
      border-top: 1px #f2f2f8 solid;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
