<template>
    <team-buy-list
        v-if="showTeamBuy"
        :isShow="!!showTeamBuy"
        :currentStatus="currentStatus"
        :resourceId="availableInfo.resource_id"
        :resourceType="availableInfo.resource_type"
        :isJoinTeam="!!teambuyInfo.complete"
        :joinTeamList="teambuyInfo.list"
        :teamTotal="teambuyInfo.total"
        :teamPrice="teambuyInfo.group_price"
        :teamBuyNum="teambuyInfo.sum_num"
        :teamBuyId="teambuyInfo.team_buy_id"
        :stopTime="buyStopAt"
        :shareType="shareType"
        :shareUserId="shareUserId"
        @join-team="onJoinTeam"
    ></team-buy-list>
</template>

<script>
import TeamBuyList from '../teamBuyList';

export default {
    name: 'teamBuyListBeta',
    props: {
        marketingData: {
            type: Object,
            default: {}
        },
        arams: {
            type: Object,
            default: {}
        }
    },
    components: {
        TeamBuyList
    },
    data() {
        return {
            teamBuyType: '6'
        };
    },
    computed: {
        showTeamBuy() {
            return !this.availableInfo.has_buy && this.teambuyInfo && this.teambuyInfo.list.length
        },
        currentStatus() {
            return this.teambuyInfo?.is_join || false;
        },
        shareType() {
            return this.arams?.share_type;
        },
        shareUserId() {
            return this.arams?.share_user_id;
        },
        teambuyInfo() {
            return this.marketingData.marketing_activity.marketing_info[this.teamBuyType];
        },
        availableInfo() {
            return this.marketingData.available_info;
        },
        buyStopAt() {
            return +this.teambuyInfo.buy_stop_at * 1000;
        }
    },
    methods: {
        //点击凑团/去邀请
        onJoinTeam(team) {
            this.$emit("join-team", team);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
