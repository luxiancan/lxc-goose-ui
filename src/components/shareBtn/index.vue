<template>
    <div v-if="distributeInfo.btn_show_status && distributeInfo.distribute_url">
        <div v-if="showBtn" class="distribute" ref="distribute" :style="{ zIndex: zIndex}">
            <div v-if="distributeInfo.btn_type === 0" class="inviteBtn BtnWrt" @click="goInviteCard(distributeInfo.btn_type)">
                <i class="iconfont icon-icon_invitecard theme-customize-font"></i>
                <p class="distributeNo t3">分享</p>
            </div>
            <div v-if="distributeInfo.price" class="inviteBtn BtnWrt" @click="goInviteCard(distributeInfo.btn_type)">
                <template v-if="distributeInfo.btn_type === 2 || distributeInfo.is_diy_promote_caption === 1">
                    <img class="icon-share" src="~@/assets/images/shareBtn/icon_share.png"/>
                    <p class="distributeNo t3">{{ distributeInfo.diy_text }}</p>
                </template>
                <template v-else-if="distributeInfo.btn_type === 1">
                    <img class="icon-share" src="~@/assets/images/shareBtn/icon_share.png"/>
                    <p class="distributeNo t3">得¥{{distributeInfo.price | ToPrice}}</p>
                </template>
            </div>
            <div v-if="distributeInfo.btn_type === 3" class="inviteBtn BtnWrt" @click="goInviteCard(distributeInfo.btn_type)">
                <i class="iconfont icon-icon_invitecard theme-customize-font"></i>
                <p class="distributeNo t3">分享</p>
            </div>
        </div>
    </div>
</template>

<script>
import eJump from '@/lib/eJump.js';
import { sensorsReport } from '../../lib/eventTracking';
export default {
    props: {
        marketingData: {
            type: Object,
            default: {}
        },
        zIndex: {
            type: Number,
            default: 10
        }
    },
    data () {
        return {
            timer: null,
            currentTop: 0,
            right: 0,
            showBtn: true
        };
    },
    mounted () {},
    computed: {
        distributeInfo() {
            return this.marketingData.distribute_info;
        },
        resourceType() {
            // resource_type： 4   ===   直播（带货）
            return this.marketingData.available_info.resource_type;
        },
        isFree() {
            // 盲猜是否是免费
            return this.marketingData.available_info.is_free;
        }
    },
    methods: {
        /**
         * goInviteCard 点击按钮后跳转分享卡片页面 + 埋点
         * Num btnType 按钮类型 0-分享 1-赚 2-自定义 3-邀请好友
         */
        goInviteCard(btnType) {
            // try {
            //     sensorsReport('ADM03003_goods_share', {
            //         activity_type: 0,
            //         resource_type: this.resourceType || ''
            //     })
            // } catch (err) {
            //     console.log(err);
            // }
            // if (this.resourceType == 4) {
            //     sensorsReport('click_butt', {
            //         page_module: 'H5',
            //         age_submodule: '直播',
            //         page_name: '直播详情页',
            //         page_button: '分享',
            //         c_user_id: window.USERID,
            //         app_id: window.APPID,
            //         from_share: this.getQueryString('from_share')?1:0,
            //         sharer_id: this.getQueryString('sharer_id')||''
            //     })
            // }
            // if (btnType == 0) {
            //     if (this.isFree) {
            //         this.dataUpPush('免费商品_分享_点击');
            //     } else {
            //         this.dataUpPush('付费商品_分享_点击');
            //     }
            // } else if (btnType == 1) {
            //         this.dataUpPush('赚xx_点击');
            // } else if (btnType == 2) {
            //         this.dataUpPush('自定义按钮_点击');
            // } else if (btnType == 3) {
            //     if (this.isFree) {
            //         this.dataUpPush('免费商品_邀请好友_点击');
            //     } else {
            //         this.dataUpPush('付费商品_邀请好友_点击');
            //     }
            // }
            // this.newDataUpPush(window.resourceName ? `详情页_推广员_${window.resourceName}` : '详情页_推广员');
            eJump.jump(`${this.distributeInfo.distribute_url}&show_retrun_btn=1`);
        },
        // 从url里拿出 推广员参数
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        // 埋点上报
        dataUpPush (data) {
            let dataUpArr = {
                et: 1,
                sc: 1003,
                cpg: '商品详情页',
                actn: data
            };
            window._YS_report.push([dataUpArr]);
        },
        // 颜值正义埋点上报
        newDataUpPush (data) {
            let dataUpArr = {
                et: 1,
                actn: data
            };
            window._YS_report.push([dataUpArr]);
        }
    },
    filters: {
        ToPrice: function (value) {
            return (value / 100).toFixed(2);
        }
    }
}
</script>

<style scoped lang="scss">
.distribute {
    position: fixed;
    top: 1rem;
    transition: all 0.2s linear;
    opacity: 0.8;
    right: 0;
}
@media (min-width: 480px) {
    .distribute {
        right: calc(50% - (480px / 2));
    }
}
.inviteBtn {
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0;
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
    opacity: 0.96;
    display: flex;
    align-items: center;
    z-index: 7
}
.BtnWrt {
    background-color: #ffffff;
    box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.18);
}
.inviteBtn img {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.25rem;
}
.inviteBtn .icon-share{
    width: 0.32rem;
    height: 0.32rem;
    margin-left: 0.2rem;
}
.inviteBtn i {
    font-size: .24rem;
    margin-left: 0.25rem;
    color: #09BB07;
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
}
.share-btn img {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.18rem;
}
.distributeNo {
    color: #353535;
    padding: 0 0.15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 2rem;
}
.invitebox {
    display: flex;
    flex-flow: column;
    text-align: center;
    font-size: 0;
    cursor: pointer;
    align-items: center;
}
.invitebox-img {
    width: 0.48rem;
    height: 0.48rem;
}
.invitebox-text {
    margin-top: 0.1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0.8rem;
}
</style>