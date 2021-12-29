import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/view/index')
        },
        {
            path: '/button',
            name: 'button',
            component: () => import('@/view/button')
        },
        {
            path: '/footer',
            name: 'footer',
            component: () => import('@/view/footer')
        },
        {
            path: '/publicTop',
            name: 'publicTop',
            component: () => import('@/view/publicTop')
        },
        {
            path: '/couponList',
            name: 'couponList',
            component: () => import('@/view/couponList')
        },
        {
            path: '/couponItem',
            name: 'couponItem',
            component: () => import('@/view/couponItem')
        },
        {
            path: '/couponSelect',
            name: 'couponSelect',
            component: () => import('@/view/couponSelect')
        },
        {
            path: '/payGiftPromoCode',
            name: 'payGiftPromoCode',
            component: () => import('@/view/payGiftPromoCode')
        },
        {
            path: '/shareBox',
            name: 'shareBox',
            component: () => import('@/view/shareBox')
        },
        {
            path: '/shareAndCopy',
            name: 'shareAndCopy',
            component: () => import('@/view/shareAndCopy')
        },
        {
            path: '/entityGift',
            name: 'entityGift',
            component: () => import('@/view/entityGift')
        },
        {
            path: '/customerService',
            name: 'customerService',
            component: () => import('@/view/customerService')
        },
        {
            path: '/invoiceSelect',
            name: 'invoiceSelect',
            component: () => import('@/view/invoiceSelect')
        },
        {
            path: '/messageBox',
            name: 'messageBox',
            component: () => import('@/view/messageBox')
        },
        {
            path: '/authenticationMessageBox',
            name: 'authenticationMessageBox',
            component: () => import('@/view/authenticationMessageBox')
        },
        {
            path: '/vuePreview',
            name: 'vuePreview',
            component: () => import('@/view/vuePreview')
        },
        {
            path: '/accountModal',
            name: 'accountModal',
            component: () => import('@/view/accountModal')
        },
        {
            path: '/phoneCode',
            name: 'phoneCode',
            component: () => import('@/view/phoneCode')
        },
        {
            path: '/addressSelect',
            name: 'addressSelect',
            component: () => import('@/view/addressSelect')
        },
        {
            path: '/popup',
            name: 'popup',
            component: () => import('@/view/popup')
        },
        {
            path: '/teambuy',
            name: 'teambuy',
            component: () => import('@/view/teambuy')
        },
        {
            path: '/teambuyList',
            name: 'teambuyList',
            component: () => import('@/view/teambuyList')
        },
        {
            path: '/teambuyRule',
            name: 'TeambuyRule拼团玩法',
            component: () => import('@/view/TeambuyRule')
        },
        {
            path: '/teambuySku',
            name: 'teambuyStep阶梯团',
            component: () => import('@/view/TeambuyStep')
        },
        {
            path: '/receiveAddress',
            name: 'receiveAddress兑奖收货地址',
            component: () => import('@/view/receiveAddress')
        },
        {
            path: '/liveMarketing',
            name: 'liveMarketing直播营销组件',
            component: () => import('@/view/liveMarketing')
        },
        {
            path: '/shareBtn',
            name: 'shareBtn推广员分享按钮',
            component: () => import('@/view/shareBtn')
        },
        {
            path: '/teamBuyCountdown',
            name: 'teamBuyCountdown拼团横幅',
            component: () => import('@/view/teamBuyCountdown')
        },
        {
            path: '/teamBuyListBeta',
            name: 'teamBuyListBeta直播现阶段使用的正在进行的拼团',
            component: () => import('@/view/teamBuyListBeta')
        },
        {
            path: '/teamBuyRuleBeta',
            name: 'teamBuyRuleBeta直播现阶段使用的拼团的玩法',
            component: () => import('@/view/teamBuyRuleBeta')
        },
        {
            path: '/aliveRecommend',
            name: 'aliveRecommend直播相关推荐',
            component: () => import('@/view/aliveRecommend')
        },
        {
            path: '/taxSign',
            name: 'taxSign签约弹窗组件',
            component: () => import('@/view/taxSign')
        },
        {
            path: '/search',
            name: 'search组件',
            component: () => import('@/view/search')
        },
    ]
});
