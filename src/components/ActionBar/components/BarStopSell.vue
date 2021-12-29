<template>
    <div class="marketing-buttons">
        <div class="remind">已暂停售卖，看看其他课程吧~~</div>
        <a @click="gotoHomePage" class="btn theme-customize-bg theme-customize-font-black">
            <div class="name">查看其它课程</div>
        </a>
    </div>
</template>

<script>
export default {
    methods: {
        gotoHomePage() {
            window.location.href = window.location.host;
        }
    }
};
</script>

<style lang="scss" scoped>
.marketing-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    .btn {
        height: 0.76rem;
        flex: 1;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        border-radius: 0.38rem;
        line-height: 100%;
        background: #09bb07;
        font-family: 'PingFangSC-Medium', 'PingFang SC';
        font-weight: 500;
        font-size: 0.28rem;
        &.is-disabled {
            background: #c8c8c8;
        }
    }
    .remind {
        position: absolute;
        height: 0.68rem;
        left: 0;
        right: 0;
        z-index: 1;
        bottom: 100%;
        background: #fbf5ec;
        color: #ffb04f;
        font-size: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
