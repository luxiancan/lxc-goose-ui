<template>
    <div class="marketing-buttons">
        <div v-if="remind" class="remind">{{ remind }}</div>
        <!-- 超级会员折扣按钮 -->
        <a
            v-if="isShowSuperVipDiscount"
            class="btn btn-super-vip"
            @click="superVipButton.onClick"
            :class="superVipButton.classes"
        >
            <div class="name">{{ superVipButton.btnName }}</div>
            <div  class="price">
                <span class="real-price">{{ superVipButton.price }}</span>
                <span class="line-price" v-if="superVipButton.linePrice">{{
                    superVipButton.linePrice
                }}</span>
            </div>
        </a>
        <!-- 原价购买按钮 -->
        <a
            v-if="isShowNormalButton"
            class="btn btn-normal"
            @click="normalButton.onClick"
            :class="normalButton.classes"
        >
            <div class="name">{{ normalButton.btnName }}</div>
            <div  class="price">
                <span class="real-price">{{ normalButton.price }}</span>
            </div>
        </a>
        <!-- 秒杀预约和购买按钮 -->
        <a
            v-if="isShowPreheatButton || isShowSecKillButton"
            class="btn btn-marketing is-multi-line"
            @click="marketingButton.onClick"
            :class="marketingButton.classes"
        >   
            <div class="name">{{ marketingButton.btnName }}</div>
            <div v-if="marketingButton.price" class="price">
                <span class="real-price">{{ marketingButton.price }}</span>
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
        // 是否展示超级会员折扣按钮，当价格高于营销价，接口层没有返回这个内容，后续可以优化
        isShowSuperVipDiscount() {
            // svip_state 开启状态 0-正常，1-停用，2-无开启
            // resource_rights_type 权益类型 0-无权益，1-免费权益，2-折扣权益
            // user_is_svip 是否超级会员 0-不是，1-是
            const usefulDiscount = (
                this.superVipInfo.svip_state === 0 &&
                this.superVipInfo.user_is_svip === 1 &&
                this.superVipInfo.resource_rights_type === 2
            );
            // 显示秒杀按钮必要条件
            const necessaryCondition = !!(
                this.marketingInfo.in_activity &&
                (!this.marketingInfo.show_subscribe || this.marketingInfo.user_subscribed) &&
                this.marketingInfo.has_stock
            );
            if (usefulDiscount && necessaryCondition && this.superVipInfo.svip_price >= this.marketingInfo.rate_price) {
                return false;
            }
            return usefulDiscount;
        },
        // 是否为超级会员商品且用户为超级会员
        isVip(){
            return (
                this.superVipInfo.svip_state === 0 &&
                this.superVipInfo.user_is_svip === 1 &&
                this.superVipInfo.resource_rights_type === 2
            )
        },
        // 是否展示预约按钮
        isShowPreheatButton() {
            // 预热中、开启秒杀预约、用户未预约
            return !!(
                this.marketingInfo.show_preheat &&
                this.marketingInfo.show_subscribe &&
                !this.marketingInfo.user_subscribed
            );
        },
        // 是否展示秒杀按钮
        isShowSecKillButton() {
            // 活动中、用户已预约（或者不需要预约）、还有库存
            return !!(
                this.marketingInfo.in_activity &&
                (!this.marketingInfo.show_subscribe || this.marketingInfo.user_subscribed) &&
                this.marketingInfo.has_stock
            ) && !this.isShowSuperVipDiscount;
        },
        // 是否展示原价按钮
        isShowNormalButton() {
            return !this.isShowSuperVipDiscount && !this.isShowSecKillButton;
        },
        // 原价购买按钮
        normalButton() {
            return {
                btnName: this.couponPrice?`${this.isNeedGetCoupon?'领券购买':"立即购买"}  券后`:"原价订购",
                price: this.couponPrice?this.formatPrice(this.couponPrice.price):this.formatPrice(this.goodsInfo.price),
                onClick: async () => {
                    if(this.isNeedGetCoupon){
                        this.getCouponItem(this.couponPrice.id,1)
                        return
                    }
                    if(this.couponPrice){
                        Toast('您已拥有最佳优惠券,下单立享')
                        await this.sleep()
                    }
                    this.onPayButtonClick('pay', {
                        isinitPricebuy: true
                    });
                },
                classes: { 'is-empty': this.isShowPreheatButton, 'is-multi-line': this.isShowPreheatButton }
            };
        },
        // 秒杀购买按钮&秒杀预约按钮
        marketingButton() {
            if (this.isShowSecKillButton) {
                return {
                    btnName: this.couponPrice?`${this.isNeedGetCoupon?'领券购买':"立即购买"}  券后 ¥${this.formatPrice(this.couponPrice.price)}`:"立即抢购",
                    // price: this.formatPrice(this.marketingInfo.rate_price),
                    onClick: async () => {
                        if(this.isNeedGetCoupon){
                        this.getCouponItem(this.couponPrice.id,2)
                        return
                        }
                        if(this.couponPrice){
                            Toast('您已拥有最佳优惠券,下单立享')
                            await this.sleep()
                        }
                        this.onPayButtonClick('pay');
                    }
                };
            } else if (this.isShowPreheatButton) {
                return {
                    btnName: '预约获得秒杀资格',
                    // price: this.formatPrice(this.marketingInfo.rate_price),
                    onClick: () => {
                        if (this.marketingInfo.is_subscribed) { 
                            this.onPayButtonClick('subscribeSecKill', {
                                activityId: this.marketingInfo.activity_id
                            });
                        } else {
                            this.onPayButtonClick('subscribeWxAccount');
                        }
                    },
                };
            }
            return null;
        },
        // 超级会员折扣按钮
        superVipButton() {
            return {
                btnName: this.couponPrice && this.isSuperVipUseCoupon?`${this.isNeedGetCoupon?'会员领券购买':"会员立即购买"}  券后`:"超级会员价",
                price: this.couponPrice && this.isSuperVipUseCoupon?this.formatPrice(this.couponPrice.price):this.formatPrice(this.superVipInfo.svip_price),
                linePrice: this.couponPrice && this.isSuperVipUseCoupon?'':this.formatPrice(this.goodsInfo.line_price),
                classes: { 'is-multi-line': this.isShowPreheatButton || this.isShowSecKillButton },
                onClick: async () => {
                    
                    if(this.isNeedGetCoupon){
                        this.getCouponItem(this.couponPrice.id,1)
                    return
                    }
                    if(this.couponPrice){
                        Toast('您已拥有最佳优惠券,下单立享')
                        await this.sleep()
                    }
                    this.onPayButtonClick('pay');
                }
            };
        },
        // 秒杀提示栏
        remind() {
            // 预热中、可预约、已预约
            if (
                this.marketingInfo.show_preheat &&
                this.marketingInfo.show_subscribe &&
                this.marketingInfo.user_subscribed
            ) {
                return '您已成功预约，活动暂未开始，土豪也可原价订阅噢';
                // 活动中、可预约、未预约
            } else if (
                this.marketingInfo.in_activity &&
                this.marketingInfo.show_subscribe &&
                !this.marketingInfo.user_subscribed
            ) {
                return '您未预约此活动，不能参与秒杀，下次记得预约噢';
                // 活动中、无库存
            } else if (this.marketingInfo.in_activity && !this.marketingInfo.has_stock) {
                return '哎呀，秒杀量已被抢完啦！';
            }
            return '';
        },
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
            false,
        );
        }
        // 秒杀价
        if(this.isShowSecKillButton){
            return handleOptimalCoupon(
            this.myCouponList.coupon_list,
            this.couponList,
            this.marketingInfo.rate_price,
            this.marketingInfo.rate_price,
            true,
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
        return (this.couponPrice&&this.couponPrice.isNeedGetCoupon)&& !this.isGetCouponBack
        },
        // 超级会员是否叠加优惠券
        isSuperVipUseCoupon(){
        return this.superVipInfo.is_coupons===1
        },
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
        // 领取优惠券 1-原价购买 
        async getCouponItem(id,num) {
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
                    this.payClick(num);
                }else{
                  this.payClick(num);
                }
            }
        )
        },
        payClick(num){
            if(num===1){
                this.onPayButtonClick('pay', {
                        isinitPricebuy: true
                });
            }
            if(num===2){
                this.onPayButtonClick('pay');
            }

        }
    }
};
</script>

<style lang="scss" scoped>
$marketing-default-color: #ff002a;
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
        &.btn-normal {
            background: $marketing-default-color;
            font-size: 0.28rem;
            &.is-empty {
                background-color: #fff;
                color: $marketing-default-color;
                border: 1px $marketing-default-color solid;
                .price {
                    color: $marketing-default-color;
                }
            }
        }

        &.btn-marketing {
            background: $marketing-default-color;
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
    .remind {
        position: absolute;
        height: 0.68rem;
        left: 0;
        right: 0;
        z-index: 1;
        bottom: 100%;
        background: #fbf5ec;
        color: #ffb04f;
        font-size: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
