<template>
    <div
        v-if="!isLive"
        class="distribute"
        ref="distribute"
    >
        <template v-if="isDistributeInfoIntegrity && isShowShare">
            <!-- 分享 -->
            <div
                v-if="distributeInfo.btn_type === 0"
                class="invite-btn btn-wrt"
                @click="goInviteCard"
            >
                <i class="iconfont icon-icon_invitecard theme-customize-font"></i>
                <p class="distribute-no t3">分享</p>
            </div>
            <div
                v-if="distributeInfo.price"
                class="invite-btn btn-wrt"
                @click="goInviteCard"
            >
                <template v-if="distributeInfo.btn_type === 2 || distributeInfo.is_diy_promote_caption === 1">
                    <img class="icon-share" src="@/assets/images/shareBtn/icon_share.png" />
                    <p class="distribute-no t3">{{ distributeInfo.diy_text }}</p>
                </template>
                <template v-else-if="distributeInfo.btn_type === 1">
                    <img class="icon-share" src="@/assets/images/shareBtn/icon_share.png" />
                    <p class="distribute-no t3">得¥{{distributeInfo.price | toPrice}}</p>
                </template>
            </div>
            <div
                v-if="distributeInfo.btn_type === 3"
                class="invite-btn btn-wrt"
                @click="goInviteCard"
            >
                <i class="iconfont icon-icon_invitecard theme-customize-font"></i>
                <p class="distribute-no t3">分享</p>
            </div>
        </template>
    </div>
    <div v-else class="share-btn-wrapper">
        <template v-if="hasDistributeInfo && isShowShare">
            <template v-if="hasText">
                <div class="share-text-container" @click="goShare">
                    <!-- 普通的分享按钮 -->
                    <template v-if="[0, 3].includes(distributeInfo.btn_type)">
                        <img src="@/assets/images/aliveIcon/share_btn.svg" class="share-img" />
                        <span class="share-txt">分享</span>
                    </template>
                    <!-- 推广员专属分享按钮 -->
                    <template v-else-if="distributeInfo.price">
                        <img src="@/assets/images/aliveIcon/share_distribute_btn.png" class="share-img" />
                        <!-- 文案有默认和自定义的区分，设置路径：B端 营销中心 -> 推广员 -> 推广商品 -> 商品设置 -->
                        <template v-if="distributeInfo.btn_type === 2 || distributeInfo.is_diy_promote_caption === 1">
                            <span class="share-txt">{{ distributeInfo.diy_text }}</span>
                        </template>
                        <template v-else-if="distributeInfo.btn_type === 1">
                            <span class="share-txt">得¥{{ distributeInfo.price | toPrice }}</span>
                        </template>
                    </template>
                </div>
            </template>
            <template v-else>
                <img src="@/assets/images/aliveIcon/share.png" class="share-img" @click="goShare" />
            </template>
        </template>
    </div>
</template>

<script>
import { isXiaoEHelperApp, isXiaoESDK } from '@/utils/judgeEnv';
import NetWork from '@/lib/network';
import eJump from '@/lib/eJump'

export default {
    name: 'shareBtn',
    props: {
        // 是否为直播页面（目前分享分为直播｜统一商品两种情况）
        isLive: {
            type: Boolean,
            default: true
        },
        // 是否含有“分享”文本。该值为false时，就显示一个分享图标
        hasText: {
            type: Boolean,
            default: true
        },
        distributeInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isShowShare: true
        };
    },
    computed: {
        hasDistributeInfo() {
            return this.distributeInfo && Object.keys(this.distributeInfo).length > 0;
        },
        isDistributeInfoIntegrity() {
            return this.distributeInfo && this.distributeInfo.btn_show_status && this.distributeInfo.distribute_url;
        }
    },
    methods: {
        goShare() {
            this.$emit('beforeShare');
            if (isXiaoEHelperApp() && this.$xiaoEHelperAppSdk) {
                this.$xiaoEHelperAppSdk.handler('openSharePopUp');
            } else {
                window.location.href = this.distributeInfo.distribute_url;
            }
        },
        goInviteCard() {
            this.$emit('beforeShare');
            if (isXiaoEHelperApp() && this.$xiaoEHelperAppSdk) {
                this.$xiaoEHelperAppSdk.handler('openSharePopUp');
            } else {
                const prefix = this.distributeInfo.distribute_url.indexOf('?') !== -1 ? '&' : '?'
                eJump.jump(`${this.distributeInfo.distribute_url}${prefix}show_retrun_btn=1`);
            }
        },
        initAppSdkConfig() {
            if (!isXiaoESDK()) {
                return;
            }
            const localConf = JSON.parse(localStorage.getItem('SDKConf'));
            if (!localConf || this.hasExpired(localConf.date)) {
                this.fetchAppSdkConfig();
            } else {
                this.isShowShare = Boolean(localConf.is_show_share_nav);
            }
        },
        hasExpired(date) {
            return new Date() - new Date(date) > 300000;
        },
        fetchAppSdkConfig() {
            NetWork.request(
                'sdk_app_config',
                {},
                (({ code, data }) => {
                    if (code === 0) {
                        this.isShowShare = Boolean(data.is_show_share_nav);
                        this.saveConfigToLocal(data);
                    }
                })
            );
        },
        saveConfigToLocal(conf) {
            const sdkConf = {
                ...conf,
                date: new Date()
            };
            localStorage.setItem('SDKConf', JSON.stringify(sdkConf));
        }
    },
    filters: {
        toPrice(value) {
            return (value / 100).toFixed(2);
        }
    },
    created() {
        this.initAppSdkConfig();
    }
};
</script>

<style lang="scss" scoped>
.distribute {
    position: fixed;
    top: 1rem;
    transition: all 0.2s linear;
    opacity: 0.8;
    right: 0;
}
@media (min-width: 480px) {
    .distribute {
        right: calc(50% - 240px);
    }
}
.distribute {
    .invite-btn {
        height: 0.6rem;
        line-height: 0.6rem;
        border-top-left-radius: 0.3rem;
        border-bottom-left-radius: 0.3rem;
        font-size: .24rem;
        opacity: 0.96;
        display: flex;
        align-items: center;
        img {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.25rem;
        }
        .icon-share {
            width: 0.32rem;
            height: 0.32rem;
            margin-left: 0.2rem;
        }
        i {
            font-size: 0.24rem;
            margin-left: 0.25rem;
            color: #09bb07;
        }
    }
    .btn-wrt {
        background-color: #ffffff;
        box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.18);
    }
    .img-circle {
        border-radius: 0.24rem;
    }
    .share-btn {
        display: flex;
        align-items: center;
        margin-top: 0.2rem;
        margin-right: 0.2rem;
        width: 1.4rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.3rem;
        img {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.18rem;
        }
    }
    .distribute-no {
        color: #353535;
        padding: 0 0.15rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 2rem;
    }
}

.share-btn-wrapper {
    position: absolute;
    z-index: 10;
    display: flex;
    .share-text-container {
        padding: 0 0.16rem 0 0.2rem;
        height: 0.48rem;
        background: white;
        box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.1);
        border-radius: 2rem 0rem 0rem 2rem;
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #105cfb;
        .share-img {
            width: 0.28rem;
            height: 0.28rem;
            margin-right: 0.1rem;
        }
        .share-txt {
            line-height: 1;
        }
    }
    .share-img {
        width: 0.36rem;
        height: 0.36rem;
    }
}
</style>
