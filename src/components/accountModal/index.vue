<template>
    <div v-if="showModal">
        <bind-phone-modal
            :type="type"
            :bindType="bindType"
            :phoneNumber="phoneNumber"
            v-if="showBindPhoneModal"
            @stepNext="showPassword">
        </bind-phone-modal>
        <set-password
            :token="passwordToken"
            :hasPassword="hasPassword"
            :passwordToken="passwordToken"
            v-else-if="bindType !== 4 && bindType !== 5">
        </set-password>
    </div>
</template>

<script>
import NetWork from '@/lib/network.js';
import EventBus from '@/lib/eventbus.js';

import bindPhoneModal from './components/bindPhoneModal'
import setPassword from './components/setPassword'

export default {
    props: {
        type: {
            type: Number,
            default: 1  // 1：直接进行手机号绑定；2：密码绑定前需先进行手机号绑定, 修改密码；3：直接设置密码；4、引导绑定
        },
        guidePage: {
            type: Number,
            default: 0 // 当bindType为4, 5时有效，标明需要进行引导的页面 1：首页；2：我的页面；3：支付页
        },
        phoneNumber: [String, Number],
        hasPassword: Boolean
    },
    components: {
        bindPhoneModal,
        setPassword
    },
    data() {
        return {
            title: '绑定手机号',
            bindType: 1, // 绑定手机号的方式, 1、默认绑定方式；4：账号绑定引导；5：强制绑定；
            passwordToken: '',
            showBindPhoneModal: true,
            showModal: false
        };
    },
    created() {
        if (this.type === 3) {
            this.showBindPhoneModal = false;
        }
        EventBus.$on('complete', (e) => {
            this.$emit('complete', e);
            if (this.type === 4) {
                this.close();
            }
        })

        EventBus.$on('cancel', (e) => {
            this.$emit('cancel', e);
            if (this.type === 4) {
                this.close();
            }
        })

        if (this.type !== 4) {
            this.showModal = true;
        } else {
            this.getPhoneConfig()
        }
    },
    watch: {
        type (val) {
            if (val !== 4) {
                this.showModal = true;
            }
        }
    },
    methods: {
        showPassword(data) {
            this.passwordToken = data.token;
            this.$emit('phoneChange', data.phone);
            this.showBindPhoneModal = false;
        },
        getPhoneConfig() {
            NetWork.request('user/shop_phone_bind_conf', '', (res) => {
                // 如果code=0, data=null,说明当前用户已有手机号，不需要获取店铺手机号绑定配置
                if (res.code === 0 && res.data && res.data.phone_bind_switch === 1) {
                    let phoneConfig = res.data.phone_bind_config;
                    // 首页
                    if (this.guidePage === 1) {
                        if (phoneConfig.index === 1) {
                            this.bindType = 4;
                            this.showModal = true;
                        } else if (phoneConfig.index === 2) {
                            this.bindType = 5;
                            this.showModal = true;
                        }
                    }
                    // 个人中心页
                    if (this.guidePage === 2) {
                        if (phoneConfig.user_center === 1) {
                            this.bindType = 4;
                            this.showModal = true;
                        } else if (phoneConfig.user_center === 2) {
                            this.bindType = 5;
                            this.showModal = true;
                        }
                    }
                    // 支付页
                    if (this.guidePage === 3) {
                        if (phoneConfig.payment === 1) {
                            this.bindType = 4;
                            this.showModal = true;
                        } else if (phoneConfig.payment === 2) {
                            this.bindType = 5;
                            this.showModal = true;
                        }
                    }
                }
            })
        },
        close() {
            this.showModal = false;
        }
    }
};
</script>

<style scoped lang="scss">
</style>