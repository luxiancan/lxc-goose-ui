<template>
  <div class="swipe-box" v-if="swipeList.length > 0">
    <ul
      class="swipe-content"
      :class="{ 'swipe-top': swipeNum }"
      :style="{ top: swipeTop }"
    >
      <li class="swipe-text" v-for="(item, index) in swipeList" :key="index">
        <!-- <div ref="swipeslot"> -->
        <!-- <slot name="swipe-inner-content"></slot> -->
        <div class="buyer-content">
          <img :src="item.wx_avatar" alt="" class="buyer-avatar" />
          <div class="buyer-name">{{ item.wx_nickname }}购买了本商品</div>
        </div>
        <!-- </div> -->
      </li>
    </ul>
  </div>
</template>
<script>
import jsTools from "@xiaoe/js-tools";
export default {
  name: "SsVerticalSwiper",
  props: {
    delayNum: {
      type: Number,
      default: 3000
    },
    teamId: {
      type: String,
      default: ""
    }
  },
  computed: {
    swipeTop() {
      return -this.swipeNum * 54 + "px";
    }
  },
  data() {
    return {
      swipeNum: 0,
      // slotHeight: "", //slot单个内容的高度
      swipeList: []
    };
  },
  mounted() {
    this.getSwipeList();
  },
  methods: {
    //获取拼团买家列表
    getSwipeList() {
      let params = {
        app_id: window.APPID,
        team_buy_id: this.teamId
      };
      jsTools.request({ url: "get_user_list", params }).then(res => {
        this.swipeList = res.data;

        if (res.data && res.data.length > 0) {
          this.$nextTick(() => {
            // this.slotHeight = this.$refs["swipeslot"][0].offsetHeight;
            this.swipeMove();
          });
        }
      });
    },
    swipeMove() {
      setInterval(() => {
        if (
          this.swipeNum < this.swipeList.length - 1 &&
          this.swipeList.length > 1
        ) {
          this.swipeNum += 1;
        } else {
          //首尾循环，但限制长度
          if (this.swipeList.length < 20) {
            this.swipeList = this.swipeList.concat(this.swipeList);
            this.swipeNum += 1;
          } else {
            this.swipeNum = 0;
          }
        }
      }, this.delayNum);
    }
  }
};
</script>
<style lang="scss" scoped>
.swipe-box {
  z-index: 15;
  position: absolute;
  left: 0.32rem;
  height: 55px;
  // top: 0.32rem;
  overflow: hidden;
  .swipe-top {
    position: relative;
    transition: top 600ms;
  }
  .swipe-content {
    width: 100%;
  }
  .swipe-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 54px;
    .buyer-content {
      height: 30px;
      display: flex;
      align-items: center;
      padding: 0.06rem 0.16rem 0.06rem 0.06rem;
      box-sizing: border-box;
      background: rgba($color: #000000, $alpha: 0.5);
      border-radius: 0.3rem;
      .buyer-avatar {
        height: 0.48rem;
        width: 0.48rem;
        border-radius: 50%;
      }
      .buyer-name {
        font-size: 0.24rem;
        margin-left: 0.08rem;
        color: #fff;
        padding-bottom: 0.02rem;
      }
    }
  }
}
</style>
