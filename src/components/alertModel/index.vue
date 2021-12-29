<template>
    <div class="alert-model" v-show="visible">
        <div class="shade-box" @click="closeAlert"></div>
        <div class="alert-model-msg">
            <div class="alert-model-title">
                {{title}}
            </div>
            <div class="alert-model-content">
                {{content}}
            </div>
            <div class="alert-model-btn">
                <div v-show="btnText.length == 2" @click="leftBtnEvent" class="common-btn btn-left">
                    {{btnText[1]}}
                </div>
                <div class="common-btn btn-right theme-customize-font" @click="rightBtnEvent">
                    {{btnText[0]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SsAlertModel',
    props: {
        visible: {
            type:Boolean,
            default: false
        },
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        btnText: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        closeAlert() {
            this.$emit('update:visible', false);
            this.$emit('closeEvent', false);
        },
        leftBtnEvent() {
            this.$emit('update:visible', false);
            this.$emit('leftBtnEvent');
        },
        rightBtnEvent() {
            this.$emit('update:visible', false);
            this.$emit('rightBtnEvent');
        }
    }
}
</script>

<style scoped lang="scss">
    .alert-model{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
    }
    .shade-box{
        width: 100%;
        height: 100vh;
        background: #000000;
        opacity: 0.4;
    }
    .alert-model-msg{
        width: 5.9rem;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 10;
        background: #fff;
        transform: translate(-50%, -50%);
        border-radius: 0.16rem;
        .alert-model-title{
            color: #333333;
            font-size: 0.4rem;
            font-weight: 500;
            line-height: 0.56rem;
            text-align: center;
            padding: 0.48rem 0.48rem 0.32rem 0.48rem;
        }
        .alert-model-content{
            color: #666666;
            font-size: 0.32rem;
            padding: 0 0.48rem 0.48rem 0.48rem;
            line-height: 0.48rem;
            text-align: center;
        }
        .alert-model-btn{
            width: 5.9rem;
            height: 1.12rem;
            display: flex;
            border-top: 0.01rem #EEEEEE solid;
            .common-btn{
                flex: 1;
                line-height:1.12rem;
                text-align: center;
                font-size: 0.32rem;
                color: #09BB07;
            }
            .btn-left{
                border-right: 0.01rem #EEEEEE solid;
                color: #999999;
            }
        }
    }
</style>