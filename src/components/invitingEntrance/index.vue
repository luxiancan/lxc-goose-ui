<template>
  <div :class="{ 'is-only-rank': onlyShowRank }">
    <live-detail-page
      v-if="scene === 'detailPage'"
      v-show="!onlyShowRank"
      @updateActivityState="updateActivityState"
      @openRank="onClick"
      @shareLive="shareLive"
      :isLiveOver="isLiveOver"
      :roomInfo="roomInfo"
      :inviteParm="inviteParm"
    ></live-detail-page>
    <live-room-landscape
      v-else-if="scene === 'liveRoomLandscape'"
      v-show="!onlyShowRank"
      @updateActivityState="updateActivityState"
      @openRank="onClick"
      @shareLive="shareLive"
      :isLiveOver="isLiveOver"
      :float="float"
      :roomInfo="roomInfo"
      :inviteParm="inviteParm"
    ></live-room-landscape>
    <live-room-vertical
      v-else-if="scene === 'liveRoomVertical'"
      v-show="!onlyShowRank"
      @updateActivityState="updateActivityState"
      @openRank="onClick"
      @shareLive="shareLive"
      :isLiveOver="isLiveOver"
      :roomInfo="roomInfo"
      :inviteParm="inviteParm"
    ></live-room-vertical>
  </div>
</template>

<script>
import Vue from "vue";
import LiveDetailPage from "./components/liveDetailPage";
import LiveRoomLandscape from "./components/liveRoomLandscape";
import LiveRoomVertical from "./components/liveRoomVertical";
import InvitingRank from "../invitingRank";
import { sensorsReport } from "../../lib/eventTracking";

export default {
  name: "invitingEntrance",
  components: {
    LiveDetailPage,
    LiveRoomLandscape,
    LiveRoomVertical,
  },
  props: {
    float: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: String,
      required: true,
    },
    roomInfo: {
      type: Object,
      required: true,
    },
    onlyShowRank: {
      type: Boolean,
      default: false,
    },
    updateTiming: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      inActivity: false,
      activitySwitch: false,
      inviteParm: null,
      refInvitingRank: null,
      // 自动刷新排行榜的定时器
      timer: null
    };
  },
  computed: {
    isLiveOver() {
      return (
        this.roomInfo.alive_state === 3 ||
        ((this.roomInfo.alive_type === 2 || this.roomInfo.alive_type === 4) &&
          this.roomInfo.alive_state === 2)
      );
    },
  },
  methods: {
    onClick(isInDirect = false) {
      if (this.refInvitingRank) {
        // 点击了入口之后会发生请求
        this.refInvitingRank.showInvitingRank();
        this.dataReport(
          "click_butt",
          isInDirect ? { page_button: "邀请达人榜-更多入口" } : {}
        );
      }
    },
    updateActivityState({ activitySwitch, inActivity }) {
      this.inActivity = inActivity;
      this.activitySwitch = activitySwitch;
      this.refInvitingRank.$props.inActivity = this.inActivity;
      this.refInvitingRank.$props.activitySwitch = this.activitySwitch;
    },
    generateBase64(paymentType, resourceType, resourceId, productId) {
      const params = {
        payment_type: paymentType,
        resource_type: resourceType,
        resource_id: resourceId,
        product_id: productId,
      };
      return btoa(JSON.stringify(params));
    },
    dataReport(eventName, options) {
      try {
        const pageName =
          this.scene === "detailPage" ? "直播详情页" : "直播间页面";
        const pageButton =
          this.scene === "detailPage"
            ? "邀请达人榜-详情页入口"
            : `邀请达人榜-${this.float ? "悬浮" : "直播间"}入口`;
        const buttonStatus = this.activitySwitch ? "开启活动" : "未开启活动";
        const type =
          this.roomInfo.alive_type === 0
            ? "5"
            : `${this.roomInfo.alive_conf.alive_mode === 0 ? "3" : "4"}`;
        const trackData = {
          page_module: "H5",
          page_submodule: "直播",
          page_name: pageName,
          type,
          page_button: pageButton,
          button_status: buttonStatus,
        };
        sensorsReport(eventName, Object.assign(trackData, options));
      } catch (e) {
        window.console.log(e);
      }
    },
    startOverRefresh() {
      // 如果传进刷新排行榜时间
      if (this.updateTiming && this.timer === null) {
        // 这里要求最快是30秒刷一次，符合后端的刷新频率
        const updateTiming =
          this.updateTiming < 30000 ? 30000 : this.updateTiming;
        this.timer = setInterval(() => {
          if (this.refInvitingRank) {
            this.refInvitingRank.getInviteList();
          }
        }, updateTiming);
      }
    },
    terminationRefresh() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    shareLive() {
      this.$emit("shareLive");
    },
  },
  created() {
    this.inviteParm = this.generateBase64(2, 4, this.roomInfo.alive_id, "");
    const InvitingRankCls = Vue.extend(InvitingRank);
    this.refInvitingRank = new InvitingRankCls().$mount();
    this.refInvitingRank.$props.inActivity = this.inActivity;
    this.refInvitingRank.$props.activitySwitch = this.activitySwitch;
    this.refInvitingRank.$props.roomInfo = this.roomInfo;
    this.refInvitingRank.$props.inviteParm = this.inviteParm;
    this.refInvitingRank.$props.scene = this.scene;
    this.refInvitingRank.$props.onlyShowRank = this.onlyShowRank;
    this.refInvitingRank.$parent = this;
    this.refInvitingRank.$on("onClose", ({ onlyShowRank }) => {
      if (onlyShowRank === false) {
        this.terminationRefresh();
      }
      this.$emit("onClose");
    });
    this.refInvitingRank.$on("shareLive", () => {
      this.$emit("shareLive");
    });
    this.refInvitingRank.$on("onOpen", ({ onlyShowRank }) => {
      if (onlyShowRank === false) {
        this.startOverRefresh();
      }
      this.$emit("onOpen");
    });
  },
  async mounted() {
    if (this.onlyShowRank) {
      this.$el.appendChild(this.refInvitingRank.$el);
      this.roomInfo.alive_conf.is_invite_on && this.onClick();
    } else {
      document.body.appendChild(this.refInvitingRank.$el);
    }
    if (this.onlyShowRank) {
      this.startOverRefresh();
    }
  },
  activated() {
    this.startOverRefresh();
  },
  deactivated() {
    this.terminationRefresh();
  },
  destroyed() {
    if (this.onlyShowRank) {
      this.$el.removeChild(this.refInvitingRank.$el);
    } else {
      document.body.removeChild(this.refInvitingRank.$el);
    }
    this.terminationRefresh();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.is-only-rank {
  height: 100%;
}
</style>
