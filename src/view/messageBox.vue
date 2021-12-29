<template>
    <div class="container">
        <div class="title">messageBox</div>
        <div class="content">
            <ss-button @click="showMessageBox">弹窗</ss-button>
        </div>
    </div>
</template>

<script>
import SSButton from "@/components/button";
import messageBox from "@/components/messageBox";

export default {
    components: {
        messageBox: messageBox,
        "ss-button": SSButton,
    },
    data() {
        return {
        };
    },
    methods: {
        showMessageBox() {
            this.$alert({
                title: '我是一个标题',
                content: '我是一段描述',
                // showCancelButton: false,
                confirmText: 'ok'
            })
        }
    }
    
};
</script>

<style lang="scss" scoped>
.title {
    padding: 20px;
    line-height: 50px;
    font-size: 32px;
    font-weight: 600;
    color: #353535;
}
.content {
    padding: 0 20px;
}
</style>