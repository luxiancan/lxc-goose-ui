<template>
  <div class="team-header">
    <div class="icon-header">
      <img
        src="@/assets/images/teamBuy/teamTop1.png"
        alt=""
      />
      <div class="divider"></div>
      <img
        src="@/assets/images/teamBuy/teamTop2.png"
        alt=""
      />
      <div class="divider"></div>
      <img
        src="@/assets/images/teamBuy/teamTop3.png"
        alt=""
      />
    </div>
    <div class="text-header">
      <div class="text-wrapper">选择商品<br />开团/参团</div>
      <div class="text-wrapper">邀请好友<br />参团支付</div>
      <div class="text-wrapper">人满成团<br />失败退款</div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'SsTeamBuyTop'
};
</script>
<style lang="scss" scoped>
.team-header {
  background: #fff;
  padding: 0.32rem 0;
  width: 100%;
  margin-bottom: 0.16rem;
  .icon-header,
  .text-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .divider {
      width: 1.6rem;
      height: 0.02rem;
      background: #d8d8d8 linear-gradient(90deg, #fd5b64 0%, #ff8147 100%);
      border-radius: 0.02rem;
      opacity: 0.3;
      margin: 0 0.2rem;
    }
    img {
      width: 0.48rem;
      height: 0.48rem;
    }
    .text-wrapper {
      margin-top: 0.1rem;
      font-size: 0.26rem;
      color: #999;
      text-align: center;
      width: 33%;
    }
  }
}
</style>
