<template>
    <div class="live-marketing" v-if="!doneBought">
        <!-- 限时优惠 -->
        <limit-discount v-if="showLimitDiscount" :limitDiscountInfo="marketingInfo[Type['LIMITDISCOUNT']]"></limit-discount>
        <!-- 秒杀 -->
        <seckill v-if="seckillExist && showSeckill" :seckillInfo="marketingInfo[Type['SECKILL']]"></seckill>
        <!-- 砍价、减学费 -->
        <cut-price v-if="showCutPrice" :cutPriceInfo="marketingInfo[Type['CUTPRICE']]"></cut-price>
    </div>
</template>

<script>
import LimitDiscount from './components/limitDiscount';
import Seckill from './components/seckill';
import cutPrice from './components/cutPrice';

export default {
    name: 'LiveMarketing',
    components: {
        LimitDiscount,
        Seckill,
        cutPrice
    },
    props: {
        marketingData: {
            type: Object,
            default: {}
        }
    },
    filters: {},
    data() {
        return {
            Type: {
                SECKILL: '8',
                CUTPRICE: '10',
                LIMITDISCOUNT: '3'
            }
        };
    },
    computed: {
        marketingInfo() {
            return this.marketingData.marketing_activity.marketing_info
        },
        // 已经购买了
        doneBought() {
            return Boolean(this.marketingData.available_info.has_buy);
        },
        showSeckill() {
            return this.marketingInfo[this.Type['SECKILL']]
            && ((!this.marketingInfo[this.Type['SECKILL']].in_activity && this.marketingInfo[this.Type['SECKILL']].show_preheat) 
            || this.marketingInfo[this.Type['SECKILL']].in_activity);
        },
        seckillExist() {
            return this.marketingInfo[this.Type['SECKILL']] && !(this.marketingInfo[this.Type['SECKILL']].show_subscribe && !this.isWeChat());
        },
        showCutPrice() {
            return this.marketingInfo[this.Type['CUTPRICE']] 
            && this.marketingInfo[this.Type['CUTPRICE']].in_activity;
        },
        showLimitDiscount() {
            return Boolean(this.marketingInfo[this.Type['LIMITDISCOUNT']]);
        },
    },
    mounted() {},
    methods: {
        // 是否是微信浏览器
        isWeChat() {
            const UA = window.navigator.userAgent.toLowerCase();
            return UA && UA.indexOf('micromessenger') > -1;
        },
    },
    beforeDestroy() {}
};
</script>

<style lang="scss" scoped>

</style>
