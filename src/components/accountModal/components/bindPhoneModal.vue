<template>
    <modal v-if="showConfirm" :title="title" @confirm="boundConfirm" @cancel="cancel">
        <template slot="form-inputs">
            <div class="bind-main-tips">
                <p>手机号 【{{phone}}】 已被其他账号绑定。</p>
                <p>您是否要将该手机号换绑至当前账号？如果确定，该手机号将会与原账号解绑。</p>
            </div>
        </template>
    </modal>
    <modal v-else-if="showMergedConfirm" title="绑定手机号" @confirm="handleMerge" @cancel="cancel" cancelText="取消" confirmText="继续绑定" >
        <template slot="form-inputs">
            <div class="bind-main-tips">
                <p>无法完成绑定操作，此手机号已被绑定在其他账号</p>
            </div>
        </template>
    </modal>
    <modal v-else :title="title" :confirmText="confirmText" :showCancel="showCancel" @confirm="confirm" @cancel="cancel">
        <div class="bind-modal-tips" v-if="tips" slot="title-below">{{tips}}</div>
        <template slot="form-inputs">
            <div class="bind-phone-number" v-if="type === 2 && phoneNumber">{{phoneNumber}}</div>
            <div style="position:relative;margin-top: 0.32rem"  v-else>
              <phone-input ref="phoneInput" type="number" placeholder="请输入手机号码" width="4.62rem" v-model="phone"/>
            </div>
            <modal-input type="text" placeholder="请输入验证码" v-if="!useCaptcha" operatePosition="contain" v-model="imgCode">
                <div class="code-img-wrapper" slot="operation" @click="getImgCode">
                    <img :src="imgCodeUrl" class="code-img" v-show="imgCodeUrl">
                </div>
            </modal-input>
            <modal-input type="text" placeholder="请输入短信验证码" v-model="phoneCode">
                <phone-code slot="operation" @useCaptcha="isUseCaptcha" :imgCode="imgCode" :phone="phone" :codeKey="codeKey"></phone-code>
            </modal-input>
        </template>
    </modal>
</template>

<script>
import NetWork from '@/lib/network.js';
import EventBus from '@/lib/eventbus.js';
import Toast from '@/lib/toast.js';
import eJump from '@/lib/eJump.js';

import modal from './modal';
import modalInput from './modalInput';
import phoneInput from '../../phoneInput';
import phoneCode from '../../phoneCode'

const phoneReg = /^1[3-9]\d{9}$/

export default {
    props: {
        type: {
            type: Number,
            default: 1  // 1：直接进行手机号绑定；2：密码绑定前需先进行手机号绑定, 修改密码；3：直接设置密码：4、引导绑定
        },
        bindType: {
            type: Number,
            default: 1  // 绑定手机号的方式, 1、默认绑定方式；4：账号绑定引导；5：强制绑定；
        },
        guidePage: {
            type: Number,
            default: 1 // 当type为4,5时有效，标明需要进行引导的页面 1：首页；2：我的页面；3：支付页
        },
        phoneNumber: [String, Number]
    },
    components: {
        modal,
        modalInput,
        phoneInput,
        phoneCode
    },
    data() {
        return {
            step: 1,
            useCaptcha: true,
            imgCodeUrl: '',
            codeKey: '',
            phone: '',
            token: '',
            imgCode: '',
            phoneCode: '',
            loading: false,
            showConfirm: false,
            showMergedConfirm: false,
            oldName: ''
        };
    },
    computed: {
        title() {
            if (this.type === 2) {
                if (this.phoneNumber) {
                    return '验证手机号';
                }
                return '设置密码前绑定手机号'
            }
            return '绑定手机号';
        },
        tips() {
            return this.type === 4 ? '为了更好地保障帐号安全，建议你立即绑定手机号' : ''
        },
        confirmText() {
            if (this.type === 2) {
                return '下一步';
            }
            return '确定';
        },
        showCancel() {
            return this.bindType !== 5;
        },
        appId() {
            // 初始设置app_id
            const initElement = document.getElementById('initData');
            const initString = (initElement && initElement.value) || '{}';
            const initData = this.isJson(initString) ? JSON.parse(initString) : {};
            return initData.app_id ? initData.app_id : (location.hostname.split('.h5.') || [''])[0];
        }
    },
    created() {
        if (this.type !== 1 && this.phoneNumber) {
            this.phone = this.phoneNumber;
        }
    },
    mounted() {
      if (this.type !== 1 && this.phoneNumber) {
        this.$refs.phoneInput.setPhone(this.phoneNumber);
      }
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
        // 刷新图形验证码
        getImgCode() {
            this.codeKey = this.getRandomCode();
            NetWork.request('auth/image_code', {
                code_key: this.codeKey
            }, (res) => {
                if (res.code === 0) {
                    this.imgCodeUrl = res.data.img_url;
                }
            })
        },
        getRandomCode() {
            const str = '1234567890qwertyuiopasdfghjklzxcvbnm'
            const len = str.length
            const arr = []
            for (let i = 0; i < 10; i += 1) {
                const l = Math.floor(Math.random() * len)
                arr.push(str[l])
            }
            return arr.join('')
        },
        isUseCaptcha(useCaptcha) {
            this.useCaptcha = useCaptcha;
            if (!useCaptcha) {
                this.getImgCode();
            }
        },
        // 校验手机号
        confirm() {
            if (this.loading) {
                return;
            }
            if (!this.phone) {
                Toast('请输入手机号');
                return;
            }
            // 海外手机号不校验格式
            // if (!phoneReg.test(this.phone)) {
            //     Toast('手机号格式错误');
            //     return;
            // }
            if (!this.phoneCode) {
                Toast('请输入短信验证码');
                return;
            }
            this.loading = true;
            try {
                window.sensors.track('click_butt', {
                    page_module: 'h5',
                    page_submodule: '主页',
                    page_name: '手机号绑定弹窗',
                    page_button: '确定',
                    c_user_id: window.USERID,
                    app_id: window.APPID
                });
            } catch (e) {
                console.log(e);
            }
            // 当有手机号进行密码修改的时候不需要进行，账号冲突校验
            // count 0-手机号未被使用 1-手机号绑定的用户即当前用户 2-手机号已被其他账号绑定，且无渠道冲突 3-手机号已被其他账号绑定，有渠道冲突
            const url = this.type === 2 && this.phoneNumber ? 'auth/check_verify_code' : 'user/h5_check_phone';
            NetWork.request(url, {
                phone: this.phone,
                code: this.phoneCode,
                app_id: this.appId || window.APPID
            }, (res) => {
                if (res.code === 0) {
                    if (this.type === 1 || this.type === 4 || (this.type === 2 && !this.phoneNumber)) {
                        const count = res.data.count;
                        this.token = res.data.token;
                        if (count === 0) {
                            this.boundPhone();
                        } else if (count === 2) {
                            this.loading = false;
                            this.oldName = res.data.name
                            this.showMergedConfirm = true
                        } else if (count === 3) {
                            this.showConfirm = true;
                            this.loading = false;
                        } else if (count === 1) {
                            if (this.type === 2) {
                                this.stepSetPassword();
                                return;
                            }
                            this.loading = false;
                            Toast('绑定成功');
                            EventBus.$emit('complete', this.phone);
                        }
                    } else {
                        this.stepSetPassword(res.data.token)
                    }
                } else {
                    this.loading = false;
                    Toast(res.msg || '手机号校验失败');
                }
            })
        },
        stepSetPassword(token) {
            this.loading = false;
            this.$emit('stepNext', {
                phone: this.phone,
                token: token || ''
            });
        },
        // 绑定手机号
        boundPhone() {
            NetWork.request('user/h5_bind_phone', {
                phone: this.phone,
                code: this.phoneCode,
                token: this.token
            }, (res) => {
                this.loading = false;
                if (res.code === 0) {
                    if (this.type === 2) {
                        this.stepSetPassword();
                        return;
                    }
                    Toast('绑定成功');
                    EventBus.$emit('complete', this.phone);
                } else {
                    Toast(res.msg || '手机号绑定失败');
                }
            })
        },
        cancel() {
            EventBus.$emit('cancel');
        },
        boundConfirm() {
            this.loading = true;
            this.boundPhone();
        },
        handleMerge(){
            eJump.jump(`/v1/usercenter/account/risk_page?phone=${encodeURIComponent(this.phone)}&code=${this.phoneCode}&old_phone=${this.phoneNumber || ''}&token=${this.token}&old_account_name=${this.oldName}`)
        }
    }
};
</script>

<style scoped lang="scss">
.bind-modal-tips {
    margin-top: .08rem;
    text-align: center;
    font-size: 0.24rem;
    color:#999999;
}
.bind-main-tips{
    width: 4.62rem;
    font-size: 0.28rem;
    >*{
        margin: 0.1rem 0;
    }
}
.bind-phone-number {
    margin-top: .32rem;
    font-size: .48rem;
    text-align: center;
}
.code-img-wrapper {
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    width: 2rem;
    .code-img {
        width: 100%;
        height: 100%;
    }
}
</style>
