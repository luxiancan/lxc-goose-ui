<template>
  <div>
    <div class="container-rewards" :class="{ 'is-only-rank': onlyShowRank}">
      <div class="header">
        <span class="title">
          冲榜活动
        </span>
        <span class="status" :class="{ 'is-gray': !inActivity }">
          {{ inActivity ? "活动火热进行中" : "活动已结束" }}
        </span>
        <a v-if="isShowRules" class="link-detail" @click="openRuleDetail">
          规则说明
          <img
            class="icon-right"
            src="../../../assets/images/invitingRank/icon_arrow_up.png"
          />
        </a>
      </div>
      <div
        class="reward-detail"
        v-if="isShowReward && displayRewardList.length"
      >
        <div class="reward-list">
          <div
            v-for="(reward, index) in displayRewardList"
            :key="`reward-${index}`"
            class="reward-item"
          >
            <span class="name">
              {{ reward.prize }}
            </span>
            <span class="ranking">
              {{ reward.min === reward.max ? `第${reward.min}名获得` : `第${reward.min}-${reward.max}名获得` }}
            </span>
          </div>
          <div
            v-if="rewardList.length > 1"
            @click="switchFold"
            class="link-fold"
          >
            {{ this.isFold ? "更多奖品" : "收起" }}
            <img
              :class="{ 'icon-down': this.isFold, 'icon-up': !this.isFold }"
              src="../../../assets/images/invitingRank/icon_arrow_up.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'rewards',
    props: {
        rewardList: {
            type: Array,
            default: () => []
        },
        inActivity: {
            type: Boolean,
            required: false
        },
        isShowRules: {
            type: Boolean,
            required: false
        },
        isShowReward: {
            type: Boolean,
            required: false
        },
        onlyShowRank: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            isFold: true
        };
    },
    computed: {
        displayRewardList() {
            return this.isFold ? this.rewardList.slice(0, 1) : this.rewardList;
        }
    },
    created() {},
    methods: {
        switchFold() {
            this.isFold = !this.isFold;
            if (!this.isFold) {
                this.$parent.dataReport('click_butt', { page_button: '展开达人榜奖品', button_status: '' })
            }
        },
        openRuleDetail() {
            this.$emit('openRuleDetail');
            this.$parent.dataReport('click_butt', { page_button: '查看达人榜活动规则', button_status: '' });
        },
    }
};
</script>

<style lang="scss" scoped>
.container-rewards {
  font-family: "PingFangSC-Regular", "PingFang SC";
  position: relative;
  width: calc(100% - 0.64rem);
  max-width: 480px;
  background: #fff2e0;
  border-radius: 0.08rem;
  margin: 0 auto;
  z-index: 1;
  margin-bottom: 0.32rem;
  padding: 0 0.32rem;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    height: 1.14rem;
    .title {
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
      font-size: 0.36rem;
      color: #ff781f;
      margin-right: 0.08rem;
    }
    .status {
      display: inline-flex;
      align-items: center;
      height: 0.45rem;
      background: #ff764d;
      border-radius: 0.22rem;
      color: #ffffff;
      padding: 0 0.16rem;
      font-size: 0.24rem;
      &.is-gray {
        background: #999999;
      }
    }
    .link-detail {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 0.24rem;
      color: #999999;
      line-height: 0.34rem;
      cursor: pointer;
    }
  }
  .reward-detail {
    padding-bottom: 0.32rem;
    .reward-list {
      // height: 1.34rem;
      font-size: 0.24rem;
      color: #333333;
      background: #ffffff;
      border-radius: 0.08rem;
      padding: 0.24rem;
      box-sizing: border-box;
      .reward-item {
        display: flex;
        justify-content: space-between;
        margin-top: 0.24rem;
        &:nth-child(1) {
          margin-top: 0px;
        }
      }
      .link-fold {
        margin-top: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;
      }
    }
  }
}
.is-only-rank {
  .container-rewards {
    margin-bottom: 0;
    margin-top: 0.32rem;
  }
}
.icon-up {
  width: 0.36rem;
}
.icon-down {
  transform: rotate(180deg);
  width: 0.36rem;
}
.icon-right {
  transform: rotate(90deg);
  width: 0.36rem;
}
</style>
