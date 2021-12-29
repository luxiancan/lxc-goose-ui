import Button from './button';
import FooterLogo from './footer-logo';
import publicTop from './public-top';
import floatMenu from './float-menu';
import couponList from './coupon-list';
import couponItem from './coupon-item';
import couponSelect from './coupon-select';
import payGiftPromoCode from './pay-gift-promo-code';
import shareBox from './share-box';
import nameReplacer from './name-replacer';
import shareAndCopy from './share-and-copy';
import customerService from './customer-service';
import invoiceSelect from './invoice-select';
import xiaoeImage from './xiaoe-image';
import messageBox from './message-box';
import authenticationMessageBox from './authentication-message-box';
import LazyImage from '../../src/components/xiaoeImage/lazyImage';
import initSdk from './init-sdk';
// import vuePreview from './vue-preview';
import vuePreview from '../../src/components/vuePreview/index';
import addressSelect from './address-select';
import areaSelect from './area-select';
import accountModal from './account-modal';
import phoneCode from './phone-code';
import entityGift from './entity-gift';
import verticalSwiper from './vertical-swiper';
import Popup from './popup';
import Teambuy from './teambuy';
import TeamBuyCountdown from './team-buy-countdown';
import TeamBuyRuleBeta from './team-buy-rule-beta';
import TeamBuyListBeta from './team-buy-list-beta';
import LiveMarketing from './live-marketing';
import ShareBtn from './share-btn';
import ShareFriendPoster from './share-friend-poster';
import TeambuyRule from './teambuy-rule';
import TeambuyStep from './teambuy-step';
import TeamBuyList from './team-buy-list';
import TeamBuyTop from './team-buy-top';
import AlertModel from './alert-model';
import ReceiveAddress from './receive-address';
import invitingEntrance from './inviting-entrance';
import integralSelect from './integral-select';
import integralAlertDialog from './integral-alert-dialog';
import funcTool from './func-tool';
import ActionBar from './action-bar';
import taxSign from './tax-sign';
import phoneInput from "./phone-input";
import search from './search';
import WechatLoginModal from './wechat-login-modal'
import ShareButton from './share-button'

const components = [
    authenticationMessageBox,
    Button,
    FooterLogo,
    publicTop,
    floatMenu,
    couponList,
    couponItem,
    couponSelect,
    payGiftPromoCode,
    shareBox,
    messageBox,
    nameReplacer,
    shareAndCopy,
    customerService,
    invoiceSelect,
    xiaoeImage,
    addressSelect,
    areaSelect,
    entityGift,
    verticalSwiper,
    Popup,
    Teambuy,
    TeamBuyCountdown,
    TeamBuyRuleBeta,
    TeamBuyListBeta,
    LiveMarketing,
    ShareBtn,
    ShareFriendPoster,
    phoneCode,
    accountModal,
    TeambuyRule,
    TeambuyStep,
    TeamBuyList,
    TeamBuyTop,
    AlertModel,
    ReceiveAddress,
    invitingEntrance,
    AlertModel,
    ReceiveAddress,
    integralSelect,
    integralAlertDialog,
    ActionBar,
    taxSign,
    phoneInput,
    search,
    WechatLoginModal,
    ShareButton
]

const install = (Vue, options = {}) => {
    components.forEach((component) => {
        Vue.component(component.name, component)
        if (component.name === 'xiaoeImage') {
            options.offset = parseInt(options.offset, 10) || 0;
            const lazyImg = new LazyImage(options);
            Vue.prototype.$lazyImages = lazyImg;
        }
    })
}

export {
    install,
    authenticationMessageBox,
    Button,
    FooterLogo,
    publicTop,
    floatMenu,
    couponList,
    couponItem,
    couponSelect,
    payGiftPromoCode,
    shareBox,
    messageBox,
    nameReplacer,
    shareAndCopy,
    customerService,
    invoiceSelect,
    xiaoeImage,
    initSdk,
    vuePreview,
    accountModal,
    phoneCode,
    addressSelect,
    areaSelect,
    entityGift,
    verticalSwiper,
    Popup,
    Teambuy,
    TeamBuyCountdown,
    TeamBuyRuleBeta,
    TeamBuyListBeta,
    LiveMarketing,
    ShareBtn,
    ShareFriendPoster,
    TeambuyRule,
    TeambuyStep,
    TeamBuyList,
    TeamBuyTop,
    AlertModel,
    ReceiveAddress,
    invitingEntrance,
    integralSelect,
    integralAlertDialog,
    funcTool,
    ActionBar,
    taxSign,
    phoneInput,
    search,
    WechatLoginModal,
    ShareButton
}

export default {
    install,
    authenticationMessageBox,
    Button,
    FooterLogo,
    publicTop,
    floatMenu,
    couponList,
    couponItem,
    couponSelect,
    payGiftPromoCode,
    shareBox,
    messageBox,
    nameReplacer,
    shareAndCopy,
    customerService,
    invoiceSelect,
    xiaoeImage,
    initSdk,
    vuePreview,
    addressSelect,
    entityGift,
    verticalSwiper,
    accountModal,
    phoneCode,
    Popup,
    Teambuy,
    TeamBuyCountdown,
    TeamBuyRuleBeta,
    TeamBuyListBeta,
    LiveMarketing,
    ShareBtn,
    ShareFriendPoster,
    TeambuyRule,
    TeambuyStep,
    TeamBuyList,
    TeamBuyTop,
    AlertModel,
    ReceiveAddress,
    invitingEntrance,
    integralSelect,
    integralAlertDialog,
    funcTool,
    ActionBar,
    taxSign,
    phoneInput,
    search,
    WechatLoginModal,
    ShareButton
}
