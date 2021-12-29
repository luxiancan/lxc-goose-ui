<template>
    <div>
        <!-- 获取微信收货地址 -->
        <div v-if="isWeChatEnv" class="wechat" @click="getWechat">
            <div class="left-title">
                <i class="iconfont icon-wechat"></i>
                <div class="ET3">获取微信地址</div>
            </div>
            <i class="iconfont icon-tiaozhuan"></i>
        </div>
        <div class="address-wrapper">
            <div
                class="address-bar"
                v-for="(item, index) in addressList"
                :key="index"
                @click.stop="chooseAddress(item)"
            >
                <div class="left-info">
                    <i
                        class="iconfont icon-duoxuan-xuanzhong1 chosen-icon theme-customize-font"
                        v-if="publicAddressId == item.id"
                    ></i>
                    <div class="info-text">
                        <div class="top-text">
                            <div class="name ET3">{{ item.receiver }}</div>
                            <div class="phone ET3">{{ item.phone }}</div>
                            <div
                                class="tag ET7 theme-customize-border theme-customize-font theme-customize-font-black theme-customize-light-new"
                                v-if="item.is_default"
                            >
                                默认
                            </div>
                        </div>
                        <div class="address-text ET5">
                            {{ item.province + item.city + item.county + item.detail }}
                        </div>
                    </div>
                </div>
                <i class="iconfont icon-icon_edit edit-icon" @click.stop="newAddress('edit', item.id)"></i>
            </div>
        </div>
        <!-- 底部操作按钮 -->
        <div class="finish-btn" v-fixIPhoneX="{ paddingBottom: '0.68rem' }">
            <div class="finish EC10 ET5 theme-customize-bg" @click="newAddress('new')">
                新增地址
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import Network from '@/lib/network';
import fixIPhoneX from '../fixIPhoneX';

Vue.directive('fixIPhoneX', fixIPhoneX);

export default {
    props: {
        currentAddressId: Number
    },
    data() {
        return {
            addressList: [],
            currentAddress: {}
        };
    },
    computed: {
        // store与路由参数取其一
        publicAddressId() {
            return this.currentAddressId || this.currentAddress.id;
        },
        isWeChatEnv() {
            const userAgent = window && window.navigator && window.navigator.userAgent;
            // 企业微信浏览器不显示
            const isWxworkBrowser = /wxwork/.test(userAgent);
            return window.wx && window.wx.CLIENT_ENV === 'wechat' && !isWxworkBrowser;
        }
    },
    mounted() {
        this.getAddressList();
    },
    methods: {
        // 获取收货地址
        getAddressList() {
            const that = this;
            Network.request('entity_goods/receive_address_list', '', (res) => {
                if (res.code === 0) {
                    if (that.publicAddressId && res.data.length > 1) {
                        that.addressList = that.sortChoosen(res.data);
                    } else {
                        that.addressList = res.data;
                    }
                    if (res.data.length === 0) {
                        that.addressList = [];
                    }
                }
            });
        },
        // 获取微信收货地址
        getWechat() {
            const that = this;
            window.wx.openAddress({
                success(res) {
                    // 微信地址与地址列表匹配，不重复添加
                    const compareRes = that.compareWechat(res);
                    if (!compareRes) {
                        that.createAddress(res);
                    } else {
                        that.chooseAddress(compareRes);
                    }
                },
                fail(err) {
                    console.log(err.errMsg);
                }
            });
        },
        // 创建地址
        createAddress(wechatAddress) {
            const that = this;
            const params = {
                receiver: wechatAddress.userName, // 收件人
                phone: wechatAddress.telNumber, // 手机号码
                province: wechatAddress.provinceName, // 省
                city: wechatAddress.cityName, // 市
                county: wechatAddress.countryName, // 区/县
                detail: wechatAddress.detailInfo, // 详细地址
                is_default: 1 // 是否设为默地址,
            };
            Network.request('entity_goods/create_receive_address', params, (res) => {
                if (res.code === 0) {
                    that.chooseAddress(params);
                }
            });
        },
        // 选择地址
        chooseAddress(address) {
            this.currentAddress = address;
            this.$emit('address-change', address);
        },
        newAddress(val, id = null) {
            this.$emit('address-edit', {
                type: val,
                address_id: id,
            })
        },
        // 微信地址与地址列表匹配，不重复添加
        compareWechat(wechatAddress) {
            return this.addressList.find((el) => {
                return (
                    el.receiver == wechatAddress.userName &&
                    el.phone == wechatAddress.telNumber &&
                    el.province == wechatAddress.provinceName &&
                    el.city == wechatAddress.cityName &&
                    el.county == wechatAddress.countryName &&
                    e.detail == wechatAddress.detailInfo
                )
            });
        },
        // 选中的地址置于首位
        sortChoosen(arr) {
            let index;
            let element;
            const newArr = arr;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == this.publicAddressId) {
                    element = arr[i];
                    index = i;
                }
            }
            newArr.splice(index, 1);
            newArr.unshift(element);
            return newArr;
        }
    }
};
</script>
<style lang="scss" scoped>
.wechat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0.32rem;
    box-sizing: border-box;
    .left-title {
        display: flex;
        align-items: center;
        i {
            color: #46bb36;
            font-size: 0.3rem;
            margin-right: 0.12rem;
        }
    }
}
.address-wrapper {
    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 1.88rem;
    background: #f5f5f5;
    .address-bar {
        background: #fff;
        padding: 0.32rem;
        margin-top: 0.16rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .left-info {
            display: flex;
            align-items: center;
            .chosen-icon {
                font-size: 0.4rem;
                color: #105cfb;
                margin-right: 0.32rem;
            }
            .info-text {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .top-text {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 0.16rem;
                    .name {
                        margin-right: 0.32rem;
                        max-width: 3rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        word-break: break-all;
                    }
                    .tag {
                        color: #105cfb;
                        width: 0.64rem;
                        height: 0.32rem;
                        text-align: center;
                        line-height: 0.32rem;
                        background: #dde8fc;
                        border-radius: 0.08rem;
                        margin-left: 0.32rem;
                    }
                }
                .address-text {
                    padding-right: 0.72rem;
                    color: #666;
                }
            }
        }
        .edit-icon {
            position: absolute;
            right: 0.32rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.4rem;
            color: #c8c8c8;
        }
    }
}

/*滚动条宽度设置*/
.address-wrapper::-webkit-scrollbar {
    width: 0;
}

.address-wrapper::-o-scrollbar {
    -moz-appearance: none !important;
    width: 0;
}

.finish-btn {
    background: #fff;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0.16rem 0.28rem;
    box-sizing: border-box;
    border-top: 0.02rem solid #eee;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    .finish {
        padding: 0.2rem 0;
        border-radius: 0.4rem;
        text-align: center;
        background: #09BB07;
    }
}
.icon-tiaozhuan {
    color: #d8d8d8;
    font-size: 0.4rem;
}
</style>
