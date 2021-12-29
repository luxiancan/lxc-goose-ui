<template>
  <div :class="['service-mask', {'transition': showCustomer} ]">
    <div class="service-wrapper">
      <div class="service-container">
        <div class="service-title">联系客服</div>
        <i class="iconfont icon-danchuang-guanbi close-notice" @click.stop="closeService"></i>
        <!-- 客服热线 -->
        <div v-if="customerData.contact_type.includes('PHONE')" class="phone-container">
          <div class="phone-title">您可以拨打客服热线</div>
          <div class="phone theme-customize-font">
            <i class="iconfont icon-phone_icon1 phone-call theme-customize-font"></i>
            <div class="phone-number">
              <a class="theme-customize-font" :href="'tel:' + customerData.phone">{{customerData.phone}}</a>
            </div>
          </div>
        </div>
        <!-- 二维码 -->
        <div v-if="customerData.contact_type.includes('WECHAT')" class="code-container">
          <div class="wechat-title">
            {{ customerData.contact_type.includes('PHONE') ? "或者" : "" }}{{ imgSaveTips }}
          </div>
          <img :src="customerData.wechat_img_url" alt="" class="qrcode" />
        </div>
        <div class="tips" v-if="customerData.tips">{{ customerData.tips }}</div>
      </div>
    </div>
    <div class="shade-box" @click.stop="closeService"></div>
  </div>
</template>
<script>
import NetWork from '@/lib/network';
import { navigateTo } from '../../../libEntry/install/func-tool/index.js';
export default {
  name: 'SsCustomerService',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    entryType: {
      type: String,
      default: ''
    },
    customerItem: {
      default: () => null
    }
  },
  data() {
    return {
      showCustomer: false,
      customerData: {
        contact_type: [],
        enable: 0,
        entry_type: [],
        guide_jump_url: '',
        guide_type: 0,
        phone: '',
        tips: '',
        wechat_img_url: '',
        wxMiniProgramCustomer: false
      }
    };
  },
  computed: {
    imgSaveTips() {
      let tips = '长按扫码添加客服微信';
      if (window.wx && window.wx.CLIENT_ENV !== 'wechat') {
        tips = '扫码添加客服微信';
      }
      return tips;
    }
  },
  created() {
    if(window.wx && window.wx.CLIENT_ENV === 'wx_miniProgram') {
      this.checkCustomer();
    } else if (this.customerItem) {
      this.customerData = this.customerItem;
    } else {
      this.getCustomerData();
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.wxMiniProgramCustomer) { // 小程序开启客服时 跳小程序客服
          navigateTo('/page/customerService/customerService');
        } else if (this.customerData.guide_type == 0) {
          this.showCustomer = true;
        } else {
          this.closeService();
          if (this.customerData.guide_jump_url.indexOf('://') == -1) {
            window.location.href = `//${this.customerData.guide_jump_url}`;
          } else {
            window.location.href = this.customerData.guide_jump_url;
          }

          // window.open(this.customerData.guide_jump_url);
        }
      } else {
        this.showCustomer = false;
      }
    }
  },
  methods: {
    checkCustomer () {
      NetWork.request('mini_program_customer', {}, (res) => {
        if (res.code === 0) {
            if (
                res.data.customer_service_state &&
                res.data.customer_position.good_detail
            ) {
                this.wxMiniProgramCustomer = true;
                this.$emit('isShowService', true);
            } else {
              this.$emit('isShowService', false);
            }
        }
      });
    },
    closeService() {
      // this.showCustomer = false;
      // this.$emit('closeService');
      this.$emit('update:visible', false);
    },
    getCustomerData() {
      NetWork.request(
        'shop_conf/get_shop_module_conf',
        {
          modules: ['guideContact']
        }, (data) => {
          if (data.code === 0) {
            this.customerData = data.data;
            const isShowService = this.customerData.enable === 1 && this.customerData.entry_type.includes(this.entryType)
            this.$emit('isShowService', isShowService)
          } else {
            this.$emit('isShowService', false)
          }
        }
      )
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.service-mask {
  display: none;
  &.transition {
    animation: opacity 0.5s;
    display: block;
  }
  .service-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 13;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 0.16rem;
    overflow: hidden;
    width: 5.9rem;
    .service-container {
      padding: 0.64rem 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      .service-title{
        font-weight: 500;
        font-size: 0.36rem;
        color: #333;
        line-height:0.5rem;
      }
      .close-notice {
        font-size: 0.24rem;
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        color: #bfbfbf;
      }
      .phone-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 0.64rem;
        .phone-title{
          font-weight: 400;
          font-size: 0.32rem;
          color: #333;
        }
        .phone {
          display: flex;
          align-items: center;
          .phone-call {
            color: #09BB07;
            font-size: 0.32rem;
            margin-right: 0.08rem;
          }
          .phone-number{
            font-size: 0.32rem;
            line-height: 0.44rem;
            a{
              color: #09BB07;
              text-decoration:none;
            }
          }
        }
      }
      .code-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 0.64rem;
        .wechat-title{
          line-height:0.44rem;
          font-weight: 400;
          font-size: 0.32rem;
          color: #333;
        }
        .qrcode {
          display: block;
          width: 2.8rem;
          height: 2.8rem;
          margin-top: 0.16rem;
        }
      }
      .tips {
        width: 3.2rem;
        line-height:0.36rem;
        margin-top: 0.48rem;
        text-align: center;
        font-size: 0.24rem;
        color: #666;
        font-weight: 400;
        word-break:break-all;
        white-space: pre-wrap;
      }
    }
  }
  .shade-box{
    position: fixed;
    z-index: 12;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
    width: 100%;
    height: 100%;
    background: #000000;
    opacity:0.5;
  }
}
</style>
