<template>
    <div class="tax-sign__container" v-show="show" :style="{'z-index': zIndex}">
        <div class="tax-sign__wrapper">
            <div class="tax-sign__title">
                <img src="./image/img.png" alt="">
            </div>
            <div class="tax-sign__content">
                <div>根据《个人所得税法》规定，个人收入需要缴纳个税；</div>
                <div>{{content}}<span class="tax-sign__text">个人信息认证</span>，否则商家无法给您发放佣金</div>
            </div>
            <div class="tax-sign__button-group">
                <div class="tax-sign__button tax-sign__button-cancel theme-customize-bg" @click="confirm">去认证</div>
                <div class="tax-sign__button tax-sign__button-confirm" @click="cancel">下次再说</div>
            </div>
        </div>
    </div>
</template>

<script>
import eJump from '@/lib/eJump';
import NetWork from '@xiaoe/js-tools';

export default {
    name: 'taxSign',
    props: {
        zIndex: {
            type: Number,
            default: 10
        },
        signScene: {
            type: Number,
            default: 0,
        },
        needScene: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            show: false,
            buffer_time: '',
            taxSignResult: null,
            is_sign_user: false
        };
    },
    created() {
        this.taxSignResult = this.taxSignConfirm();
    },
    computed: {
        content() {
            if (this.buffer_time) {
                return `请您在${this.buffer_time}前完成`;
            }
            return '请您点击“去认证”，完成';
        }
    },
    methods: {
        taxSignConfirm() {
            // const hasTaxSign = localStorage.getItem('tax_sign');
            // if (hasTaxSign == '1') {
            //     return Promise.resolve(true);
            // }

            try {
                if (this.taxSignResult) {
                    return this.taxSignResult;
                }
            } finally {
                this.taxSignResult = null;
            }

            return NetWork.request({
                url: '/pay_tax/sign_info'
            }).then(({ code, data }) => {
                if (code === 0) {
                    this.buffer_time = data.buffer_time;
                    this.is_sign_user = data.is_sign_user;

                    // 不需要判断场景值的地方，只要未签约就显示弹窗
                    if (!this.needScene) {
                        this.showBox();

                        if (data.is_sign_user !== true) {
                            return false;
                        }
                        return true;
                    }

                    if (data.is_sign_user !== true && data.tip_scene.includes(this.signScene)) {
                        this.showBox();
                        return false;
                    }

                    if (data.is_sign_user) {
                        localStorage.setItem('tax_sign', 1);
                    }
                    return true;
                } else {
                    return false;
                }
            }).catch(() => false)
        },
        showBox() {
            this.show = true;
        },
        hideBox() {
            this.show = false;
        },
        cancel() {
            this.$emit('cancelSign');
            this.hideBox();
        },
        confirm() {
            if (!this.needScene && this.is_sign_user) {
                eJump.jump('/v1/tax/result')
            } else {
                eJump.jump('/v1/tax/step');
            }
            
            this.hideBox();
        },
    }
};
</script>

<style lang="scss" scoped>
.tax-sign {
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
        width: calc(76.8% - .8rem);
        background: #fff;
        border-radius: .16rem;
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
        font-size: .32rem;
        text-align: justify;
        line-height: 1.5;
        color: #666;
    }

    &__text {
        font-weight: 500;
    }

    &__button {
        width: 71.9%;
        padding: .2rem 0;
        margin: 0 auto;
        color: #fff;
        font-size: .28rem;
        border-radius: .4rem;
        cursor: pointer;
        background: #09bb07;
    }

    &__button-cancel + &__button-confirm {
        margin-top: .32rem;
        background: #fff;
        border: 1px solid #ccc;
        color: #333;
    }
}
</style>
