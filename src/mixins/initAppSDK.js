import NetWork from '@/lib/network';

export default {
    data() {
        return {
            SDKConf: {
                is_show_nav: 0, // 导航栏 publicTop
                is_show_bottom_nav: 0,  // footer
                is_show_flow_nav: 0, // floatMenu
            }
        }
    },
    mounted() {
        this.initAppSDK()
    },
    methods: {
    //  初始化appSdk
        initAppSDK() {
            // eslint-disable-next-line no-undef
            let clientEnv = ['xiaoeapp','wx_miniProgram']
            if (this.getCookie('xenbyfpfUnhLsdkZbX') === '1' || (wx && wx.CLIENT_ENV === 'xiaoeapp')) {   // 判断是否是 SDK
                const SDKConf = JSON.parse(localStorage.getItem('SDKConf'))
                if (!SDKConf || new Date() - new Date(SDKConf.date) > 300000) {
                    this.getSDkAppConfig()
                } else {
                    this.SDKConf = SDKConf
                }
            } else if (wx && wx.CLIENT_ENV === 'xiaoehelperapp') {   // 判断是否是 小鹅APP嵌入，隐藏头部和底部导航
                this.SDKConf = {
                    is_show_nav: 0,
                    is_show_bottom_nav: 0,
                    is_show_flow_nav: 0
                }
                localStorage.setItem('SDKConf', JSON.stringify(this.SDKConf));
            } else {
                this.SDKConf = {
                    is_show_bottom_nav: 1,
                    is_show_flow_nav: 1
                }
                if( !clientEnv.includes(wx.CLIENT_ENV) ){
                    this.SDKConf.is_show_nav = 1
                }
                
            }
        },
        getCookie(name) {
            const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return '';
        },
        getSDkAppConfig() {
            NetWork.request('sdk_app_config', {}, (data) => {
                console.log('getSDkAppConfig:', data)
                if (data) {
                    let resData = data
                    if (typeof resData == 'string') {
                        resData = JSON.parse(resData);
                    }
                    if (resData.code === 0 && resData.data) {
                        this.SDKConf = { ...resData.data }
                        this.SDKConf.date = new Date()
                        localStorage.setItem('SDKConf', JSON.stringify(this.SDKConf));
                    }
                }
            })
        },
    }
}
