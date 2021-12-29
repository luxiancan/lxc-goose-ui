<template>
  <div class="integral-wrapper" v-if="integralData">
    <div
      class="integral-entry"
      :style="{height: `${entryHeight}rem`}"
      @click.stop.prevent="useDeduction"
    >
      <div class="left-text">
        <div class="title">积分</div>
        <i class="iconfont icon-rule_icon tips-icon" @click.stop.prevent="openTips"></i>
      </div>
      <div class="right-text" v-if="integralData.is_available">
        <div class="current" v-if="integralData.is_available">
          使用{{ integralData.used_point }}积分
        </div>
        <!-- 抵扣金额 -->
        <div class="discount">-¥{{ integralData.discount_price | toPrice }}</div>
        <!-- 是否勾选积分的开关图标 -->
        <div class="switch-on" v-if="isDeduced">
          <img src="@/assets/images/integralSelect/oval2.png" alt="" />
        </div>
        <div class="switch-off" v-else></div>
      </div>
      <!-- 积分不可用时的提示文案 -->
      <div class="cannot-use" v-else>{{ integralData.invalid_text }}</div>
    </div>
    <integral-tips :visible.sync="showTips" :resourceType="resourceType"></integral-tips>
  </div>
</template>
<script>
import integralTips from "./components/integralTips.vue";
export default {
  props: {
    integralData: Object,
    resourceType: Number,
    entryHeight: {
      type: Number,
      default: 1
    }
  },
  name: "integralSelect",
  components: {
    integralTips
  },
  filters: {
    toPrice(value) {
      return `${(value / 100).toFixed(2)}`;
    }
  },
  data() {
    return {
      isDeduced: 0, //是否使用积分抵扣
      showTips: false //是否展示积分说明弹窗
    };
  },
  mounted() {
    if (this.integralData) this.isDeduced = this.integralData.is_use_integral;
  },
  methods: {
    //打开弹窗提示
    openTips() {
      this.showTips = true;
    },
    //是否使用积分抵扣
    useDeduction() {
      if (this.integralData.is_available) {
        let tempNum = this.isDeduced;
        this.isDeduced = tempNum == 0 ? 1 : 0;
        this.$emit("useIntegral", this.isDeduced);
      } else {
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.integral-wrapper {
  border-top: 0.01rem solid #eee;
  background: #fff;
  .integral-entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .left-text {
      display: flex;
      align-items: center;
      .title {
        font-size: 0.28rem;
        color: #333;
      }
      .tips-icon {
        margin-left: 0.08rem;
        padding-top: 0.02rem;
        font-size: 0.28rem;
        color: #999;
      }
    }
    .right-text {
      display: flex;
      align-items: center;
      .current {
        margin-right: 0.16rem;
        font-size: 0.24rem;
        color: #999;
      }
      .discount {
        margin-right: 0.16rem;
        font-size: 0.28rem;
        color: #ff8205;
      }
      .switch-on {
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .switch-off {
        width: 0.28rem;
        height: 0.28rem;
        border: 0.02rem solid #999999;
        border-radius: 50%;
      }
    }
    .cannot-use {
      font-size: 0.28rem;
      color: #c8c8c8;
    }
  }
}
</style>
