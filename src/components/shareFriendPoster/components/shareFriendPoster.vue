<template>
    <div class="share-container" v-if="canCreateImg">
        <div class="mask" @click.stop.prevent="closeShare"></div>
        <div class="share-wrapper">
            <div class="share-rel-wrapper">
                <!-- 关闭按钮 -->
                <div class="icon-wrapper" @click.stop.prevent="closeShare">
                    <i class="iconfont icon-chuangguanshibai"></i>
                </div>
                <!-- 海报区 -->
                <!-- 生成图片之前显示正常dom -->
                <poster-dom v-if="!picSrc" :userInfo="user_info" :resourceInfo="resource_info" :shopName="shopName" :QRCodeUrl="QRCodeUrl" @onMounted="onPosterDomMounted"></poster-dom>
                <!-- 生成图片后只显示图片 -->
                <img :src="picSrc" alt="" class="post-img" v-else />
                <!-- 海报下文本 -->
                <div class="text-wrapper ET5 EC10">
                    <div>您有{{ surplus_num }}个名额可请好友免费学习</div>
                    <div>长按图片，即可发送</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import jsTool from '@xiaoe/js-tools';
import PosterDom from './posterDom';
import loading from '../assets/loading';

export default {
    components: {
        PosterDom,
    },
    props: ['posterData', 'showShareHint'],
    data() {
        return {
            shopName: '', // 店铺名称
            QRCodeUrl: '', // 二维码url
            resource_info: '', // 商品信息
            user_info: '', // 用户信息,
            picSrc: '' // 海报
        };
    },
    computed: {
        // 剩余的数量
        surplus_num() {
            return (this.posterData.share_info || {}).surplus_num || 0;
        },
        canCreateImg() {
            return this.QRCodeUrl && this.resource_info && this.user_info && this.shopName;
        }
    },
    methods: {
        // 获取分享的参数
        getShareInfo() {
            const { resource_id, resource_type, product_id } = this.posterData.available_info;
            const { content_app_id } = this.posterData.content_market_info;
            const params = {
                resource_id: resource_id || '',
                product_id: product_id || resourceId,
                resource_type: resource_type || '',
                payment_type: 2, // 直播的type永远是 2，问就是历史原因。
                content_app_id: content_app_id || ''
            };
            
            return jsTool.ajax({ url: 'poster_share/get_promotion', params }).then((res) => {
                if (res.code === 0) {
                    this.resource_info = res.data.resource_info;
                    this.user_info = res.data.user_info;
                    this.getQRCode();
                } else {
                    throw new Error('服务器报错啦');
                }
            });
        },
        // 生成二维码
        getQRCode() {
            jsTool.createQrcode(this.posterData.share_link, {}).then((res) => {
                this.QRCodeUrl = res;
            });
        },
        closeShare() {
            this.$emit('close', 'shareFriendPoster');
        },
        // 获取店铺信息，并且已经做了本地缓存)
        async getShopInfo() {
            let store_info = localStorage.getItem('store_info');
            if (store_info) {
                store_info = JSON.parse(store_info);
                this.shopName = store_info[window.APPID].store_name;
            } else {
                const params = {
                    bizData: {
                        app_id: window.APPID,
                        type: 1, // 支付和邀请码页面传0  顶部传1
                        resourceType: 0,
                        resourceId: ''
                    }
                };
                await jsTool.ajax({ url: 'getSubscribedQr', params }).then((res) => {
                    if (res.code === 0) {
                        const subscribeConfig = res.data;
                        this.shopName = subscribeConfig.home_title;
                    }
                });
            }
        },
        onPosterDomMounted(element) {
            loading.show();
            try {
                jsTool.generateImg(element).then((res) => {
                    this.picSrc = res;
                    loading.hide();
                });
            } catch (error) {
                window.console.error(error);
                loading.hide();
            }
        }
    },
    async created() {
        // 外部传入是否打开送好友看
        if (!this.picSrc && this.showShareHint) {
            await this.getShareInfo();
            await this.getShopInfo();
        }
    }
};
</script>
<style lang="scss" scoped>
.share-container {
    position: relative;
    .mask {
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        z-index: 100;
    }
    .share-wrapper {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 101;
        .post-img {
            width: 5.9rem;
            border-radius: 0.16rem;
        }
        .share-rel-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 101;
            position: relative;
            width: 5.9rem;
            border-radius: 0.16rem;
            box-sizing: border-box;
            .icon-wrapper {
                position: absolute;
                right: 0;
                top: 0;
                width: 0.72rem;
                height: 0.72rem;
                display: flex;
                align-items: center;
                justify-content: center;
                i {
                    font-size: 0.4rem;
                    color: #999;
                }
            }
        }
        .text-wrapper {
            margin-top: 0.32rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
</style>
