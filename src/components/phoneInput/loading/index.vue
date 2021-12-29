<!-- 正在加载组件 -->
<template>
    <div class="global-widget-loading" v-bind:style="{position:is_fixed,background: background}">
        <div class="loading-content" v-bind:style="{top: top}">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path" :style="{stroke: invite_color}"></circle>
            </svg>
            <p class="loadingText" :style="{ color: invite_color}">{{tip_txt}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name:'loading',
        props: {
            tip_txt:{
                default:'加载中'
            },
            is_fixed:{
                default:'absolute'
            },
            top: {
                default: '50%'
            },
            background:{
                default:'hsla(0,0%,100%,.9)'
            },
            // 好友邀请特殊色
            invite_color: {
                default: "#20a0ff"
            },
        },


    }
</script>

<style lang="scss">
    .global-widget-loading{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 10000;
        background: hsla(0,0%,100%,.9);
    }
    .loading-content{
        position: absolute;
        width: 100px;
        height: 75px;
        left: 50%;
        margin-left: -45px;
        margin-top: -37px;
    }
    .global-widget-loading .loadingText {
        text-align: center;
        color: #20a0ff;
        margin: 3px 0;
        font-size: 14px
    }

    .global-widget-loading .circular {
        width: 42px;
        height: 42px;
        -webkit-animation: loading-rotate 2s linear infinite;
        animation: loading-rotate 2s linear infinite
    }

    .global-widget-loading .path {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #20a0ff;
        stroke-linecap: round;
        -webkit-animation: loading-dash 1.5s ease-in-out infinite;
        animation: loading-dash 1.5s ease-in-out infinite
    }

    @keyframes loading-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -40px
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -120px
        }
    }

    @-webkit-keyframes loading-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -40px
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -120px
        }
    }

    @keyframes loading-rotate {
        100% {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn)
        }
    }

    @-webkit-keyframes loading-rotate {
        100% {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn)
        }
    }

    
    .loadingLine {
        color: #3b3229;
    }
</style>
