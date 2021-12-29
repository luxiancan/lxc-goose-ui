<template>
  <div class="container-action-bar">
    <div
      v-if="!isAppOverdue && !isSoldOut && !isPreheat && !isEnterpriseLive"
      class="container-icon-buttons"
    >
      <button-gift
        :iconSrc="IconGift"
        caption="送好友"
        :onPayButtonClick="onPayButtonClick"
      ></button-gift>
      <slot name="icon-buttons">
        <!-- 其它业务功能按钮 -->
      </slot>
    </div>
    <!-- 店铺过期 -->
    <bar-app-overdue v-if="isAppOverdue"></bar-app-overdue>
    <!-- 商品停售 -->
    <bar-stop-sell v-else-if="isStopSell"></bar-stop-sell>
    <!-- 下架商品 -->
    <bar-sold-out v-else-if="isSoldOut"></bar-sold-out>
    <!-- 即将开售 -->
    <bar-preheat
      v-else-if="isPreheat"
      :timeLeft="marketingData.available_info.time_left"
    ></bar-preheat>
    <!-- 拼团 -->
    <bar-team-buy
      v-else-if="teamBuyInfo"
      :marketingInfo="teamBuyInfo"
      :superVipInfo="superVipInfo"
      :goodsInfo="goodsInfo"
      :onPayButtonClick="onPayButtonClick"
      :couponList='couponList'
      :myCouponList='myCouponList'
    ></bar-team-buy>
    <!-- 限时折扣 -->
    <bar-limit-discount
      v-else-if="limitDiscountInfo"
      :marketingInfo="limitDiscountInfo"
      :superVipInfo="superVipInfo"
      :goodsInfo="goodsInfo"
      :onPayButtonClick="onPayButtonClick"
      :couponList='couponList'
      :myCouponList='myCouponList'
    ></bar-limit-discount>
    <!-- 秒杀 -->
    <bar-sec-kill
      v-else-if="secKillInfo"
      :marketingInfo="secKillInfo"
      :superVipInfo="superVipInfo"
      :goodsInfo="goodsInfo"
      :onPayButtonClick="onPayButtonClick"
       :couponList='couponList'
      :myCouponList='myCouponList'
    ></bar-sec-kill>
    <!-- 正常售卖 -->
    <bar-default
      v-else
      :goodsInfo="goodsInfo"
      :superVipInfo="superVipInfo"
      :onPayButtonClick="onPayButtonClick"
      :couponList='couponList'
      :myCouponList='myCouponList'
    ></bar-default>
  </div>
</template>

<script>
// 团购, 支付有礼，0元订单、优惠码

import IconGift from './images/details_friend_invite.png';
import BarAppOverdue from './components/BarAppOverdue';
import BarSoldOut from './components/BarSoldOut';
import BarStopSell from './components/BarStopSell';
import BarPreheat from './components/BarPreheat';
import BarTeamBuy from './components/BarTeamBuy';
import BarLimitDiscount from './components/BarLimitDiscount';
import BarSecKill from './components/BarSecKill';
import ButtonGift from './components/ButtonGift';
import BarDefault from './components/BarDefault';
const ENTERPRISE_LIVE = 'qlive_shop'; //企业直播
const MARKETING_LIMIT_DISCOUNT = 3; // 限时折扣
const MARKETING_TEAM_BUY = 6; // 拼团
const MARKETING_SEC_KILL = 8; // 秒杀

export default {
  name: "ActionBar",
  components: {
    BarAppOverdue,
    BarSoldOut,
    BarPreheat,
    BarStopSell,
    BarTeamBuy,
    BarLimitDiscount,
    BarSecKill,
    BarDefault,
    ButtonGift,
  },
  data() {
    return {
      IconGift,
    };
  },
  props: {
    marketingData: {
      type: Object,
      required: true,
    },
    couponList: {
      type: Array,
      required: true,
    },
    myCouponList:{
      type:Object,
      required:true
    }
  },
  computed: {
     // 是否为企业直播店铺
    isEnterpriseLive(){
      const qLive = window.wx.SHOP_TYPE_ENV;
      return qLive == ENTERPRISE_LIVE
    },
    goodsInfo() {
      return this.marketingData.available_info;
    },
    superVipInfo() {
      return this.marketingData.svip_info;
    },
    isAppOverdue() {
      return !!this.marketingData.available_info.version_overtime;
    },
    isSoldOut() {
      return !!this.marketingData.available_info.recycle_bin_state;
    },
    // 停售
    isStopSell() {
        return !!this.marketingData.available_info.is_stop_sell
    },
    isPreheat() {
      return this.marketingData.available_info.time_left > 0;
    },
    // 拼团
    teamBuyInfo() {
      const types = Object.keys(
        this.marketingData.marketing_activity.marketing_info
      );
      const activityType = types.length ? window.parseInt(types[0]) : null;
      if (activityType === MARKETING_TEAM_BUY) {
        return this.marketingData.marketing_activity.marketing_info[
          `${activityType}`
        ];
      }
      return null;
    },
    // 限时折扣
    limitDiscountInfo() {
      const types = Object.keys(
        this.marketingData.marketing_activity.marketing_info
      );
      const activityType = types.length ? window.parseInt(types[0]) : null;
      if (activityType === MARKETING_LIMIT_DISCOUNT) {
        return this.marketingData.marketing_activity.marketing_info[
          `${activityType}`
        ];
      }
      return null;
    },
    // 秒杀
    secKillInfo() {
      const types = Object.keys(
        this.marketingData.marketing_activity.marketing_info
      );
      const activityType = types.length ? window.parseInt(types[0]) : null;
      if (activityType === MARKETING_SEC_KILL) {
        return this.marketingData.marketing_activity.marketing_info[
          `${activityType}`
        ];
      }
      return null;
    },
  },
  methods: {
    onPayButtonClick(eventName = "pay", options) {
      this.$emit("onPayButtonClick", eventName, options);
    },
  },
};
</script>

<style lang="scss" scoped>
.container-action-bar {
  position: fixed;
  box-sizing: border-box;
  height: 1.08rem;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 0.28rem;
  padding: 0 0.32rem;
  background: #fff;
  border-top: 1px #f2f2f8 solid;
  .container-icon-buttons {
    min-width: 1.2rem;
    display: flex;
    justify-content: center;
    margin-right: 0.32rem;
  }
}
</style>
