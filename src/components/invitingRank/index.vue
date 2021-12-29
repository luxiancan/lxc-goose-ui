<template>
  <div v-if="isShowInvitingRank" :class="{ 'is-only-rank': onlyShowRank }">
    <div class="mask-layer" @click="closeInvitingRank"></div>
    <div
      :class="{
        'empty-area': topInviter.length == 0 && !isDefaultPage,
        'container-ranking': true,
        canTouchMove: true,
      }"
    >
      <div class="img-background">
        <img
          class="img-invite-title"
          src="../../assets/images/invitingRank/new_invite_title.svg"
        />
        <div class="img-close-div" @click="closeInvitingRank">
          <img
            class="img-close"
            src="../../assets/images/invitingRank/new_icon_close.png"
          />
        </div>
      </div>

      <rewards
        v-if="activitySwitch"
        :inActivity="inActivity"
        :rewardList="rewardList"
        :isShowRules="isShowRules"
        :isShowReward="isShowReward"
        :onlyShowRank="onlyShowRank"
        @openRuleDetail="openRuleDetail"
      ></rewards>
      <div
        :class="{
          'exist-top-inviter': topInviter.length === 50,
          'ranking-list': true,
          'safe-area': topInviter.length > 0,
        }"
      >
        <div class="ranking-top-50">
          <div
            v-for="user in userTop50"
            :key="user.user_id"
            class="ranking-item"
          >
            <img
              v-if="user.ranking === 1"
              class="num"
              src="../../assets/images/invitingRank/rank_first.png"
            />
            <img
              v-else-if="user.ranking === 2"
              class="num"
              src="../../assets/images/invitingRank/rank_second.png"
            />
            <img
              v-else-if="user.ranking === 3"
              class="num"
              src="../../assets/images/invitingRank/rank_third.png"
            />
            <span v-else class="num">{{ user.ranking }}</span>
            <div class="warp-avatar">
              <img
                class="img-avatar"
                src="//wechatavator-1252524126.cos.ap-shanghai.myqcloud.com/aaa/default.svg"
                v-real-src="user.avatar"
              />
            </div>
            <span class="name">
              <name-replacer
                :name="user.name"
                type="0"
                v-if="user.name"
              ></name-replacer>
            </span>
            <span class="desc">{{ `邀请${user.inviteNum}位好友` }}</span>
          </div>
        </div>
        <div v-if="topInviter.length === 50" class="tip">邀请达人榜TOP50</div>
        <div
          v-if="topInviter.length === 0 && !isDefaultPage"
          class="ranking-empty"
        >
          <img src="../../assets/images/invitingRank/new_emptypage.jpeg" />
          <div class="title-empty">快来成为第一个上榜的人</div>
          <button class="btn-inviting" @click="gotoInvite">邀请好友</button>
        </div>
      </div>
      <div class="fill-box" v-if="selfInfo && topInviter.length > 0"></div>
    </div>
    <div v-if="selfInfo && topInviter.length > 0" class="self-info">
      <span class="num" @click="openFriendsModal">{{
        selfInfo.ranking === -1 ? "-" : selfInfo.ranking
      }}</span>
      <div @click="openFriendsModal">
        <img class="img-avatar" :src="selfInfo.avatar" />
      </div>

      <div @click="openFriendsModal" class="inviting-info">
        <div class="name">
          <name-replacer
            :name="selfInfo.name"
            type="0"
            v-if="selfInfo.name"
          ></name-replacer>
          <!-- <span v-if="selfInfo.inviteNum" class="medal">邀请达人</span> -->
        </div>
        <div v-if="selfInfo.inviteNum" class="desc">
          已成功邀请<span>{{ selfInfo.inviteNum }}</span
          >位好友
        </div>
        <div v-else class="desc">邀请好友看直播，争夺上榜机会</div>
      </div>
      <button class="btn-inviting" @click="gotoInvite">
        {{ inActivity ? "冲榜" : "邀请" }}
      </button>
    </div>
    <friends
      v-if="selfInfo && selfInfo.inviteNum > 0"
      ref="refFriends"
      :count="selfInfo.inviteNum"
      :inviteParm="inviteParm"
    ></friends>
    <rules ref="refRules" :ruleDetail="ruleDetail"></rules>
  </div>
</template>

<script>
import nameReplacer from "@/components/nameReplacer";
import NetWork from "@/lib/network";
import Rewards from "./components/rewards";
import Friends from "./components/friends";
import Rules from "./components/rules";

export default {
  name: "invitingRank",
  props: {
    inActivity: {
      type: Boolean,
      required: false,
    },
    activitySwitch: {
      type: Boolean,
      required: false,
    },
    roomInfo: {
      type: Object,
      required: false,
    },
    inviteParm: {
      type: String,
      required: false,
    },
    onlyShowRank: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Rewards,
    Friends,
    Rules,
    nameReplacer,
  },
  data() {
    return {
      isShowInvitingRank: false,
      topInviter: [],
      selfInfo: null,

      promiseInviteActivityInfo: null,
      promiseInviteActivityExplain: null,

      rewardList: [],

      ruleDetail: null,

      isShowRules: false,
      isShowReward: false,
      isDefaultPage: true,
      allowClick: true,
      previous: 0,
      now: 0
    };
  },
  computed: {
    userTop50() {
      return this.topInviter;
    }
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
  methods: {
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
    async showInvitingRank() {
      // 先用节流处理频繁点击造成的弹窗闪烁问题，之后用vant的popup来替换
      this.now = new Date().getTime()
      console.log("previous--------", this.previous);
      console.log("now--------", this.now);
      if (this.previous + 1000 <= this.now) {
        this.allowClick = false;
        this.isShowInvitingRank = true;
        await this.getInviteList();
        if (this.activitySwitch || this.onlyShowRank) {
          await this.getInviteActivityInfo();
        }
        this.$emit("onOpen", { onlyShowRank: this.onlyShowRank });
        this.dataReport("view_page", {
          page_name: "邀请达人榜弹窗",
          page_button: "",
        });
        this.previous = this.now;
      }
    },
    closeInvitingRank() {
      this.isShowInvitingRank = false;
      this.$emit("onClose", { onlyShowRank: this.onlyShowRank });
    },
    gotoInvite() {
      this.$emit("shareLive");
      this.dataReport("click_butt", { page_button: "邀请好友按钮" });
      location.href = this.roomInfo.invite_card_url;
    },
    openFriendsModal() {
      if (this.$refs.refFriends) {
        this.$refs.refFriends.showFriendModal();
        this.dataReport("click_butt", {
          page_button: "点击查看邀请的好友",
          button_status: "",
        });
      }
    },
    async openRuleDetail() {
      if (this.$refs.refRules) {
        await this.getInviteActivityExplain();
        this.$refs.refRules.showRules();
      }
    },
    // 达人榜
    getInviteList() {
      NetWork.request(
        "_alive/getInviteListV2",
        {
          inviteParm: this.inviteParm,
        },
        (res) => {
          if (res.code === 0) {
            this.isDefaultPage = false;
            this.topInviter = res.data.listInfos;
            this.selfInfo = res.data.selfInfo;
          }
        }
      );
    },
    // 关联的活动
    getInviteActivityInfo() {
      if (this.promiseInviteActivityInfo) {
        return this.promiseInviteActivityInfo;
      }
      this.promiseInviteActivityInfo = new Promise((resolve) => {
        NetWork.request(
          "_alive/get_invite_activity_rule",
          {
            resource_id: this.roomInfo.alive_id,
            resource_type: 4,
          },
          (res) => {
            if (res.code === 0) {
              this.rewardList = res.data.prize_rules;
              this.isShowRules = !!res.data.is_show_remark;
              this.isShowReward = !!res.data.is_show_prize;
            }
            resolve();
          }
        );
      });
      return this.promiseInviteActivityInfo;
    },
    // 富文本详情
    getInviteActivityExplain() {
      if (this.promiseInviteActivityExplain) {
        return this.promiseInviteActivityExplain;
      }
      this.promiseInviteActivityExplain = new Promise((resolve) => {
        NetWork.request(
          "_alive/get_invite_activity_explain",
          {
            alive_id: this.roomInfo.alive_id,
          },
          (res) => {
            if (res.code === 0) {
              this.ruleDetail = res.data.text;
            }
            resolve();
          }
        );
      });
      return this.promiseInviteActivityExplain;
    },
    dataReport(eventName, options) {
      try {
        this.$parent.dataReport(eventName, options);
      } catch (e) {
        window.console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes popping {
  from {
    transform: translateY(11.2rem);
    opacity: 0.5;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
// 禁止长按保存图片
img {
  pointer-events: none; // 禁止none ，启用auto
}
// 禁止复制文本
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.mask-layer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9;
  background-color: #000000;
  opacity: 0.6;
}
.container-ranking {
  font-family: "PingFangSC-Regular", "PingFang SC";
  position: fixed;
  animation: popping ease 300ms;
  left: 0;
  right: 0;
  width: 100vw;
  height: 11.2rem;
  max-width: 480px;
  max-height: 90vh;
  bottom: 0;
  margin: 0 auto;
  background-color: #fff !important;
  // background: #f5f5f5;
  background: url("https://wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appgwaqerxu2025/image/b_u_5b2225aa46488_oGKN7IvA/kpzb2l510aau.png?imageView2/2/w/200/q/60");
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 16px 16px 0px 0px;
  color: #333333;
  overflow: auto;
  box-sizing: border-box;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
  .img-banner {
    position: absolute;
    top: -1px;
    width: 100%;
  }
  .img-background {
    background: url("https://wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appgwaqerxu2025/image/b_u_5b2225aa46488_oGKN7IvA/kpzb2k2t0iqn.png?imageView2/2/w/200/q/60");
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    padding: 0.48rem 0 0.16rem 0;
    .img-invite-title {
      width: 2.86rem;
      height: 110%;
    }
  }
}
.img-close-div {
  position: absolute;
  right: 0.32rem;
  width: 0.8rem;
  height: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .img-close {
    width: 0.24rem;
    height: 0.24rem;
  }
}

.ranking-list {
  width: 100%;
  margin: 0 auto;
  padding: 0.32rem;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: scroll;
  .ranking-top-50 {
    margin-top: 0.24rem;
    .ranking-item {
      display: flex;
      height: 1rem;
      align-items: center;
      .num {
        font-size: 0.32rem;
        color: #666666;
        margin-right: 0.12rem;
        width: 0.44rem;
        text-align: center;
      }
      .warp-avatar {
        position: relative;
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.16rem;
        .img-avatar {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 100%;
          box-sizing: border-box;
        }
        &::before {
          content: "";
          width: 0.28rem;
          height: 0.24rem;
          position: absolute;
          bottom: 100%;
          left: 80%;
          transform: translate(-50%, 0.1rem);
          display: none;
        }
      }
      &:nth-child(1) {
        .warp-avatar {
          .img-avatar {
            border: 1px solid #ffd014;
          }
          &::before {
            display: inline-block;
            background: url("../../assets/images/invitingRank/new_crown_yellow_pure.png");
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }
      &:nth-child(2) {
        .warp-avatar {
          .img-avatar {
            border: 1px solid #d2daff;
          }
          &::before {
            display: inline-block;
            background: url("../../assets/images/invitingRank/new_crown_blue_pure.png");
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }
      &:nth-child(3) {
        .warp-avatar {
          .img-avatar {
            border: 1px solid #ffb897;
          }
          &::before {
            display: inline-block;
            background: url("../../assets/images/invitingRank/new_crown_pink_pure.png");
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }
      .name {
        font-family: "PingFangSC-Medium", "PingFang SC";
        font-size: 0.24rem;
        font-weight: 500;
        max-width: 1.88rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .desc {
        font-size: 0.24rem;
        flex: 1;
        text-align: right;
      }
    }
  }
  .ranking-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.28rem;
    // margin: 0.96rem 0;

    .title-empty {
      color: #999999;
    }
    .btn-inviting {
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-size: 0.28rem;
      width: 4rem;
      height: 0.72rem;
      background-image: linear-gradient(270deg, #ff5f46 0%, #ffa238 100%);
      border-radius: 0.36rem;
      margin-top: 0.32rem;
      outline: 0;
      border: 0;
      color: #ffffff;
      font-weight: 500;
    }
    img {
      width: 4.8rem;
      height: 3.6rem;
      margin-bottom: 0.16rem;
    }
  }
  .tip {
    font-size: 0.28rem;
    color: #999999;
    line-height: 0.4rem;
    height: 1.2rem;
    text-align: center;
    line-height: 1.2rem;
  }
}
.fill-box {
  background: #fff;
  width: 100%;
  max-width: 480px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 1rem;
  // height: calc(env(safe-area-inset-bottom) / 2);
  // height: calc(constant(safe-area-inset-bottom) / 2);
  z-index: 10002;
}
.self-info {
  width: 100%;
  max-width: 480px;
  height: 1.16rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eeeeee;
  padding: 0 0.32rem;
  box-sizing: border-box;
  z-index: 1002;
  .safe-area {
    bottom: calc(env(safe-area-inset-bottom) / 2);
    bottom: calc(constant(safe-area-inset-bottom) / 2);
  }
  .num {
    font-size: 0.32rem;
    color: #666;
    margin: 0 0.12rem 0 0.12rem;
    padding-left: 0.12rem;
    width: 0.51rem;
    text-align: center;
  }
  .img-avatar {
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 100%;
    margin-right: 0.12rem;
  }
  .inviting-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .name {
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
      font-size: 0.24rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 2rem;
      .medal {
        margin-left: 0.08rem;
        height: 0.24rem;
        padding: 0 0.08rem;
        line-height: 0.24rem;
        background: linear-gradient(180deg, #fffab8 0%, #ffd866 100%);
        border-radius: 0.12rem;
        font-size: 0.16rem;
        color: #ff781f;
      }
    }
    .desc {
      font-size: 0.24rem;
      span {
        color: #ff781f;
      }
    }
  }
  .btn-inviting {
    font-family: "PingFangSC-Medium", "PingFang SC";
    font-weight: 500;
    background-image: linear-gradient(270deg, #ff5f46 0%, #ffa238 100%);
    color: #ffffff;
    border-radius: 0.28rem;
    padding: 0.08rem 0.32rem;
    margin-right: 0.08rem;
    font-size: 0.28rem;
    line-height: 0.4rem;
    outline: 0;
    border: 0;
  }
}

.is-only-rank {
  background: #fff;
  height: 100%;
  .container-ranking {
    position: relative;
    animation: none;
    border-radius: 0;
    background-color: white !important;
    background: url("https://wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appgwaqerxu2025/image/b_u_5b2225aa46488_oGKN7IvA/kpzb2l510aau.png?imageView2/2/w/200/q/60");
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    padding-bottom: 0.4rem;
    z-index: 1;
    max-height: none;
    height: auto;
    min-height: 11.2rem;
    overflow-y: hidden;
    .ranking-list {
      border-radius: 0.16rem;
      margin-top: 0.18rem;
    }
    .exist-top-inviter {
      padding: 0 0.32rem 0rem 0.32rem;
    }
  }
  .self-info {
    z-index: 1;
  }
  .mask-layer {
    display: none;
  }
  .img-close {
    display: none;
  }
  .image-webp {
    display: none;
  }
  .empty-area {
    height: 100% !important;
    .ranking-list {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 5.42rem;
      .ranking-empty {
        margin: 0;
      }
    }
  }
}
.safe-area {
  margin-bottom: calc(1.16rem + env(safe-area-inset-bottom) / 2) !important;
  margin-bottom: calc(
    1.16rem + constant(safe-area-inset-bottom) / 2
  ) !important;
}
</style>
