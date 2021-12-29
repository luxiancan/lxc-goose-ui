<template>
    <teambuy-rule
        v-if="showTeamBuy" 
        :type="type" 
        :overview="overview"
    ></teambuy-rule>
</template>

<script>
import TeambuyRule from '../teambuyRule';

export default {
    name: 'teamBuyRuleBeta',
    props: {
        marketingData: {
            type: Object,
            default: {}
        }
    },
    components: {
        TeambuyRule
    },
    data() {
        return {
            teamBuyType: '6'
        };
    },
    computed: {
        showTeamBuy() {
            return !this.marketingData.available_info.has_buy && JSON.stringify(this.teambuyInfo) !== '{}'
        },
        teambuyInfo() {
            return this.marketingData.marketing_activity.marketing_info[this.teamBuyType];
        },
        overview() {
            // team_type 0 ==> 普通团   team_type 1 ==> 阶梯团
            if (this.teambuyInfo.team_type === 0) {
                return `支付后可邀请${this.teambuyInfo.sum_num - 1}人加入您发起的拼团，人数不足自动退款。`;
            } else {
                const str = Object.entries(this.teambuyInfo.stage_price_wide).map(([step, prices]) => {
                    const low = prices[0];
                    const high = prices[prices.legnth - 1];
                    const formatPrice = (low / 100).toFixed(2);
                    return `${step}人团¥${formatPrice}${low === high ? '' : '起'}`;
                }).join('，');
                return `${str}，发起拼团时先选择拼团类型。支付后可邀请好友加入你发起的拼团，人数不足自动退款。`;
            }
        },
        type() {
            return this.teambuyInfo.team_type === 0 ? 'normal' : 'step';
        }
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
</style>
