<template>
    <modal title="设置密码" @confirm="confirm" @cancel="cancel">
        <template slot="form-inputs">
            <modal-input :type="passwordType" placeholder="请输入6-20位数字+字母组合密码" v-model="password">
                <div slot="operation" @click="changePasswordType">
                    <i class="iconfont icon-open_eye" v-if="passwordType !== 'password'"></i>
                    <i class="iconfont icon-close_eye" v-else slot="operation"></i>
                </div>
            </modal-input>
            <modal-input type="password" placeholder="请再次输入密码" v-model="rePassword"></modal-input>
        </template>
    </modal>
</template>

<script>
import NetWork from '@/lib/network.js';
import Toast from '@/lib/toast.js';
import EventBus from '@/lib/eventbus.js';

import modal from './modal';
import modalInput from './modalInput';

const passwordReg = /^[a-zA-Z\d]+$/
const pureNumberReg = /^\d+$/
const pureStringReg = /^[a-zA-Z]+$/

export default {
    props: {
        tips: {
            type: String,
            default: ''
        },
        passwordToken: String,
        hasPassword: Boolean
    },
    components: {
        modal,
        modalInput,
    },
    data() {
        return {
            password: '',
            rePassword: '',
            passwordType: 'password'
        };
    },
    computed: {
        appId() {
            // 初始设置app_id
            const initElement = document.getElementById('initData');
            const initData = JSON.parse((initElement && initElement.value) || '{}');
            return initData.app_id ? initData.app_id : (location.hostname.split('.h5.') || [''])[0];
        }
    },

    created() {
    },
    methods: {
        changePasswordType() {
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
        cancel() {
            EventBus.$emit('cancel');
        },
        confirm() {
            if (this.check()) {
                const url = this.hasPassword ? 'user/password_reset' : 'user/password_set';
                NetWork.request(url, {
                    password: this.password,
                    re_password: this.rePassword,
                    token: this.passwordToken,
                    app_id: this.appId || window.APPID
                }, (res) => {
                    if (res.code === 0) {
                        Toast('密码修改成功');
                        EventBus.$emit('complete');
                    } else {
                        Toast(res.msg || '密码修改失败');
                    }
                })
            }
        },
        check() {
            const password = this.password;
            if (!password) {
                Toast('请输入密码');
                return false;
            }
            if (password.length < 6) {
                Toast('密码不得少于6位');
                return false;
            }
            if (password.length > 20) {
                Toast('密码不得大于20位');
                return false;
            }
            if (password.length > 20) {
                Toast('密码不得大于20位');
                return false;
            }
            if (pureNumberReg.test(password) || pureStringReg.test(password) || !passwordReg.test(password)) {
                Toast('请设置6-20位数字+字母组合密码');
                return false;
            }
            if (!this.rePassword) {
                Toast('请输入确认密码');
                return false;
            }
            if (password !== this.rePassword) {
                Toast('两次输入的密码不一致');
                return false;
            }
            return true;
        }
    }
};
</script>

<style scoped lang="scss">
.iconfont {
    color: #ccc;
    cursor: pointer;
}
</style>