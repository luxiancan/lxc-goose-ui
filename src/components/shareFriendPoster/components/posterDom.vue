<template>
  <div class="poster-wrapper EC10_BG">
    <!-- 用户信息 -->
    <div class="user-wrapper">
      <img :src="userInfo.wx_avatar" alt="" />
      <div class="name ET5 EC5">{{ userInfo.wx_nickname }}</div>
    </div>
    <!-- 暂时写死的文案 -->
    <div class="intro ET5">免费送你一门非常棒的课，快去看看吧～</div>
    <img class="goods-img" :src="resourceInfo.img_url" alt="" />
    <!-- 商品与店铺信息区 -->
    <div class="info-wrapper">
      <div class="left-text">
        <div class="goods-name EC15 ET5">
          {{ resourceInfo.title }}
        </div>
        <div class="shop-name ET6 c16">{{ shopName }}</div>
      </div>
      <div class="code-wrapper EC10_BG">
        <img :src="QRCodeUrl" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props: ['userInfo', 'resourceInfo', 'shopName', 'QRCodeUrl'],
    mounted() {
        this.$emit('onMounted', this.$el);
    },
};
</script>

<style lang="scss" scoped>
.poster-wrapper {
  background-image: url("http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/kf561bmw08nuc08sy728.png");
  background-size: 100%;
  background-repeat: no-repeat;
  position: relative;
  width: 5.9rem;
  border-radius: 0.16rem;
  padding: 0.48rem;
  box-sizing: border-box;
  .user-wrapper {
    display: flex;
    align-items: center;
    img {
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 50%;
    }
    .name {
      margin-left: 0.08rem;
      font-weight: 500;
    }
  }
  .intro {
    margin: 0.4rem 0 0.48rem 0.96rem;
    font-weight: 500;
    color: #a3b4cc;
  }
  .goods-img {
    width: 4.95rem;
    height: 3.7rem;
    border-radius: 0.16rem;
  }
  .info-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.98rem;
    .left-text {
      height: 1.44rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      .goods-name {
        width: 3.1rem;
        font-weight: 500;
        text-overflow: -o-ellipsis-lastline;
        height: 0.72rem;
        line-height: 0.36rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .code-wrapper {
      border-radius: 0.08rem;
      width: 1.44rem;
      height: 1.44rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
