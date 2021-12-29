<template>
  <popup :visible="visible" position="center" round class="tips" @change="handleClose">
    <div class="tips-container">
      <div class="text-container" @click.stop.prevent="voidEvent">
        <div class="tips-title">积分使用说明</div>
        <div class="tips-content">
          <div class="content-title">使用条件：</div>
          <div
            class="content-text"
            v-for="(item, index) in tipsList"
            :key="index"
          >
            <span v-if="tipsList.length > 1">{{ index + 1 }}. </span>
            {{ item }}
            <!-- <span>{{ index == tipsList.length - 1 ? "。" : "；" }}</span> -->
          </div>
        </div>
        <div class="tips-content" v-if="dataContent.deduct_redeem_radio">
          <div class="content-title">使用数量：</div>
          <div class="content-text">
            1. {{ dataContent.deduct_redeem_radio }}积分抵扣1元
          </div>
          <div class="content-text">
            2. 使用积分数量为{{ dataContent.deduct_redeem_radio }}的整数倍
          </div>
          <div class="content-text">
            3. 积分使用上限：{{ deductUseLimit }}
          </div>
        </div>
      </div>
      <div class="tips-btn" @click.stop.prevent="closeTips">知道了</div>
    </div>
  </popup>
</template>
<script>
import NetWork from '@/lib/network.js';
import Popup from '../../popup';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    resourceType: {
      type: Number
    }
  },
  components: {
    Popup
  },
  data() {
    return {
      dataContent: {}, //积分抵扣规则,
      tipsList: [], //提示的文本
    };
  },
  computed: {
    //积分使用上限的文本
    deductUseLimit() {
      let desc = '';
      switch (this.dataContent.deduct_use_limit_type) {
          case 1:
              desc = "无上限"
              break;
          case 2:
              desc = `商品金额的${this.dataContent.deduct_use_limit_value}%`
              break;
          case 3:
              desc = `每笔订单最多抵扣${this.dataContent.deduct_use_limit_value}元`
              break;
      }
      return desc;
    }
  },
  methods: {
    //获取积分规则
    getRules() {
      NetWork.request("/point/deduct_rule_content", {},
        (res) => {
          if (res.code == 0) {
            let allData = res.data;
            let tempArr = [
              allData.deduct_order_money_min == 0
                ? `订单金额无门槛${this.resourceType == 21 ? '(不包含运费)' : ''}`
                : `订单金额满${allData.deduct_order_money_min}元${this.resourceType == 21 ? '(不包含运费)' : ''}`,
              allData.deduct_pay_limit_name.length == 0
                ? `可与优惠券、限时折扣、秒杀、拼团叠加使用`
                : `不可与${allData.deduct_pay_limit_name.join("、")}叠加使用`,
              `部分商品不支持抵现`
            ];
            console.log("【积分】", allData.deduct_pay_limit_name.length);
            this.dataContent = allData;
            this.tipsList = tempArr;
          }
        });
    },
    handleClose(value) {
      if (!value) {
        this.closeTips();
      }
    },
    closeTips() {
      this.$emit("update:visible", false);
    },
    voidEvent() {
      return;
    }
  },
  mounted() {
    this.getRules();
  }
};
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: rgba(51, 51, 51, 0.5);
  z-index: 3;
}
.tips-container {
  z-index: 4;
  width: 5.9rem;
  border-radius: 0.24rem;
  background: #fff;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .text-container {
    padding: 0.48rem 0.32rem;
    box-sizing: border-box;
    .tips-title {
      font-size: 0.36rem;
      color: #333;
      font-weight: 500;
      width: 100%;
      text-align: center;
    }
    .tips-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      .content-title {
        margin-top: 0.48rem;
        font-size: 0.28rem;
        color: #333;
        font-weight: 500;
      }
      .content-text {
        margin-top: 0.08rem;
        font-size: 0.28rem;
        color: #333;
      }
    }
  }
  .tips-btn {
    border-top: 0.02rem solid #eee;
    padding: 0.26rem 0;
    width: 100%;
    text-align: center;
    font-size: 0.32rem;
    color: #ff8205;
    font-weight: 500;
  }
}
</style>
