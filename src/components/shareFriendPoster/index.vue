<template>
    <div>
        <template v-if="isWeChat">
            <share-friend-poster
                v-show="showShareHint"
                :showShareHint="showShareHint"
                :posterData="shareInfo"
                @close="onClose"
            ></share-friend-poster>
            <div v-show="showShareHint && surplusNum <= 0" @click="showHint(0)" class="share_container">
                <span>您的名额已用光，不可继续请好友看</span>
            </div>
        </template>
        <!-- 非微信生态分享弹框 -->
        <share-box
            v-else-if="showShareBox && !isWeChat"
            :boxTitle="boxTitle"
            qrTitle="分享好友二维码"
            :copy_url="shareInfo.share_link"
            @boxClose="onClose"
        />
    </div>
</template>

<script>
import toast from '@/lib/toast.js';
import shareFriendPoster from './components/shareFriendPoster';
import shareBox from '../shareBox';

export default {
    components: {
        shareFriendPoster,
        shareBox
    },
    props: {
        shareInfo: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        surplusNum() {
            return (this.shareInfo?.share_info || {}).surplus_num || 0;
        },
        boxTitle() {
            return `分享给好友,前${this.shareInfo?.share_info?.product_info?.share_listen_count}人免费听`;
        },
    },
    data() {
        return {
            showShareHint: false,
            showShareBox: false,
            isWeChat: window.wx.CLIENT_ENV === 'wechat' // 是否是微信环境
        }
    },
    created() {
        this.showHint(1);
    },
    mounted() {
        
    },
    methods: {
        /**
         * 显示分享提示
         */
        showHint(status) {
            // 请好友看分享上限到达之后弹出toast：抱歉，最多可请好友看x期内容，您已用完
            if (status === 1) {
                if (
                    this.shareInfo?.share_info?.product_info?.share_listen_resource -
                        this.shareInfo?.share_info?.share_resource >
                        0 ||
                    this.shareInfo?.share_info?.product_info?.share_listen_resource == 0
                ) {
                    this.showShareHint = true;
                    this.showShareBox = true;
                } else {
                    this.showShareHint = false;
                    toast(
                        `抱歉，最多可请好友看${ 
                            this.shareInfo?.share_info?.product_info?.share_listen_resource 
                        }期内容，您已用完`
                    );
                }
            } else if (status === 0) {
                this.showShareHint = false;
            }
        },
        onClose(str) {
            if (str == 'shareBox') {
                this.showShareBox = false;
            } else if (str == 'shareFriendPoster') {
                this.showShareHint = false;
            }
            this.$emit('close');
        }
    },
};
</script>

<style lang="scss" scoped>
.share_container {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: 20001;
}
.share_container > span {
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
    display: block;
    width: 4.2rem;
    padding: 0.3rem;
    background: #fff;
    color: #000;
    font-size: 0.28rem;
    line-height: 0.36rem;
    -webkit-border-radius: 0.08rem;
    -moz-border-radius: 0.08rem;
    border-radius: 0.08rem;
}
.share_container span:after {
    content: '';
    position: absolute;
    right: 0.2rem;
    top: -0.28rem;
    width: 0;
    height: 0;
    display: block;
    border-left: 0.1rem solid transparent;
    border-top: 0.15rem solid transparent;
    border-right: 0.1rem solid transparent;
    border-bottom: 0.15rem solid #fff;
}
</style>
