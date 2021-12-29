<template>
  <div class="teambuy-rule" :class="fromGoods ? 'rule-high' : 'rule-short'">
    <div class="event-wrapper" @click="visible = true">
      <div v-if="fromGoods">
        <div class="rule-title">
          {{ type === "normal" ? "拼团玩法" : "拼团玩法-阶梯拼团" }}
        </div>
        <div class="rule-overview">{{ overview }}</div>
      </div>
      <div class="small-rule" v-else>拼团玩法：{{ overview }}</div>
      <div class="icon-wrapper">
        <span class="iconfont icon-icon-pagination-right"></span>
      </div>
    </div>
    <popup v-model="visible" position="center" round closeable>
      <div class="container">
        <div class="head">拼团玩法</div>
        <div class="title">
          {{ type === "step" ? "什么是阶梯拼团?" : "什么是拼团" }}
        </div>
        <div v-if="type === 'step'" class="rule-content">
          阶梯拼团（以下简称：拼团）是指团长在发起拼团时，选择指定的参团人数，邀请对应数量好友一起拼单购买的团购活动，参团人数越多，价格折扣越低。
        </div>
        <div v-else class="rule-content">
          拼团是指由多人一起拼单购买的团购活动，通过拼团买家可享受比一般网购更低的折扣。
        </div>
        <div class="title">怎么算拼团成功?</div>
        <div class="rule-content">
          在拼团有效期内找到足够人数的好友参加拼团，即可算拼团成功。
        </div>
        <div class="title">拼团失败，怎样退款?</div>
        <div class="rule-content">
          若拼团有效期内没有凑齐人数，即算作拼团失败。系统会自动将所支付的金额原路退回，具体到账时间以实际操作为准。
        </div>
        <div class="close">
          <button @click="visible = false">我知道了</button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import Popup from '@/components/popup';

export default {
    name: 'SsTeambuyRule',
    props: {
    // 拼团类型，step 阶梯拼团、normal 普通拼团
        type: {
            type: String,
            default: 'normal',
            validator: type => ['step', 'normal'].includes(type)
        },
        overview: {
            type: String
        },
        // 在拼团详情页传入参数以显示不同布局
        fromGoods: {
            type: String | Number,
            default: '1'
        }
    },
    components: {
        Popup
    },
    data() {
        return {
            visible: false
        };
    }
};
</script>

<style lang="scss" scoped>
.rule-high {
  padding: 0.24rem 0.32rem;

  .rule-overview {
    padding-right: 0.32rem;
  }
}
.rule-short {
  padding: 0.32rem 0;
  border-top: 0.01rem solid #eee;
  &.event-wrapper {
    align-items: center;
  }
}
.teambuy-rule {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-sizing: border-box;
  .event-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .rule-title {
    font-size: 0.28rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 0.36rem;
  }

  .rule-overview {
    font-size: 0.24rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 0.36rem;
    margin-top: 0.08rem;
  }
  .small-rule {
    font-size: 0.28rem;
    color: #353535;
  }
  .icon-wrapper {
    display: flex;
  }
  .icon-icon-pagination-right {
    font-size: 0.32rem;
    color: #bfbfbf;
  }

  /deep/.ss-popup {
    &--center {
      width: 5.9rem;
      height: unset;
      max-height: 8.52rem;
      .ss-popup__close {
        top: .22rem;
        right: .22rem;
        font-size: .44rem;
      }
    }

    .container {
      margin: 0.64rem 0;

      .head {
        font-size: 0.36rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 0.48rem;
        text-align: center;
      }

      .title {
        font-size: 0.28rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 0.4rem;
        padding: 0 0.48rem;
        margin-top: 0.32rem;
      }

      .rule-content {
        margin-top: 0.08rem;
        padding: 0 0.48rem;
        font-size: 0.24rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 0.36rem;
        text-align: left;
      }

      .close {
        text-align: center;
        button {
          margin-top: 0.32rem;
          outline: none;
          height: 0.8rem;
          width: 4.96rem;
          border-radius: 0.4rem;
          border: none;
          background-color: #ff4c51;
          font-size: 0.29rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.4rem;
        }
      }
    }
  }
}
</style>
