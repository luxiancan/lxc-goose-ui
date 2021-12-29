import Vue from 'vue';
import xiaoEHelperAppSdk from '@/lib/xiaoe_helper_app_sdk';
import App from './App';
import router from './router';
import { Button } from '../libEntry/install/index'
import { messageBox } from '../libEntry/install/message-box'
import floatMenu from '../libEntry/install/float-menu'
import VuePreview from '../libEntry/install/vue-preview'


// Vue.use(Button)
// Vue.use(messageBox)
// Vue.use(floatMenu)
Vue.config.productionTip = false;
Vue.prototype.$preview = new VuePreview({
    arrowEl: false,
    fullscreenEl: false,
});
// 小鹅助手APP相关API
Vue.prototype.$xiaoEHelperAppSdk = xiaoEHelperAppSdk;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
