<template>
  <div class="container-entrance">
    <div class="invite-list" v-if="totalInviterCount > 0" @click="openRank">
      <div
        class="wrap-avatar"
        v-for="(user, index) in topInviters"
        :key="user.share_user_id"
        :style="{ zIndex: topInviters.length - index }"
      >
        <img
          class="img-avatar"
          src="//wechatavator-1252524126.cos.ap-shanghai.myqcloud.com/aaa/default.svg"
          v-real-src="user.wx_avatar"
        />
      </div>
    </div>
    <div
      class="invite-info"
      :class="[
        totalInviterCount > 0
          ? 'invite-info-no-empty-bg'
          : 'invite-info-empty-bg',
      ]"
    >
      <div class="new-invite-info-title" @click="openRank">
        <div class="title">
          {{ inActivity ? "冲榜得奖励" : "邀请达人榜" }}
        </div>
        <!-- <div class="num">{{ totalInviterCount }}</div> -->
      </div>
      <img
        @click="gotoInvite()"
        class="icon-right new-icon-right"
        src="../../../assets/images/invitingRank/new_share_icon.png"
      />
    </div>
  </div>
</template>

<script>
import NetWork from "@/lib/network";

export default {
  name: "liveRoomVertical",
  props: {
    isLiveOver: {
      type: Boolean,
      default: false,
    },
    roomInfo: {
      type: Object,
      required: true,
    },
    inviteParm: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      topInviters: [],
      myRank: -1,
      myInviteCount: 0,
      totalInviterCount: 0,

      activitySwitch: false, // 是否关联活动
      activityEndType: 1, // 有效时间 1-直到直播结束，2-自定义时间
      activityEndTime: "", // 自定义截止时间
    };
  },
  directives: {
    realSrc: {
      async bind(el, binding, vnode) {
        const imgURL = binding.value; // 获取图片地址
        if (imgURL) {
          const exist = await vnode.context.imageIsExist(imgURL);
          if (exist) {
            el.setAttribute("src", imgURL);
          }
        }
      },
    },
  },
  computed: {
    inActivity() {
      let flag = false;
      if (this.activitySwitch) {
        if (this.activityEndType === 1 && !this.isLiveOver) {
          flag = true;
        } else if (this.activityEndType === 2) {
          const endTime = new Date(this.activityEndTime);
          flag = Date.now() <= endTime.getTime();
        }
      }
      this.$emit("updateActivityState", {
        activitySwitch: this.activitySwitch,
        inActivity: flag,
      });
      return flag;
    },
  },
  created() {
    this.getOwnRankTopFive();
  },
  methods: {
    gotoInvite() {
      this.$emit("shareLive");
      this.$parent.dataReport("click_butt", { page_button: "邀请好友按钮" });
      location.href = this.roomInfo.invite_card_url;
    },
    imageIsExist(url) {
      return new Promise((resolve) => {
        let img = new Image();
        img.onload = function () {
          if (this.complete) {
            resolve(true);
            img = null;
          }
        };
        img.onerror = function () {
          resolve(false);
          img = null;
        };
        img.src = url;
      });
    },
    getOwnRankTopFive() {
      NetWork.request(
        "_alive/own_rank_top_five",
        {
          inviteParm: this.inviteParm,
        },
        (res) => {
          if (res.code === 0) {
            this.totalInviterCount = res.data.aliveInviteNumber;
            this.topInviters = res.data.invitelist.slice(0, 3);
            this.myInviteCount = res.data.ownRankingInfo.count;
            this.myRank = res.data.ownRankingInfo.ranking;

            this.activitySwitch = !!res.data.inviteActivitySwitchState;
            this.activityEndType = res.data.inviteActivityEndType;
            this.activityEndTime = res.data.inviteActivityEndTime.replace(
              /-/g,
              "/"
            );
          }
        }
      );
    },
    openRank() {
      this.$emit("openRank");
    },
  },
};
</script>

<style lang="scss" scoped>
.container-entrance {
  font-family: "PingFangSC-Regular", "PingFang SC";
  display: inline-flex;
  align-items: center;
  .invite-list {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    .wrap-avatar {
      position: relative;
      margin: 0 0.02rem;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 100%;
      box-sizing: border-box;
      &:not(:first-child) {
        // margin-left: -0.14rem;
      }
      &:nth-child(1) {
        border: 1px solid #ffd014;
        &::before {
          content: "";
          position: absolute;
          // bottom: 100%;
          bottom: 94%;
          left: 57%;
          // left: calc(50% - 0.08rem);
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
          background: url("../../../assets/images/invitingRank/new_crown_yellow_pure.png");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      &:nth-child(2) {
        border: 1px solid #d2daff;
        &::before {
          content: "";
          position: absolute;
          // bottom: 100%;
          // left: calc(50% - 0.08rem);
          bottom: 94%;
          left: 57%;
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
          background: url("../../../assets/images/invitingRank/new_crown_blue_pure.png");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      &:nth-child(3) {
        border: 1px solid #ffb897;
        &::before {
          content: "";
          position: absolute;
          // bottom: 100%;
          // left: calc(50% - 0.08rem);
          bottom: 94%;
          left: 57%;
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
          background: url("../../../assets/images/invitingRank/new_crown_pink_pure.png");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      &.is-fake {
        border: 0;
      }
      .img-avatar {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background: #efefef;
        overflow: hidden;
      }
    }
  }

  .invite-info {
    margin-left: -0.24rem;
    padding: 0.08rem 0 0.08rem 0.36rem;
    box-sizing: border-box;
    height: 0.56rem;
    color: #fff;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    &.invite-info-no-empty-bg {
      border-radius: 0rem 0.4rem 0.4rem 0rem;
      padding: 0.08rem 0 0.08rem 0.36rem;
      background-image: linear-gradient(
        90deg,
        rgba(255, 50, 149, 0) 0%,
        rgba(255, 122, 35, 0) 0%,
        rgba(255, 50, 149, 0.46) 19%,
        rgba(255, 50, 149, 0.9) 46%,
        #bf35ff 100%
      )!important;
      .title {
        font-size: 0.2rem;
      }
    }
    &.invite-info-empty-bg {
      border-radius: 0.4rem;
      padding: 0.08rem 0 0.08rem 0.3rem;
      background-image: linear-gradient(
        90deg,
        rgba(255, 122, 35, 0.5) 0%,
        rgba(255, 50, 149, 0.7) 46%,
        #bf35ff 100%
      )!important;
       .title {
          font-size: 0.25rem;
        }
    }
    // .title {
    //   font-size: 0.2rem;
    //   // line-height: 0.2rem;
    // }
    .num {
      font-size: 0.2rem;
      line-height: 0.2rem;
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
    }
  }
  .new-icon-right {
    width: 0.38rem;
    height: 0.32rem;
    flex: 1;
    margin: 0.08rem;
  }
  .invite-empty {
    display: inline-flex;
    align-items: center;
    height: 0.56rem;
    padding: 0 0.12rem 0 0.24rem;
    border-radius: 0.36rem;
    font-size: 0.2rem;
    font-weight: bold;
    color: #ffffff;
    .title {
      // line-height: 100%;
    }
    .icon-right {
      width: 0.4rem;
      height: 0.4rem;
      filter: brightness(100);
    }
  }
}
</style>
