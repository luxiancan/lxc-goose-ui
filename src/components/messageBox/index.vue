<template>
    <div class="message-box__container" v-if="show">
        <div class="message-box__wrapper">
            <img class="message-box__close" @click="cancel" src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/cmVzb3VyY2UtY291cnNlQXJ0aWNsZS04MTQzMjU4Mg.png">
            <div class="message-box__title">{{title}}</div>
            <div class="message-box__content">{{content}}</div>
            <div class="message-box__button-group">
                <div class="message-box__button message-box__button-cancel theme-customize-bg" @click="cancel" v-if="showCancelButton">{{cancelText}}</div>
                <div class="message-box__button message-box__button-confirm theme-customize-bg" @click="confirm" v-if="showConfirmButton">{{confirmText}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "messageBox",
    props: {
        title: {
            type: String,
            default: '标题'
        },
        content: {
            type: String,
            default: ''
        },
        showCancelButton: {
            type: Boolean,
            default: true
        },
        showConfirmButton: {
            type: Boolean,
            default: true
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '确定'
        }
    },
    data() {
        return {
            show: false
        };
    },
    methods: {
        showBox() {
            this.show = true;
        },
        hideBox() {
            this.show = false;
        },
        cancel() {
            this.hideBox();
            this.callback('cancel', this)
        },
        confirm() {
            this.hideBox();
            this.callback('confirm', this)
        },
        callback(type) {
            let eventType = type === 'confirm' ? 'onConfirm': 'onCancel';
            this.$emit(eventType)
        }
    }
};
</script>

<style lang="scss" scoped>
.message-box {
    &__container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba($color: #000000, $alpha: .5);
    }

    &__wrapper {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding: .48rem .4rem;
        margin: 0 auto;
        width: calc(5rem - .8rem);
        background: #fff;
        border-radius: .08rem;
        text-align: center;
    }

    &__close {
        position: absolute;
        top: .24rem;
        right: .24rem;
        width: .28rem;
        height: .28rem;
    }

    &__title {
        font-size: .32rem;
        font-weight: 500;
    }

    &__content {
        margin: .32rem 0 .48rem;
        font-size: .24rem;
        text-align: center;
        line-height: 1.5;
    }

    &__button-group {
        display: flex;
        justify-content: center;
    }

    &__button {
        flex: 1;
        padding: .2rem;
        color: #fff;
        font-size: .28rem;
        border-radius: .4rem;
        cursor: pointer;
        background: #09bb07;
    }

    &__button-cancel + &__button-confirm {
        margin-left: .2rem;
    }
}
</style>