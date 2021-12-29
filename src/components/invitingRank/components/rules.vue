<template>
  <div v-if="isShowRules" class="container-rules">
    <div class="header">
      <img
        @click="closeRules"
        class="icon-left"
        src="../../../assets/images/invitingRank/icon_arrow_up.png"
      />
      规则说明
    </div>
    <div class="detail canTouchMove">
        <rich-text :text="ruleDetail"></rich-text>
    </div>
  </div>
</template>

<script>
import RichText from './richText';

export default {
    name: 'rules',
    components: {
        RichText,
    },
    props: {
        ruleDetail: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            isShowRules: false,
        };
    },
    created() {
    },
    methods: {
        showRules() {
            this.isShowRules = true;
        },
        closeRules() {
            this.isShowRules = false;
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
.container-rules {
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
  z-index: 1003;
  color: #333333;
  &::-webkit-scrollbar {
    display: none;
  }
  .header {
    font-family: "PingFangSC-Medium", "PingFang SC";
    font-weight: 500;
    height: 1.46rem;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    position: fixed;
    z-index: 1004;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.36rem;
    border-radius: 8px 8px 0px 0px;
    .icon-left {
      position: absolute;
      left: 0.32rem;
      width: 0.4rem;
      transform: rotate(270deg);
    }
  }
  .detail {
    flex: 1;
    overflow: scroll;
    padding: 1.58rem 0.32rem 0.32rem;
  }
}
</style>
