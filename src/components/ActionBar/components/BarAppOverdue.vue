<template>
    <div class="marketing-buttons">
        <a class="btn is-disabled">
            <div class="name">店铺已打烊</div>
        </a>
    </div>
</template>

<script>
export default {};
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
}
</style>
