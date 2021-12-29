<template>
    <div class="share-tips-wrapper" @click.stop="closeTips">
        <div class="share-tips1">立即分享给好友吧</div>
        <div class="share-tips2">点击屏幕右上角将本页分享给好友</div>
        <img src="../../../assets/images/shareBox/share.png" alt="share-img" class="share-img">
    </div>
</template>

<script>
export default {
    name: 'shareTip',
    methods: {
        closeTips () {
            this.$emit('tipsclose')
        }
    }
};
</script>

<style lang="scss" scoped>
.share-tips-wrapper {
    box-sizing: border-box;
    position: relative;
    padding-top: 2.24rem;
    height: 100vh;
    color: #fff;
    text-align: center;
}

.share-tips1 {
    font-size: .4rem;
    font-weight: 600;
}

.share-tips2 {
    margin-top: .16rem;
    font-size: .36rem;
}

.share-img {
    position: absolute;
    top: .08rem;
    right: .78rem;
}
</style>