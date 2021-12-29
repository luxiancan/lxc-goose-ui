<template>
    <div class="wxa-container">
        <message-box ref="messageBox" title="提示" :content="content" :showCancelButton="false" confirmText="查看教程" @onConfirm="checkUrl"></message-box>
    </div>
</template>

<script>
import messageBox from '@/components/messageBox/index.vue';
import eJump from "@/lib/eJump.js";
import NetWork from '@/lib/network.js';
export default {
    name: 'authenticationMessageBox',
    components: {
        messageBox
    },
    data() {
        return {
            content: '设置结算失败，将无法获得收益请实名认证您的微信支付',
            redirectUrl: 'distribute_common_issue_answer?id=6'
        }
    },
    mounted() {
        this.checkUserToReceiver();
    },
    methods: {
        checkUserToReceiver() {
            NetWork.request('ecommerce/check_user_to_receiver', { }, ({code, data, msg}) => {
                if (code === 1) {
                    this.showMessageBox();
                }
            })
        },
        showMessageBox() {
            this.$refs.messageBox.showBox();
        },
        checkUrl() {
            eJump.jump(this.redirectUrl);
        }
    }
};
</script>

<style>
</style>