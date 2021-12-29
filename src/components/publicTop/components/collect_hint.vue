<!--收藏-->
<template>
    <div v-show="show" class="to-collect">
        <div @click="close" class="collect-bg"></div>
        <img src="@/assets/images/publicTop/collect.png" />
    </div>
</template>

<script>
    import EventBus from '@/lib/eventbus.js';

    export default {
        data: function() {
            return {
                show: false,
            };
        },
        created: function() {
            let that = this;
            EventBus.$on('alert_collect_hint', function() {
                that.show = true;
            });
        },
        methods: {
            close: function() {
                this.show = false;
            }
        }
    };
</script>

<style lang="scss" scoped >
    .to-collect > img {
        width: 4.14rem;
        height: 1.22rem;
        position: absolute;
        top: 0.21rem;
        right: 0.2rem;
    }
    .collect-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.6);
    }
    .to-collect {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100000;
    }
</style>