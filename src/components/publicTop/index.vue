<template>
  <div class="public-top-wrap" v-if="!isWxWorkEnv && SDKConf.is_show_nav  && !isXiaoeAppH5">
    <div class="public-top" :class="{ 'is-fixed': isFixed }">
      <div @click="toHome" class="x-home">
        <img class="public-top-icon" :src="shoplogo"/>
        <span class="x-title" v-text="store_name"></span>
      </div>
      <div class="x-menu">
        <img
          @click="search"
          class="public-top-icon"
          src="@/assets/images/publicTop/search.png"
        />
        <!-- 非微信终端隐藏收藏 -->
        <a
          @click="attention"
          v-if="isShowAttentionLink"
          class="public-top-link"
        >
          {{ word }}
        </a>
        <div
          class="divide"
          v-if="isShowAttentionLink"
        ></div>
        <a @click="hasBuy" class="public-top-link">
          {{ textUserCenter }}
        </a>
      </div>
    </div>

    <attention_code></attention_code>
    <collect_hint></collect_hint>

    <wx_share_mask/>
  </div>
</template>

<script>
import EventBus from '@/lib/eventbus.js';
import NetWork from '@/lib/network.js';
import eJump from '@/lib/eJump.js';
import attention_code from './components/attention_account_code.vue';
import collect_hint from './components/collect_hint.vue';
import wx_share_mask from './components/wx_share_mask.vue';

import initAppSDK from '../../mixins/initAppSDK';

export default {
    mixins: [initAppSDK],
    props: {
        isFixed: {
            type: Boolean,
            default: true
        },
        fromLive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            store_code: '', // 二维码图片
            account_name: '', // 公众号名称
            store_name: '', // 店铺名称
            app_id: window.APPID, // 店铺ID
            word: '', // 关注/收藏
            can_attention: true, // 是否可以关注
            is_shi_dian: true,
            shoplogo:
        'http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS05MTk1MzIxNg.png', // 店铺logo
            isToTopBtnShow: false,
            shopVersion: '', // 店铺类型
        };
    },
    created() {
        const that = this;
        if (window.APPID != 'appuAhZGRFx3075') {
            this.is_shi_dian = false;
        }
        // 设置5分钟的过期 5*60*1000
        this.setStoreOutTime(300000);

        this.bindScrollEvent();

        // 人人分销流量统计 1-详情页-在这里统计是因为公共头部组件 ，9-是新增的人人分销店铺类型
        if (parseInt(this.shopVersion) === 9) {
            NetWork.request('set.market.unique.visitor', { origin: 1 });
        }
        console.log('---------isCompany', this.isCompany);
    },
    computed: {
    // 是否企业微信，颜值五期需求：企业微信不显示顶部栏
        isWxWorkEnv() {
            const UA = window.navigator.userAgent.toLowerCase();
            return UA && UA.indexOf('wxwork') > -1;
        },
        // 是否是微信
        isWeChatEnv() {
            return window.wx && window.wx.CLIENT_ENV === 'wechat';
        },
        isShowAttentionLink() {
            return this.isWeChatEnv && this.can_attention && !this.isSmartCampus;
        },
        isCompany() {
            // 判断是否是企业学院
            let storeInfo = localStorage.getItem('store_info');
            storeInfo = JSON.parse(storeInfo);
            console.log('---------localStorage', storeInfo);
            if (
                storeInfo &&
        storeInfo[window.APPID] &&
        (storeInfo[window.APPID].version_type == 170 ||
          storeInfo[window.APPID].version_type == 171)
            ) {
                return true;
            } else {
                return false;
            }
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
        // 是否小鹅通助手APP内嵌H5
        isXiaoeAppH5() {
            const UA = window.navigator.userAgent.toLowerCase();
            return UA && UA.indexOf('xiaoehelperapp') > -1;
        },

    },
    methods: {
        /* 是否url格式 */
        isUrlValid(userInput) {
            const res = userInput.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            return !!res;
        },
        /* 获取店铺导航信息 */
        getStoreInfo() {
            const check = this.getSoreStorage(); // 先从缓存取
            const that = this;
            const url = this.fromLive ? '_alive/getSubscribedQr' : 'getSubscribedQr';
            NetWork.request(
                url,
                {
                    app_id: window.APPID,
                    type: 1, // 支付和邀请码页面传0  顶部传1
                    resourceType: 0,
                    resourceId: ''
                },
                (data) => {
                    if (data) {
                        // 兼容为字符串形式的返回
                        let resData = data;
                        if (typeof resData == 'string') {
                            resData = JSON.parse(resData);
                        }
                        if (resData.code === 0 && resData.data) {
                            const subscribeConfig = resData.data;

                            if (subscribeConfig.wx_qr_url) {
                                that.store_code = subscribeConfig.wx_qr_url;
                                that.account_name = subscribeConfig.wx_app_name;
                                that.word = '关注';
                                that.can_attention = true;
                            } else {
                                that.word = '收藏';
                                that.store_code = '';
                                that.account_name = '';
                                that.can_attention = false;
                            }
                            // 判断logo字段是否为正确的url地址,不是则重新改写默认logo
                            if (this.isUrlValid(subscribeConfig.shop_logo || '')) {
                                that.shoplogo = subscribeConfig.shop_logo;
                            }

                            EventBus.$emit('store_qr_code', subscribeConfig);

                            that.shopVersion = subscribeConfig.version_type;

                            that.store_name = subscribeConfig.home_title;

                            that.setStoreStorage(check.type);
                        }
                    }
                }
            );
        },
        /**
     * 设置店铺信息缓存
     * params:
     *  sign: true 存在缓存，false 不存在缓存
     */
        setStoreStorage(sign) {
            let store_info = {};

            if (sign) {
                // 存在缓存，则更新
                store_info = localStorage.getItem('store_info');
                store_info = JSON.parse(store_info);
            }

            store_info[this.app_id] = {
                store_code: this.store_code,
                store_name: this.store_name,
                shop_logo: this.shoplogo,
                version_type: this.shopVersion,
                account_name: this.account_name
            };
            // 获取时设置当前时间数，便于设置过期时间
            const curTime = new Date().getTime();
            store_info.time = curTime;

            localStorage.setItem('store_info', JSON.stringify(store_info));
        },

        /* 获得缓存店铺信息 */
        getSoreStorage() {
            const that = this;
            let store_info = localStorage.getItem('store_info');
            if (store_info === null) {
                // 无此缓存
                return {
                    has_storage: false,
                    type: 0 // 无此缓存
                };
            } else {
                store_info = JSON.parse(store_info);
                const the_store_info = store_info[this.app_id];
                if (the_store_info) {
                    that.store_code = the_store_info.store_code; // 二维码
                    that.store_name = the_store_info.store_name; // 店铺名称
                    that.shoplogo = the_store_info.shop_logo; // 店铺logo
                    that.shopVersion = the_store_info.version_type; // 店铺版本
                    that.account_name = the_store_info.account_name; // 店铺名称
                    if (!that.store_code) {
                        that.word = '收藏';
                        that.can_attention = false;
                    } else {
                        that.word = '关注';
                        that.can_attention = true;
                    }
                    return {
                        has_storage: true,
                        type: 1 // 有缓存
                    };
                } else {
                    // 缓存中无此店铺
                    return {
                        has_storage: false,
                        type: 1 // 有缓存（缓存中无此店铺）
                    };
                }
            }
        },
        // 设置localstorge的过期时间
        setStoreOutTime(exp) {
            const check = this.getSoreStorage(); // 先从缓存取
            // 有缓存，拿存储时间与当前时间比较，没缓存重新新请求
            if (check.has_storage) {
                let store_info = localStorage.getItem('store_info');
                store_info = JSON.parse(store_info);
                //  time不存在，重新请求
                if (!store_info.time || !store_info[this.app_id].shop_logo) {
                    console.log('测试重新请求');
                    this.getStoreInfo();
                }

                if (store_info.time !== null) {
                    //  过期了，重新请求
                    if (new Date().getTime() - store_info.time > exp) {
                        this.getStoreInfo();
                    }
                }
            } else {
                this.getStoreInfo();
            }
        },
        /* 关注 */
        attention() {
            if (this.can_attention) {
                EventBus.$emit('showCodeAccount', {
                    code_img_url: this.store_code,
                    account_name: this.account_name
                });
                // 兼容安卓视频层级最高
                // EventBus.$emit('is_show_detail_video', false);
                const isAndroid =
          window.navigator.userAgent.indexOf('Android') > -1 ||
          window.navigator.userAgent.indexOf('Adr') > -1;
                if (isAndroid) {
                    EventBus.$emit('isAttention', true);
                }
                this.newDataUpPush('H5顶部导航_关注');
            } else {
                // 弹出收藏层
                EventBus.$emit('alert_collect_hint');
            }
            this.dataUpPush('top_QRcode');
        },

        /* 回到首页 */
        toHome() {
            try {
                event_report('header_homepage');
                console.log('header_homepage');
            } catch (e) {
                console.log(e);
            }
            this.newDataUpPush('H5顶部导航_首页');
            this.dataUpPush('top_storeName');
            eJump.jump('/homepage');
        },

        /* 去我的页面 */
        hasBuy() {
            try {
                event_report('header_mine');
                console.log('header_mine');
            } catch (e) {
                console.log(e);
            }
            this.dataUpPush('top_account');
            this.newDataUpPush('H5顶部导航_个人中心');
            // 9-是新增的人人分销店铺类型
            if (this.shopVersion == 9) {
                // 人人分销版本
                eJump.jump('/homepage/40');
            } else {
                // 其他版本
                eJump.jump('/homepage/30');
            }
        },

        /* 去搜索页 */
        search() {
            try {
                event_report('header_search');
                console.log('header_search');
            } catch (e) {
                console.log(e);
            }
            this.newDataUpPush('H5顶部导航_搜索');
            this.dataUpPush('top_search');
            // 企学院非微信终端去当前域名搜索页面
            if (this.isCompany || !this.isWeChatEnv) {
                // 兼容企业学院的跳转，企学院直接跳转当前域名下的搜索页面
                const url = `${window.location.origin}/${this.app_id}/search`;
                eJump.jump(url);
            } else {
                eJump.jump('/search');
            }
        },
        // 滑动隐藏与收起
        bindScrollEvent() {
            // let scrollTopLast = document.documentElement.scrollTop || document.body.scrollTop;
            window.addEventListener('scroll', () => {
                const scrollTopNow =
          document.documentElement.scrollTop || document.body.scrollTop;
                // 回到顶部按钮是否展示
                const bodyClientHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
                if (scrollTopNow > bodyClientHeight) {
                    this.isToTopBtnShow = true;
                } else {
                    this.isToTopBtnShow = false;
                }
            });
        },
        toTop() {
            window.scrollTo(0, 0);
        },
        dataUpPush(data) {
            const dataUpArr = {
                et: 1,
                sc: 2,
                cpg: '详情页',
                actn: data
            };
            window._YS_report.push([dataUpArr]);
        },
        // 颜值正义埋点上报
        newDataUpPush(data) {
            const dataUpArr = {
                et: 1,
                actn: data
            };
            window._YS_report.push([dataUpArr]);
        }
    },
    components: {
        attention_code,
        collect_hint,
        wx_share_mask // 从人人分销市场-来引导用户分享购买
    }
};
</script>

<style lang="scss" scoped>
.public-top-wrap {
  position: relative;
  height: 0.92rem;
  z-index: 10;
}

.public-top {
  background: #fff;
  box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.05);
  left: 0;
  top: 0;
  width: 100%;
  height: 0.92rem;
  padding: 0 0.32rem;
  font-size: 0;
  overflow: hidden;
  z-index: 1;
  box-sizing: border-box;
  transition: transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.is-fixed {
    position: fixed;
  }

  &.public-top__hide {
    transform: translateY(-45px);
  }
}

.x-home {
  float: left;
  display: flex;
  align-items: center;

  .x-title {
    display: inline-block;
    line-height: 0.44rem;
    max-width: 2.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
    margin: 0.02rem 0 0 0.16rem;
    color: #030303;
    font-size: 0.28rem;
  }

  .public-top-icon {
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e2e2e2;
    padding: 0;
  }
}

.x-menu {
  float: right;
  font-size: 0;
  display: flex;
  align-items: center;

  .public-top-icon {
    margin: 0 0 0 0.36rem;
  }

  .public-top-link {
    padding: 0 0.16rem;
    font-size: 0.26rem;
    color: #4a4c5b;
    cursor: pointer;
  }

  .divide {
    height: 0.24rem;
    width: 1px;
    display: inline-block;
    background: #c8c8c8;
  }
}

.public-top-icon {
  display: inline-block;
  width: 0.48rem;
  height: 0.48rem;
  vertical-align: top;
  padding: 0.08rem;
  box-sizing: border-box;
  cursor: pointer;
}

.to-top {
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 0.16rem;
  bottom: 3.2rem;
  width: 0.8rem;
  height: 0.8rem;
  text-align: center;
  border: 0.02rem solid #b2b2b2;
  background: #fff;
  z-index: 10;
  border-radius: 50%;

  &.to-top__show {
    display: flex;
  }

  .to-top-img {
    height: 0.5rem;
  }
}
</style>
