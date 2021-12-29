<template>
    <div class="marketing-buttons">
        <!-- 限时折扣按钮 -->
        <a
            v-if="isShowMarketingButton"
            class="btn btn-marketing"
            @click="marketingButton.onClick"
            :class="marketingButton.classes"
        >
            <div class="name">{{ marketingButton.btnName }}</div>
            <div  v-if='marketingButton.price' class="price">
                <span class="real-price">{{ marketingButton.price }}</span>
            </div>
        </a>
        <!-- 超级会员折扣按钮 -->
        <a
            v-if="isShowSuperVipDiscount"
            class="btn btn-super-vip"
            @click="superVipButton.onClick"
            :class="superVipButton.classes"
        >
            <div class="name">{{ superVipButton.btnName }}</div>
            <div  class="price">
                <span class="real-price">{{ superVipButton.price+'asd' }}</span>
                <span class="line-price" v-if="superVipButton.linePrice">{{
                    superVipButton.linePrice
                }}</span>
            </div>
        </a>
    </div>
</template>

<script>
import { handleOptimalCoupon } from "./couponPrice.js";
import Toast from '@/lib/toast.js';
import NetWork from '@/lib/network.js';
export default {
    props: {
        goodsInfo: {
            type: Object,
            required: true
        },
        marketingInfo: {
            type: Object,
            required: true
        },
        superVipInfo: {
            type: Object,
            required: true
        },
        onPayButtonClick: {
            type: Function,
            required: true
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
        // 券后价信息 code-1无券后价 code-0有券后价
        // 返回optimalCoupon isNeedGetCoupon
        // 券后价
        couponPrice() {
        // 是否开启券后价
        if(!this.myCouponList.display_deduct_price){
            return null
        }
        // 如果是超级会员会员商品 且是限时折扣 超级会员不支持叠加
        if(this.isVip && !this.isSuperVipUseCoupon){
            return null
        }
        // 超级会员价
        if(this.isShowSuperVipDiscount ){
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
            this.marketingInfo.rate_price,
            this.marketingInfo.rate_price,
            true
        );
        },
        // 是否需要领券
        isNeedGetCoupon(){
        return (this.couponPrice&&this.couponPrice.isNeedGetCoupon) && !this.isGetCouponBack
        },
        // 超级会员是否叠加优惠券
        isSuperVipUseCoupon(){
            return this.superVipInfo.is_coupons===1
        },
        // 是否展示超级会员折扣按钮，当价格高于营销价，接口层没有返回这个内容，后续可以优化
        isShowSuperVipDiscount() {
            // svip_state 开启状态 0-正常，1-停用，2-无开启
            // resource_rights_type 权益类型 0-无权益，1-免费权益，2-折扣权益
            // user_is_svip 是否超级会员 0-不是，1-是
            // svip_price < rate_price 超级会员价小于营销活动价
            return (
                this.superVipInfo.svip_state === 0 &&
                this.superVipInfo.user_is_svip === 1 &&
                this.superVipInfo.resource_rights_type === 2
            ) && this.superVipInfo.svip_price < this.marketingInfo.rate_price;
        },
        // 是否为超级会员商品且用户为超级会员
        isVip(){
            return (
                this.superVipInfo.svip_state === 0 &&
                this.superVipInfo.user_is_svip === 1 &&
                this.superVipInfo.resource_rights_type === 2
            )
        },
        // 是否展示限时折扣按钮
        isShowMarketingButton() {
            return !this.isShowSuperVipDiscount;
        },
        // 营销活动购买按钮
        marketingButton() {
            return {
                btnName: this.couponPrice?`${this.isNeedGetCoupon?'领券购买':"立即购买"}  券后 ¥${this.formatPrice(this.couponPrice.price)}`:"立即抢购",
                // price: this.couponPrice?this.formatPrice(this.couponPrice.price):'',
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
                }
            };
        },
        // 超级会员折扣按钮
        superVipButton() {
            return {
                btnName: this.couponPrice && this.isSuperVipUseCoupon?`${this.isNeedGetCoupon?'会员领券购买':"会员立即购买"} 券后`:"超级会员价",
                price:this.couponPrice && this.isSuperVipUseCoupon?this.formatPrice(this.couponPrice.price):this.formatPrice(this.superVipInfo.svip_price),
                linePrice: this.couponPrice && this.isSuperVipUseCoupon?'':this.formatPrice(this.goodsInfo.line_price),
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
                }
            };   
        }
    },
    methods: {
        formatPrice(price, uint = 100, fractionDigits = 2) {
            if (price) {
                return (price / uint).toFixed(fractionDigits);
            }
            return 0;
        },
        // 由于Toast 需要延迟执行下单操作
        async sleep() {
            return await new Promise((res, rej) => {
                setTimeout(() => {
                    res(true);
                }, 1000);
            });
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
    }
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
        font-family: 'PingFangSC-Medium', 'PingFang SC';
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
                &::before{
                    content: '¥';
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
        &.btn-marketing {
            background: #ff002a;
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
