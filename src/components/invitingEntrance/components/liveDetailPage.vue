<template>
  <div class="container-entrance" @click="openRank">
    <span class="title">
      邀请达人榜
    </span>
    <span v-if="inActivity" class="status">
      冲榜得奖励
    </span>
    <div v-if="totalInviterCount > 0" class="invite-list">
      <div
        class="wrap-avatar"
        v-for="(user, index) in topInviters"
        :key="user.share_user_id"
        :style="{ zIndex: topInviters.length - index }"
      >
        <img class="img-avatar" src="//wechatavator-1252524126.cos.ap-shanghai.myqcloud.com/aaa/default.svg" v-real-src="user.wx_avatar"  />
      </div>
      <div v-if="totalInviterCount > 3" class="wrap-avatar is-fake" :style="{ zIndex: 0 }">
        <img class="img-avatar" src="../../../assets/images/invitingRank/avatar_more.png"/>
      </div>
      <span v-if="totalInviterCount > 3" class="count">{{
        `${totalInviterCount}人`
      }}</span>
    </div>
    <div v-else class="invite-empty">
      快来第一个分享吧
      <img
        class="icon-right"
        src="../../../assets/images/invitingRank/icon_arrow_up.png"
      />
    </div>
  </div>
</template>

<script>
import NetWork from '@/lib/network';

export default {
    name: 'liveDetailPage',
    props: {
        isLiveOver: {
            type: Boolean,
            default: false
        },
        roomInfo: {
            type: Object,
            required: true
        },
        inviteParm: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            topInviters: [], // 前三名
            totalInviterCount: 0, // 达人榜总人数
            activitySwitch: false, // 是否关联活动
            activityEndType: 1, // 有效时间 1-直到直播结束，2-自定义时间
            activityEndTime: '', // 自定义截止时间
        }
    },
    directives: {
        realSrc: {
            async bind(el, binding, vnode) {
                const imgURL = binding.value;// 获取图片地址
                if (imgURL) {
                    const exist = await vnode.context.imageIsExist(imgURL);
                    if (exist) {
                        el.setAttribute('src', imgURL);
                    }
                }
            }   
        }
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
            this.$emit('updateActivityState', {
                activitySwitch: this.activitySwitch,
                inActivity: flag
            });
            return flag;
        }
    },
    created() {
        this.getInviteDetail();
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
                }
                img.onerror = function () {
                    resolve(false);
                    img = null;
                }
                img.src = url;
            })
        },
        getInviteDetail() {
            NetWork.request(
                '_alive/get_invite_details', 
                { 
                    alive_id: this.roomInfo.alive_id
                }, (res) => {
                    if (res.code === 0) {
                        this.topInviters = res.data.inviteList; 
                        this.totalInviterCount = res.data.inviteAllCount; 
                        this.activitySwitch = !!res.data.inviteActivitySwitchState; 
                        this.activityEndType = res.data.inviteActivityEndType; 
                        this.activityEndTime = res.data.inviteActivityEndTime.replace(/-/g, '/');
                    }
                }
            );
        },
        openRank() {
            this.$emit('openRank');
        }
    },
};
</script>

<style lang="scss" scoped>
.container-entrance {
  font-family: "PingFangSC-Regular", "PingFang SC";
  display: flex;
  align-items: center;
  height: 1.04rem;
  width: 100%;
  padding: 0 0.32rem;
  box-sizing: border-box;
  max-width: 480px;
  background: #fff;
  margin-bottom: 0.16rem;
  .title {
    font-family: "PingFangSC-Medium", "PingFang SC";
    font-weight: 500;
    font-size: 0.28rem;
    color: #ff781f;
    margin-right: 0.08rem;
  }
  .status {
    height: 0.41rem;
    background: #ff764d;
    border-radius: 0.2rem;
    color: #ffffff;
    padding: 0 0.16rem;
    font-size: 0.2rem;
    display: inline-flex;
    align-items: center;
  }
  .invite-list {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
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
          bottom: calc(100% - 1px);
          left: calc(50% - 0.08rem);
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
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
          bottom: calc(100% - 1px);
          left: calc(50% - 0.08rem);
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
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
          bottom: calc(100% - 1px);
          left: calc(50% - 0.08rem);
          display: inline-block;
          width: 0.16rem;
          height: 0.12rem;
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
      }
      .img-avatar {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background: #efefef;
      }
    }

    .count {
      font-size: 0.24rem;
      margin-left: 0.08rem;
    }
  }
  .invite-empty {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    color: #999999;
    font-size: 0.28rem;
    .icon-right {
      transform: rotate(90deg);
      width: 0.36rem;
    }
  }
}
</style>
