<!--弹窗样式2，内容可传入-->
<template>
    <div v-if="show_box" class="alert-window-wrapper-2">
        <div class="alert-window-container-2">
            <!--标题-->
            <div :style="title_style" class="title c2" v-text="title"></div>
            <!--内容-->
            <div class="contents c3" v-html="contents"></div>
            <!--按钮-->
            <div class="button-container">
                <div
                    @click="close"
                    v-if="button_type === 2"
                    :class="{ 'width-style-50': true }"
                    class="t1 c2 ctr-button cancel-btn pressGreyBg"
                    v-text="cancel"
                ></div>
                <div
                    @click="confirmCallback"
                    :class="{ 'width-style-50': button_type === 2, 'width-style-100': button_type === 1 }"
                    class="t1 ctr-button pressGreyBg theme-customize-font"
                    :style="{ color: confirm_color }"
                    v-text="confirm"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/lib/eventbus';

export default {
    data: function() {
        return {
            title: '提示', // 标题
            contents: '', // 内容
            button_type: 1, // 1 表示一个按钮，2 表示两个按钮
            cancel: '取消',
            cancel_color: '#888888', // 取消的颜色
            confirm: '确定',
            confirm_color: '#00b51e', // 确定的颜色
            confirmCallback: '',
            cancelCallback: '',
            show_box: false,
            title_style: {}
        };
    },
    created: function() {
        // 配置
        EventBus.$on('alert_box_2', this.setInfo);
        // 关闭
        EventBus.$on('close_alert_box_2', this.close);

        // 直接关闭，不做其他任何操作，实物订单详情页‘取消’订单时添加
        EventBus.$on('close_alert_box', this.closeBox);
    },
    methods: {
        // 配置
        setInfo: function(info, callback, cancelCallback) {
            this.title = info.title || this.title;
            this.contents = info.contents || this.contents;
            this.button_type = info.button_type || this.button_type;
            this.cancel = info.cancel || this.cancel;
            this.cancel_color = info.cancel || this.cancel_color;
            this.confirm = info.confirm || this.confirm;
            this.confirm_color = info.confirm_color || this.confirm_color;
            this.confirmCallback = callback || this.close;
            this.cancelCallback = cancelCallback || this.close;
            this.show_box = true;
            this.title_style = info.title_style || this.title_style; // 内容的样式
        },
        // 取消
        close: function() {
            if (!this.show_box) {
                return;
            }
            this.show_box = false;
            this.cancelCallback();
            this.title = '提示';
            this.contents = '';
            this.button_type = 1;
            this.cancel = '取消';
            this.cancel_color = '#888888';
            this.confirm = '确定';
            this.confirm_color = '#00b51e';
            this.confirmCallback = '';
        },
        closeBox: function() {
            this.show_box = false;
        }
    }
};
</script>

<style scoped>
.width-style-50 {
    width: calc(50% - 1px);
}
.width-style-100 {
    width: 100%;
}
.cancel-btn {
    border-right: 1px solid #e5e5e5;
}
.button-container {
    margin-top: 0.4rem;
    border-top: 1px solid #e5e5e5;
    font-size: 0;
}
.alert-window-container-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.alert-window-wrapper-2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
}
.title {
    padding-top: 0.5rem;
    font-size: 0.36rem;
    text-align: center;
    line-height: 1;
}
.ctr-button {
    display: inline-block;
    height: 0.89rem;
    line-height: 0.89rem;
    text-align: center;
}
.alert-window-container-2 {
    width: 5.6rem;
    border-radius: 0.08rem;
    background-color: #fff;
}
.contents {
    margin-top: 0.3rem;
    padding: 0 0.4rem;
    font-size: 0.3rem;
    text-align: center;
}
</style>
