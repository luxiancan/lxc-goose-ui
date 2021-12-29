<template>
  <div v-show="isShowFriendModal" class="container-friends">
    <div class="header">
      <img
        @click="closeFriendModal"
        class="icon-left"
        src="../../../assets/images/invitingRank/icon_arrow_up.png"
      />
      邀请的好友
      <span class="count-style">{{ `（${count}）` }}</span>
    </div>
    <div class="friend-list canTouchMove">
      <div
        class="friend-item"
        v-for="(user, index) in friendList"
        :key="`friend-${index}`"
      >
        <img class="img-avatar" :src="user.wx_avatar" />
        <div class="name">
          {{ user.wx_nickname }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetWork from '@/lib/network';

export default {
    name: 'friends',
    props: {
        count: {
            type: Number,
            required: true
        },
        inviteParm: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isShowFriendModal: false,
            page: 0,
            friendList: [],
            isLoading: false
        };
    },
    created() {},
    mounted() {
        this.getInviteDetails(this.page).then(() => {});
        const ele = this.$el;
        ele.addEventListener('scroll', () => {
            const scrollHeight = ele.scrollHeight
            const scrollTop = ele.scrollTop;
            const clientHeight = ele.clientHeight;
            if (scrollHeight - clientHeight <= (scrollTop + 3)) {
                if (this.friendList.length < this.count && !this.isLoading) {
                    this.page = this.page + 1;
                    this.getInviteDetails(this.page).then(() => {});
                }
            }
        }, true);
    },
    methods: {
        showFriendModal() {
            this.isShowFriendModal = true;
        },
        closeFriendModal() {
            this.isShowFriendModal = false;
        },
        // 邀请的好友
        getInviteDetails(page) {
            this.isLoading = true;
            const that = this;
            return new Promise((resolve) => {
                NetWork.request(
                    '_alive/getInviteDetail',
                    {
                        inviteParm: that.inviteParm,
                        page,
                        count: 25
                    },
                    (res) => {
                        that.isLoading = false;
                        if (res.code === 0) {
                            const list = res.data || [];
                            // 去除重复
                            list.forEach((item) => {
                                if (!that.friendList.some(friend => friend.user_id === item.user_id)) {
                                    that.friendList.push(item);
                                }
                            });
                            resolve();
                        }
                    }
                );
            });
        },
    }
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
.container-friends {
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
  background: #ffffff;
  border-radius: 12px 12px 0px 0px;
  overflow: auto;
  box-sizing: border-box;
  z-index: 10002;
  color: #333333;
  &::-webkit-scrollbar {
    display: none;
  }
  .header {
    font-family: "PingFangSC-Medium", "PingFang SC";
    height: 0.8rem;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    position: fixed;
    z-index: 1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.32rem;
    font-weight: 500;
    border-radius: 16px 16px 0px 0px;
    .icon-left {
      position: absolute;
      left: 0.32rem;
      width: 0.4rem;
      transform: rotate(270deg);
    }
    .count-style{
      position: absolute;
      left: 60%;
    }
  }
  .friend-list {
    flex: 1;
    overflow: scroll;
    padding: 1.58rem 0.24rem 0.32rem;
    display: flex;
    flex-wrap: wrap;
    .friend-item {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin: 0 0.2rem 0.32rem;
      height: 1.64rem;
      .img-avatar {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 100%;
      }
      .name {
        width: 0.96rem;
        margin-top: 0.12rem;
        width: 0.96rem;
        font-size: 0.24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
