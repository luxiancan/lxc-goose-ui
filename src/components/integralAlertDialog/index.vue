<template>
    <div class="dialog-container" v-show="visible">
        <div class="dialog-wrapper">
            <div class="dialog-title">
                {{title}}
            </div>
            <div class="content" v-html="content">
            </div>
            <div class="option-btn">
                <div class="common-btn left-btn" @click="cancelEvent">
                    {{cancelText}}
                </div>
                <div class="common-btn right-btn" @click="confirmEvent">
                    {{confirmText}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '积分兑换'
        },
        content: {
            type: String,
            default: '确认用400积分兑换此商品吗？'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelCallBack: {
            type: Function,
        },
        confirmCallBack: {
            type: Function,
        }
    },
    data() {
        return {}
    },
    methods: {
        cancelEvent() {
            this.cancelCallBack();
        },
        confirmEvent() {
            this.confirmCallBack();
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
    .dialog-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 6.08rem;
        height: 5.76rem;
        overflow: hidden;
        background: url('//wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/kk7owa5b0gaxz1voe9uq.png') no-repeat;
        background-size: 6.08rem 5.76rem;
        .dialog-title{
            height: 0.6rem;
            line-height: 0.6rem;
            text-align: center;
            font-size: 0.48rem;
            color: #fff;
            margin-top: 0.22rem;
        }
        .content{
            text-align: center;
            padding: 0 0.64rem;
            padding-top: 1.18rem;
            line-height: 0.6rem;
            color: #FF8205;
            font-weight: 500;
            font-size: 0.4rem;
        }
        .option-btn{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0.64rem;
            display: flex;
            justify-content: center;
            .common-btn{
                width: 2.64rem;
                height: 0.8rem;
                border-radius: 0.4rem;
                font-size: 0.32rem;
                line-height: 0.8rem;
                text-align: center;
            }
            .left-btn{
               border: 0.02rem solid #FF8205; 
               margin-right: 0.16rem;
               color: #FF8205;
            }
            .right-btn{
                color: #fff;
                background: linear-gradient(90deg, #FF8205 0%, #FFA406 100%);
            }
        }
    }
}
</style>
