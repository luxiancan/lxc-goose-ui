<template>
  <div class="marketing-buttons">
    <!-- 原价按钮 -->
    <a
      v-if="isShowNormalButton"
      class="btn btn-normal theme-customize-bg theme-customize-font-black"
      @click="normalButton.onClick"
      :class="normalButton.classes"
    >
      <div class="name">{{ normalButton.btnName }}</div>
      <div  class="price">
        <span
          class="real-price theme-customize-bg theme-customize-font-black"
          >{{ normalButton.price }}</span
        >
        <span
          class="line-price theme-customize-bg theme-customize-font-black"
          v-if="normalButton.linePrice"
          >{{ normalButton.linePrice }}</span
        >
      </div>
    </a>
    <!-- 超级会员折扣按钮&超级会员免费按钮  -->
    <a
      v-if="isShowSuperVipDiscount || isShowSuperVipFree"
      class="btn btn-super-vip"
      @click="superVipButton.onClick"
      :class="superVipButton.classes"
    >
      <div class="name">{{ superVipButton.btnName }}</div>
      <div  class="price" v-if="isShowSuperVipDiscount">
        <span class="real-price" >{{
          superVipButton.price
        }}</span>
        <span class="line-price" v-if="superVipButton.linePrice">{{
          superVipButton.linePrice
        }}</span>
      </div>
    </a>
  </div>
</template>

<script>
// 普通底部状态栏
//
import { handleOptimalCoupon } from "./couponPrice.js";
import Toast from '@/lib/toast.js';
import NetWork from '@/lib/network.js';
export default {
  props: {
    goodsInfo: {
      type: Object,
      required: true,
    },
    superVipInfo: {
      type: Object,
      required: true,
    },
    // marketingInfo: {
    //     type: Object,
    //     required: true
    // },
    onPayButtonClick: {
      type: Function,
      required: true,
    },
    couponList:{
      type:Array,
      required:true
    },
    myCouponList:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      // 是否已经领券
      isGetCouponBack:false
    }
  },
  computed: {
    // 是否展示超级会员折扣按钮
    isShowSuperVipDiscount() {
      // svip_state 开启状态 0-正常，1-停用，2-无开启
      // resource_rights_type 权益类型 0-无权益，1-免费权益，2-折扣权益
      // user_is_svip 是否超级会员 0-不是，1-是
      // svip_price < rate_price 超级会员价小于原价（后端逻辑如此，前端做多一层判断）
      return (
        this.superVipInfo.svip_state === 0 &&
        this.superVipInfo.resource_rights_type === 2
      );
    },
    // 是否展示超级会员免费按钮
    isShowSuperVipFree() {
      // svip_state 开启状态 0-正常，1-停用，2-无开启
      // resource_rights_type 权益类型 0-无权益，1-免费权益，2-折扣权益
      // user_is_svip 是否超级会员 0-不是，1-是
      return (
        this.superVipInfo.svip_state === 0 &&
        this.superVipInfo.user_is_svip === 0 &&
        this.superVipInfo.resource_rights_type === 1
      );
    },
    // 是否展示原价按钮
    isShowNormalButton() {
		return !(this.superVipInfo.user_is_svip === 1 && this.isShowSuperVipDiscount);
    },
    // 券后价
    couponPrice() {
      // 是否开启券后价
      if(!this.myCouponList.display_deduct_price){
        return null
      }
      console.log(555,this.superVipInfo.svip_price,this.goodsInfo.price)
      // 超级会员价
      if(this.isShowSuperVipDiscount || this.isShowSuperVipFree){
        return handleOptimalCoupon(
        this.myCouponList.coupon_list,
        this.couponList,
        this.superVipInfo.svip_price,
        this.superVipInfo.svip_price,
        false
      );
      }
      return handleOptimalCoupon(
        this.myCouponList.coupon_list,
        this.couponList,
        this.goodsInfo.price,
        this.goodsInfo.price,
        false
      );
    },
    // 是否需要领券
    isNeedGetCoupon(){
      return (this.couponPrice && this.couponPrice.isNeedGetCoupon) && !this.isGetCouponBack
    },
    // 超级会员是否叠加优惠券
    isSuperVipUseCoupon(){
      return this.superVipInfo.is_coupons===1
    },
    // 原价按钮
    normalButton() {
      return {
        btnName: this.couponPrice?`${this.isNeedGetCoupon?'领券购买':"立即购买"}  券后`:"购买",
        price: this.couponPrice?this.formatPrice(this.couponPrice.price):this.formatPrice(this.goodsInfo.price),
        linePrice: this.couponPrice?'':this.formatPrice(this.goodsInfo.line_price),
        classes: { "is-multi-line": this.isShowSuperVipFree || this.isShowSuperVipDiscount },
        onClick: async () => {
            if(this.isNeedGetCoupon){
              this.getCouponItem(this.couponPrice.id)
              return
            }
            if(this.couponPrice){
              Toast('您已拥有最佳优惠券,下单立享')
              await this.sleep()
            }
            this.onPayButtonClick("pay");
        },
      };
    },
    // 超级会员按钮
    superVipButton() {
      // 超级会员免费按钮
      if (this.isShowSuperVipFree) {
        return {
          btnName: "超级会员免费学",
          onClick: () => {
            this.goVipDetailPage();
          },
        };
      } else {
        // 超级会员折扣按钮
        return {
          btnName: this.couponPrice && this.isSuperVipUseCoupon?`${this.isNeedGetCoupon?'会员领券购买':"会员立即购买"}  券后`:"超级会员价",
          price: this.couponPrice && this.isSuperVipUseCoupon?this.formatPrice(this.couponPrice.price):this.formatPrice(this.superVipInfo.svip_price),
          linePrice: this.couponPrice && this.isSuperVipUseCoupon?'':this.formatPrice(this.goodsInfo.line_price),
          classes: { "is-multi-line": this.isShowNormalButton },
          onClick: async () => {
            if(this.superVipInfo.user_is_svip === 0) {
            	this.goVipDetailPage();
				return;
            }
            if(this.isNeedGetCoupon){
              this.getCouponItem(this.couponPrice.id)
              return
            }
            if(this.couponPrice){
              Toast('您已拥有最佳优惠券,下单立享')
              await this.sleep()
            }
            this.onPayButtonClick("pay");
          },
        };
      }
    },
  },
  methods: {
    formatPrice(price, uint = 100, fractionDigits = 2) {
      if (price ) {
        return (price / uint).toFixed(fractionDigits);
      }
      return 0;
    },
    // 领取优惠券
    async getCouponItem(id) {
        let that = this;
        let url = 'addMyCoupon/v3';
        let params = {
            id
        };
        Toast('已为您领取优惠券,下单更优惠');
        await NetWork.request(
            url,
            params,res => {
                if (res.code === 0) {
                    that.isGetCouponBack = true;
                    this.onPayButtonClick("pay");
                }else{
                  this.onPayButtonClick("pay");
                }
            }
        )
      },
    // 由于Toast 需要延迟执行下单操作
    async sleep() {
        return await new Promise((res, rej) => {
            setTimeout(() => {
                res(true);
            }, 1000);
        });
    },
	// 跳转超级会员详情页
	goVipDetailPage() {
		let url = this.superVipInfo.jump_url || "";
		if (url.indexOf("?") > -1) {
			url = `${url}&fromResDetail=${window.location.href}`;
		} else {
			url = `${url}?fromResDetail=${window.location.href}`;
		}
		window.location.href = url;
	}
  },
};
</script>

<style lang="scss" scoped>
.marketing-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  .btn {
    height: 0.76rem;
    flex: 1;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 0.38rem;
    line-height: 100%;
    background: #09bb07;
    font-family: "PingFangSC-Medium", "PingFang SC";
    font-weight: 500;
    .name + .price {
      margin-left: 0.08rem;
    }
    .price {
      height: 0.28rem;
      span {
        display: inline-block;
      }
      .real-price {
        &::before {
          content: "¥";
          font-size: 0.16rem;
        }
      }
      .line-price {
        margin-left: 0.08rem;
        font-size: 0.24rem;
        opacity: 0.7;
        text-decoration: line-through;
      }
    }
    &.is-multi-line {
      flex-direction: column;
      .price {
        font-size: 0.22rem;
        color: #ffffff;
        margin-left: 0;
        line-height: 100%;
        margin-top: 0.06rem;
      }
    }
    &.btn-normal {
      font-size: 0.28rem;
    }
    &.btn-super-vip {
      background: linear-gradient(314deg, black 0%, #424242 100%);
      .name,
      .price,
      .price .real-price {
        background-image: linear-gradient(136deg, #ffe6ad 0%, #dbaf4d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        .line-price {
          opacity: 1;
          -webkit-text-fill-color: rgba(219, 175, 77, 0.4);
        }
      }
      .name {
        transform: scale(0.99);
      }
    }
  }
  .btn + .btn {
    margin-left: 0.16rem;
  }
}
</style>
