<template lang="html">
  <div id="wxshare" class="wx-share-container" v-if="is_show">
    <div class="send-friend-mask">
        <img src="@/assets/images/publicTop/img_floatLayer_arrow3.svg" alt="">
        <span>点击此页面右上角“…”，选择【发送给好友】</span>
        <div class="text_align" @click="is_show = false">我知道了</div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                is_show: false
            };
        },
        created () {
            this.$nextTick(() => {
                let modal = document.getElementById('wxshare');

                if (modal) {
                    modal.addEventListener('touchmove', e => {
                        e.preventDefault();
                    }, false);
                }
            });
            // 来自人人分销的商品链接，此时提示用户分享出去
            if (
                window.location.search.indexOf('fenxiao') > -1
                && document.referrer.indexOf('fenxiao')
                ) {
                this.is_show = true;
            }
        }
    };
</script>

<style lang="scss" scoped>
.wx-share-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    font-size: 0.32rem;
    .send-friend-mask {
        margin-top:0.14rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        font-size: 0.28rem;
        color: #fff;
        img{
            align-self: flex-end;
            text-align: right;
            margin-right:0.4rem;
        }
        div {
            width: 1.92rem;
            height: 0.72rem;
            margin-top: 0.34rem;
            line-height: 0.72rem;
            border-radius: 0.37rem;
            border: 1px solid rgba(255,255,255,1);
        }
    }
}
.text_align {
    text-align: center;
}
</style>
