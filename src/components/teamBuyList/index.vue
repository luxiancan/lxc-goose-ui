<template>
  <div class="teambuy-list" v-if="isShow">
    <!-- 有人开团的状态 -->
    <template v-if="currentStatus && joinTeamList.length">
      <div class="teambuy-list__default">
        <div class="count-time">
          <span class="title">他们正在拼团，你可直接参与</span>
          <span class="iconfont icon-icon-pagination-right" @click="lookAll"></span>
        </div>
        <team-buy-item
          v-for="(item, index) in teamBuyMembersForDisplay"
          :key="index"
          :item="item"
          :remainNum="item.num"
          :price="teamPrice"
          :complete="isJoinTeam"
          :noTorderTop="true"
          @join-team="joinTeam"
        >
        </team-buy-item>
      </div>
    </template>

    <popup v-model="isShowAll" round closeable :custom-style="popupStyle">
      <div class="container">
        <div class="popup-title">正在拼团</div>
        <div class="team-wrapper">
          <team-buy-item
            v-for="(item, index) in teamBuyPopupList"
            :key="index"
            :item="item"
            :remainNum="item.num"
            :price="teamPrice"
            :complete="isJoinTeam"
            :noTorderTop="true"
            @join-team="joinTeam"
          >
          </team-buy-item>
          <div class="tip" v-if="teamBuyPopupList.length === 10">
            仅显示10个正在拼团的人
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import NetWork from "@/lib/network.js";
import teamBuyItem from "./components/teamBuyItem.vue";
import Popup from "../popup";
import toast from "@/lib/toast.js";

export default {
  name: "SsTeamBuyList",
  props: {
    isShow: {
      // 是否限时拼团
      type: Boolean,
      default: false
    },
    currentStatus: {
      // 拼团当前状态 1 还没人开团； 0 已经有人开启拼团
      type: Number | Boolean,
      default: 1
    },
    joinTeamList: {
      // 参与拼团人员信息 wx_avatar 微信头像
      type: Array,
      default: () => []
    },
    limit: {
      // 显示拼团人员头像个数 默认为三个
      type: Number,
      default: 3
    },
    teamTotal: {
      // 参与拼团的总人数
      type: Number | String,
      default: 0
    },
    teamPrice: {
      // 拼团价格（单位分）
      type: Number | String,
      default: ""
    },
    teamBuyNum: {
      // 拼团人数 默认是两人团
      type: Number | String,
      default: 2
    },
    isJoinTeam: {
      // 是否参加了这次拼团 1参与 0 未参与
      type: Number | Boolean,
      default: 0
    },
    teamBuyId: {
      // 拼团id
      type: Number | String,
      default: ""
    },
    resourceId: {
      // 资源id
      type: Number | String,
      default: ""
    },
    resourceType: {
      // 资源类型
      type: Number | String,
      default: ""
    },
    channelId: {
      // 渠道id
      type: Number | String,
      default: ""
    },
    shareType: {
      type: Number | String,
      default: null
    },
    shareUserId: {
      type: Number | String,
      default: null
    },
    stopTime: {
      // 拼团停止时间
      type: Number,
      default: 0
    },
    contentAppId: {
      // 内容方id
      type: Number | String,
      default: null
    },
    repertoryId: {
      // 仓库id （只有分销商品
      type: Number | String,
      default: null
    },
    hideAllOnClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 全部列表数据
      allTeamBuyList: [],
      // 是否显示全部标识
      isShowAll: false,
      teamBuyText: "" // 拼团状态文本
    };
  },
  computed: {
    /*
     *  teamBuyMembersForDisplay 显示个数计算
     */
    teamBuyMembersForDisplay() {
      return this.joinTeamList.slice(0, 2);
    },
    // 最多显示十个
    teamBuyPopupList() {
        return this.allTeamBuyList.slice(0, 10);
    },
    // 默认显示三个的高度
    popupStyle() {
      let height = "4.49rem";
      const MAXM_HEIGHT = 9.6;
      if (this.teamBuyPopupList.length > 3) {
        const realHight = 4.49 + 0.96 * (this.teamBuyPopupList.length - 3);
        height = `${Math.min(realHight, MAXM_HEIGHT)}rem`;
      }
      return {
        height
      };
    }
  },
  methods: {
    lookAll() {
      //   if (this.isJoinTeam) {
      //     toast("您已参与拼团不能同时参与其它拼团");
      //     return;
      //   }
      const that = this;
      const params = {
        team_buy_id: that.teamBuyId,
        sum_num: that.teamBuyNum,
        resource_type: that.resourceType,
        resource_id: that.resourceId
      };
      // 如果有渠道id 需要把这个渠道id传给后端
      if (that.channelId) {
        params.channel_id = that.channelId;
      }
      //   通过邀请卡分享的链接需要此参数
      if (that.shareType) {
        params.share_type = that.shareType;
        params.share_user_id = that.shareUserId;
      }
      // 如果是内容市场拼团
      if (that.contentAppId && that.repertoryId) {
        params.resource_type = 22;
        params.resource_id = that.repertoryId;
      }
      that.isShowAll = true;

      NetWork.request("taskMoreInfo", params, data => {
        if (data.code == 0) {
          if (data.data.length > 0) {
            that.isShowAll = true;
            that.allTeamBuyList = data.data;
          }
        }
      });
      this.newDataUpPush("详情页_去拼团");
    },
    // 倒计时
    countDownStart(stopTime) {
      let nowTime = Date.parse(new Date()) * 0.001;
      let interval = stopTime - nowTime;
      if (interval > 0) {
        this.timeIntervalStart = setInterval(() => {
          nowTime += 1;
          interval = stopTime - nowTime;
          if (interval >= 0) {
            this.teamBuyText = "";
            this.countDown = this.timeConvert(interval);
            // 改变状态
            if (interval == 0) {
              this.teamBuyText = "拼团已结束";
            }
          } else {
            clearInterval(this.timeIntervalStart);
          }
        }, 1000);
      } else {
        this.teamBuyText = "拼团已结束";
      }
    },
    timeConvert(timeInterval) {
      const days = parseInt(timeInterval / (60 * 60 * 24));
      let hours = parseInt((timeInterval % (60 * 60 * 24)) / (60 * 60));
      let minutes = parseInt((timeInterval % (60 * 60)) / 60);
      let seconds = parseInt(timeInterval % 60);
      hours = this.addZero(hours);
      minutes = this.addZero(minutes);
      seconds = this.addZero(seconds);
      return {
        days,
        hours,
        minutes,
        seconds
      };
    },
    addZero(num) {
      if (num < 10) {
        return `0${num}`;
      } else {
        return num;
      }
    },
    // 颜值正义埋点上报
    newDataUpPush(data) {
      const dataUpArr = {
        et: 1,
        actn: data
      };
      try {
        window._YS_report.push([dataUpArr]);
      } catch (error) {
        console.error(error);
      }
    },
    joinTeam(team) {
      this.$emit("join-team", team);
      if (this.hideAllOnClick) {
        this.isShowAll = false;
      }
    }
  },
  destroyed() {
    clearInterval(this.timeIntervalStart);
  },
  components: {
    teamBuyItem,
    Popup
  }
};
</script>

<style lang="scss" scoped>
.teambuy-list {
  background: #ffffff;
  padding: 0.32rem;
  .team-buy__item {
    margin-top: 0.32rem;
  }
}
.margin_grey_line {
  background-color: #efeff4;
  height: 0.2rem;
  /*margin: 0 -0.3rem;*/
}
.count-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.24rem;
  color: #4a4c5b;
  line-height: 0.34rem;
  .title {
    font-size: 0.29rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 0.4rem;
  }
  img {
    height: 0.32rem;
  }
  small {
    font-size: 0.22rem;
  }
  .time {
    background: #4a4c5b;
    border-radius: 0.04rem;
    color: #fff;
    margin: 0.05rem;
    padding: 0 0.06rem;
    min-width: 0.3rem;
    text-align: center;
  }
}
.teambuy-list__text {
  font-size: 0.24rem;
  color: #4a4c5b;
  line-height: 0.34rem;
  margin-top: 0.24rem;
}
.team_buy__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c8c8c8;
  margin-top: 0.3rem;
  font-size: 0.24rem;
  .start {
    display: flex;
    align-items: center;
    .photo {
      width: 0.64rem;
      height: 0.64rem;
      border-radius: 50%;
      border: 0.04rem solid #fff;
      &:not(:first-child) {
        margin-left: -0.25rem;
      }
    }
    span {
      margin-left: 0.2rem;
    }
  }
  .end {
    display: inline-flex;
    align-items: center;
    .price {
      font-weight: 500;
      color: #ff002a;
      font-size: 0.4rem;
      small {
        font-size: 0.24rem;
      }
    }
    .action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.22rem;
      width: 1.2rem;
      height: 0.48rem;
      background: #ff002a;
      border-radius: 0.24rem;
      color: #ffffff;
      margin-left: 0.18rem;
    }
  }
}
.team_buy__info {
  font-size: 0.24rem;
  color: #4a4c5b;
}
.look_more_team_buy {
  height: 0.8rem;
  line-height: 0.8rem;
  background-color: #f8f8f8;
  text-align: center;
  /*margin: 0 -0.3rem;*/
}
.teambuy-list__all {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.all-list__wrapper {
  width: 6.5rem;
  max-height: 7.68rem;
  border-radius: 0.08rem;
  background-color: #ffffff;
  margin: 1.5rem auto 0 auto;
  padding: 0.3rem;
  overflow-y: scroll;
}

.close-all__list {
  width: 0.56rem;
  height: 0.56rem;
  border: solid 0.03rem #ffffff;
  border-radius: 50%;
  margin: 0.4rem auto 0 auto;
  line-height: 0.56rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-all__list span {
  color: #fff;
  font-size: 0.64rem;
  margin-top: -0.07rem;
}

.icon-icon-pagination-right {
  font-size: 0.32rem;
  color: #bfbfbf;
}

/deep/.ss-popup {
  .ss-popup__close {
    top: 0.54rem;
    right: 0.4rem;
  }
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .popup-title {
      text-align: center;
      font-size: 0.36rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 0.48rem;
      padding-top: 0.42rem;
      padding-bottom: 0.36rem;
      border-bottom: 0.02rem solid #f5f5f5;
    }

    .team-wrapper {
      flex: 1;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.08rem;
        border-radius: 0.04rem;
      }

      &::-webkit-scrollbar-thumb {
        width: 0.08rem;
        border-radius: 0.04rem;
        background: #d8d8d8;
      }
    }

    .team-buy__item {
      padding-left: 0.32rem;
      padding-right: 0.32rem;
    }

    .tip {
      margin: 0.32rem 0;
      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 0.34rem;
      text-align: center;
    }
  }
}
</style>
