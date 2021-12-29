<template>
    <div class="phone-code-wrapper">
        <div class="login-verify-code theme-customize-font" @click="getPhoneCode">
            <span v-show="showCountDown">
                {{countDown}}s
            </span>
            <span v-show="!showCountDown">
                获取验证码
            </span>
        </div>
        <div id="TCaptcha"></div>
    </div>
</template>

<script>
import NetWork from '@/lib/network.js';
import Toast from '@/lib/toast.js';

const phoneReg = /^1[3-9]\d{9}$/

export default {
    name: 'phoneCode',
    props: {
        imgCode: String,
        phone: String,
        codeKey: String
    },
    data() {
        return {
            captcha: null,
            captchaAppid: '',
            captchaData: {},
            useCaptcha: true,
            loading: false,
            showCountDown: false,
            countDown: 60
        }
    },
    computed: {
        appId() {
            // 初始设置app_id
            const initElement = document.getElementById('initData');
            const initString = (initElement && initElement.value) || '{}';
            const initData = this.isJson(initString) ? JSON.parse(initString) : {};
            return initData.app_id ? initData.app_id : (location.hostname.split('.h5.') || [''])[0];
        },
    },
    mounted() {
        this.getCaptchaAppid();
    },
    methods: {
        isJson(str) {
            try {
                const data = JSON.parse(str);
                if (data !== null && typeof data === 'object') {
                    return true;
                }
            } catch (e) {
                return false;
            }
            return false;
        },
        getCaptchaAppid() {
            NetWork.request('get_captcha_appid', '', (res) => {
                if (res.code === 0) {
                    this.captchaAppid = res.captcha_appid;
                    this.initCaptcha();
                } else {
                    this.useCaptcha = false;
                    this.$emit('useCaptcha', false);
                }
            })
        },
        initCaptcha() {
            const initTencentCaptcha = () => {
                try {
                    this.captcha = new TencentCaptcha(
                        document.getElementById('TCaptcha'),
                        this.captchaAppid,
                        (res) => {
                            if (res.ret === 0) {
                                this.captchaData = res;
                                this.requestPhoneCode();
                            } else {
                                this.loading = false;
                            }
                        }
                    );
                } catch (e) {
                    this.useCaptcha = false;
                    this.$emit('useCaptcha', false);
                }
            }
            const TencentCaptchaUrl = 'https://ssl.captcha.qq.com/TCaptcha.js';
            if ((!window.__wxjs_environment || window.__wxjs_environment !== 'miniprogram')
                && window.navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1
                && window.navigator.userAgent.toLowerCase().indexOf('xiaoeapp') === -1) {
                // 首先检查是否有 TencentCaptcha, 如果有就直接初始化
                if (window.TencentCaptcha) {
                    initTencentCaptcha()
                } else {
                    // 检查是否已经有了这个js
                    const scripts = document.getElementsByTagName('script');
                    let script = [...scripts].find(script => script.src === TencentCaptchaUrl)
                    if (!script) {
                        // 没有就请求一个
                        script = document.createElement('script');
                        script.src = TencentCaptchaUrl;
                        document.body.appendChild(script);
                        script.addEventListener('load', () => {
                            initTencentCaptcha()
                        })
                        script.addEventListener('error', () => {
                            this.useCaptcha = false;
                            this.$emit('useCaptcha', false);
                        })
                    } else {
                        // 有了, 但是没有TencentCaptcha只是还没加载完,设置定时器300ms后直接执行initTencentCaptcha
                        setTimeout(() => {
                            initTencentCaptcha()
                        }, 300)
                    }
                }
            } else {
                this.useCaptcha = false;
                this.$emit('useCaptcha', false);
            }
        },
        getPhoneCode() {
            if (this.loading) {
                return;
            }
            if (!this.phone) {
                Toast('请输入手机号');
                return;
            }
            // 海外手机号不校验格式0405大车
            // if (!phoneReg.test(this.phone)) {
            //     Toast('手机号格式错误');
            //     return;
            // }
            if (this.useCaptcha) {
                this.captcha.show();
            } else {
                this.requestPhoneCode();
            }
        },
        requestPhoneCode() {
            const params = {
                phone: this.phone,
                app_id: this.appId || window.APPID
            }
            if (!this.useCaptcha) {
                if (!this.imgCode) {
                    Toast('请输入验证码');
                    this.loading = false;
                    return;
                }

                params.img_code = this.imgCode;
                params.code_key = this.codeKey;
            } else {
                params.ticket = this.captchaData.ticket;
                params.randstr = this.captchaData.randstr;
            }

            this.loading = true;
            NetWork.request('auth/get_verify_code', params, (res) => {
                this.loading = false;
                if (res.code === 0) {
                    this.startCountDown()
                    Toast('验证码发送成功')
                } else {
                    Toast(res.msg || '获取验证码失败')
                }
            })
        },
        startCountDown() {
            this.showCountDown = true;
            this.countDown = 60;
            const timer = setInterval(() => {
                this.countDown--;
                if (this.countDown === 0) {
                    this.showCountDown = false;
                    clearInterval(timer);
                }
            }, 1000)
        }
    }
};
</script>

<style scoped>
.login-verify-code {
    color: #2fcf63;
    cursor: pointer;
    font-size: 0.3rem;
}
</style>
