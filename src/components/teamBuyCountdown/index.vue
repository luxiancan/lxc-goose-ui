<template>
    <teambuy
        v-if="showTeambuyActivity"
        :price="price"
        :line-price="linePrice"
        :start-time="startTime"
        :end-time="endTime"
        :multiplePrice="multiPrice"
        :label="teambuyLabel"
        @countdown-end="onCountdownEnd"
    ></teambuy>
</template>

<script>
import Teambuy from '../teambuy';

export default {
    name: 'teamBuyCountdown',
    props: {
        marketingData: {
            type: Object,
            default: {}
        }
    },
    components: {
        Teambuy
    },
    data() {
        return {
            teamBuyType: '6'
        };
    },
    computed: {
        showTeambuyActivity() {
            return !this.marketingData.available_info.has_buy && JSON.stringify(this.teambuyInfo) !== '[]'
        },
        teambuyInfo() {
            return this.marketingData.marketing_activity.marketing_info[this.teamBuyType];
        },
        countdownLabel() {
            return this.isPreheat ? '距开始还有' : '距结束仅剩';
        },
        teambuyLabel() {
            // team_type 0 => 普通团    team_type 1 => 阶梯团
            return this.teambuyInfo?.team_type ? '人多更优惠' : `${this.teambuyInfo?.sum_num}人拼团价`;
        },
        // 开始时间
        startTime() {
            return this.teambuyInfo?.is_preheat ? new Date().getTime() + this.teambuyInfo?.pre_time * 1000 : null;
        },
        // 结束时间
        endTime() {
            return this.teambuyInfo?.buy_stop_at * 1000;
        },
        // 拼团划线价
        linePrice() {
            return this.marketingData.available_info.price;
        },
        priceList() {
            const priceWide = this.teambuyInfo?.stage_price_wide;
            const priceArr = [];
            if ( (Array.isArray(priceWide) && priceWide.length) || Object.prototype.toString.call(priceWide) === '[object Object]' ) {
                Object.values(priceWide).forEach(value => {
                    priceArr.splice(0, 0, ...value);
                });
            } else {
                priceArr.push(this.teambuyInfo?.group_price);
            }
            return priceArr.sort((a, b) => a - b);
        },
        // 拼团价
        price() {
            return this.priceList[0];
        },
        // 是否有多个价格
        multiPrice() {
            return this.priceList[0] !== this.priceList[this.priceList.length - 1];
        }
    },
    methods: {
        onCountdownEnd() {
            location.reload();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
