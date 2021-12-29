<template>
  <div
    :class="{
      'container-entrance-float': float,
      'container-entrance': !float,
      'is-empty': totalInviterCount === 0,
    }"
    @click="openRank"
  >
    <template v-if="float">
      <div class="entrance">
        {{ inActivity ? "冲榜得奖励" : "邀请达人榜" }}
        <img src="../../../assets/images/invitingRank/icon_arrow_right.png" />
      </div>
    </template>
    <template v-else>
      <template v-if="totalInviterCount > 0">
        <div class="title">邀请达人榜</div>
        <div class="invite-list">
          <div
            class="wrap-avatar"
            v-for="(user, index) in displayTopInviters"
            :key="`user-${index}`"
            :style="{ zIndex: displayTopInviters.length - index }"
          >
            <img
              class="img-avatar"
              src="//wechatavator-1252524126.cos.ap-shanghai.myqcloud.com/aaa/default.svg"
              v-real-src="user.wx_avatar"
            />
          </div>
          <div class="wrap-avatar is-fake" :style="{ zIndex: 0 }">
            <img
              class="img-avatar"
              src="../../../assets/images/invitingRank/avatar_more.png"
            />
          </div>
          <span v-if="totalInviterCount > 5" class="count">{{
            `${totalInviterCount}人`
          }}</span>
        </div>
      </template>
      <div class="title-empty" v-else>邀请达人榜</div>
      <div class="invite-status">
        <span v-if="totalInviterCount === 0">邀请1人即可上榜</span>
        <span v-else-if="myRank > 50 || myRank < 1">邀请好友争夺上榜机会</span>
        <span v-else-if="myRank > 0 && myRank <= 50">
          {{ `当前排名${myRank}，已邀请${myInviteCount}位好友` }}
        </span>
        <div @click.stop="gotoInvite" class="status">
          {{ inActivity ? "冲榜得奖励" : "邀请" }}
          <img
            src="../../../assets/images/invitingRank/icon_arrow_right.png"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import NetWork from '@/lib/network';

export default {
    name: 'liveRoomLandscape',
    props: {
        float: {
            type: Boolean,
            default: false,
        },
        isLiveOver: {
            type: Boolean,
            default: false,
        },
        roomInfo: {
            type: Object,
            require: true,
        },
        inviteParm: {
            type: String,
            require: true,
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
            activityEndTime: '', // 自定义截止时间
        };
    },
    directives: {
        realSrc: {
            async bind(el, binding, vnode) {
                const imgURL = binding.value; // 获取图片地址
                if (imgURL) {
                    const exist = await vnode.context.imageIsExist(imgURL);
                    if (exist) {
                        el.setAttribute('src', imgURL);
                    }
                }
            },
        },
    },
    computed: {
        displayTopInviters() {
            if (this.totalInviterCount === 0) {
                return [
                    {
                        isFakeMale: true,
                    },
                    {
                        isFakeFemale: true,
                    },
                    {
                        isFakeMale: true,
                    },
                ];
            }
            return this.topInviters.slice(0, 5);
        },
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
            this.$emit('updateActivityState', {
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
                '_alive/own_rank_top_five',
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
                            '/'
                        );
                    }
                }
            );
        },
        openRank() {
            this.$emit('openRank');
        },
        gotoInvite() {
            this.$emit('shareLive');
            this.$parent.dataReport('click_butt', { page_button: '邀请好友按钮' });
            location.href = this.roomInfo.invite_card_url;
        },
    },
};
</script>

<style lang="scss" scoped>
.container-entrance-float {
  font-family: "PingFangSC-Regular", "PingFang SC";
  .entrance {
    display: inline-flex;
    align-items: center;
    padding: 0 0.16rem 0 0.24rem;
    height: 0.56rem;
    background: linear-gradient(270deg, #ffe3bc 0%, #ffcc99 100%);
    border-radius: 0.28rem 0rem 0rem 0.28rem;
    font-size: 0.24rem;
    font-weight: 500;
    color: #ff781f;
  }
}
.container-entrance {
  min-width: 6.86rem;
  height: 1.88rem;
  font-family: "PingFangSC-Regular", "PingFang SC";
  background: linear-gradient(270deg, #ffb370 0%, #ff9747 40%, #ff781f 100%);
  background-image: url("//wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appAKLWLitn7978/image/khx0nxdm08b9kl5747wv.png?imageView2/2/w/686/h/188/q/100/format/webp"),
    url("http://wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appAKLWLitn7978/image/khx0nxdm08b9kl5747wv.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0.08rem;
  padding: 0.42rem 0.32rem 0.32rem;
  box-sizing: border-box;
  color: #ffffff;
  position: relative;
  &.is-empty {
    background-image: url("//wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appAKLWLitn7978/image/khx0nxdm0rs3jru2xajq.png?imageView2/2/w/686/h/188/q/100/format/webp"),
      url("http://wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com/appAKLWLitn7978/image/khx0nxdm0rs3jru2xajq.png");
    padding: 0.32rem;
    .invite-status {
      font-size: 0.28rem;
    }
  }
  .title-empty {
    font-size: 0.44rem;
    font-weight: bold;
    line-height: 0.6rem;
  }
  .title {
    position: absolute;
    top: 0;
    right: 0;
    height: 0.4rem;
    padding: 0 0.12rem;
    background: linear-gradient(
      to bottom right,
      rgba(255, 227, 188, 0.5) 0%,
      rgba(255, 204, 153, 0.5) 100%
    );
    border-radius: 0rem 0.08rem 0rem 0.08rem;
    font-size: 0.22rem;
    color: #ff781f;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .invite-list {
    display: flex;
    align-items: center;
    position: relative;
    .wrap-avatar {
      position: relative;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 100%;
      box-sizing: border-box;
      &:not(:first-child) {
        margin-left: -0.1rem;
      }
      &:nth-child(1) {
        border: 1px solid #ffd014;
        &::before {
          content: "";
          position: absolute;
          bottom: calc(100% - 2px);
          left: calc(50% - 0.14rem);
          display: inline-block;
          width: 0.28rem;
          height: 0.21rem;
          background: url("../../../assets/images/invitingRank/rank_first.png");
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
          bottom: calc(100% - 2px);
          left: calc(50% - 0.14rem);
          display: inline-block;
          width: 0.28rem;
          height: 0.21rem;
          background: url("../../../assets/images/invitingRank/rank_second.png");
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
          bottom: calc(100% - 2px);
          left: calc(50% - 0.14rem);
          display: inline-block;
          width: 0.28rem;
          height: 0.21rem;
          background: url("../../../assets/images/invitingRank/rank_third.png");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      &.is-fake {
        border: 0;
        &::before {
          display: none;
        }
        img {
          opacity: 0.9;
        }
      }
      .img-avatar {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .count {
      font-size: 0.24rem;
      font-weight: 500;
      margin-left: 0.08rem;
    }
  }
  .invite-status {
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    margin-top: 0.18rem;

    .status {
      font-family: "PingFangSC-Medium", "PingFang SC";
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.12rem 0 0.24rem;
      height: 0.48rem;
      margin-left: 0.16rem;
      background: linear-gradient(180deg, #fffab8 0%, #ffd866 100%);
      border-radius: 0.24rem;
      font-weight: 500;
      font-size: 0.26rem;
      color: #ff781f;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
}
</style>
