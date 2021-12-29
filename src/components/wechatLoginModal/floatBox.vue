<template>
    <div class="float-box-wrap" v-if="visible">
        <div class="box-mask" @click="handleClose"></div>
        <div class="float-box">
            <div class="box-header">
                <div class="box-title">选择登录方式</div>
                <div class="box-close" @click="handleClose">
                    <img :src="icon.close" alt="" />
                </div>
            </div>
            <div class="box-body">
                <div class="login-btn" @click="handleConfirm">
                    <img :src="icon.wechat" alt="" />
                    微信登录
                </div>
            </div>
            <div class="box-footer">
                <div>登录即代表您已同意</div>
                <div>
                    <a href="https://admin.xiaoe-tech.com/charge_protocol_page" target="charge_protocol_page">
                        《服务协议》
                    </a>
                    与
                    <a href="https://admin.xiaoe-tech.com/privacy_protocol_page" target="privacy_protocol_page">
                        《隐私政策》
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import wechat from './wechat.svg';
import close from './close.svg';
export default {
    name: 'FloatBox',
    components: {},
    mixins: [],
    props: {},
    data() {
        return {
            icon: { wechat, close },
            onConfirm: null,
            onClose: null,
            visible: false
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        handleConfirm() {
            this.onConfirm && this.onConfirm();
            this.visible = false;
        },
        handleClose() {
            this.onClose && this.onClose();
            this.visible = false;
        }
    },
    destroyed() {}
};
</script>

<style lang="scss" scoped>
.float-box-wrap {
    z-index: 90;
    height: 100vh;
    max-width: 480px;
    width: 100%;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    .box-mask {
        height: 100%;
        overflow: hidden;
        background-color: #25262d;
        opacity: 0.4;
        pointer-events: auto;
    }
    .float-box {
        position: absolute;
        bottom: 0;
        z-index: 100;
        width: 100%;
        height: 4.8rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #ffffff;
        font-size: 0.32rem;
        border-radius: 0.24rem 0.24rem 0 0;
        .box-header {
            height: 1rem;
            position: relative;
            padding: 0 0.32rem;
            margin-bottom: 0.95rem;
            .box-title {
                font-weight: 500;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            .box-close {
                float: right;
                height: 100%;
                display: flex;
                align-items: center;
            }
        }
        .box-body {
            padding: 0 1.9rem;
            margin-bottom: 0.95rem;
            .login-btn {
                img {
                    margin-right: 0.16rem;
                }
                height: 0.8rem;
                background: #07c160;
                border-radius: 0.4rem;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .box-footer {
            position: relative;
            bottom: 0;
            font-size: 0.24rem;
            text-align: center;
            height: 0.72rem;
            margin-bottom: 0.32rem;
            color: #999999;
            a {
                color: #105cfb;
            }
        }
    }
}
</style>