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
        <!-- 地址输入区 -->
        <div class="input-wrapper">
            <div class="input-bar">
                <div class="ET3 input-title">收货人</div>
                <input type="text" class="input" placeholder="收货人姓名" v-model="dataObj.receiver" maxlength="15"/>
            </div>
            <div class="input-bar input-border">
                <div class="ET3 input-title">手机号码</div>
                <input
                    type="tel"
                    class="input"
                    maxlength="11"
                    placeholder="收货人手机号"
                    @input="limitInput($event)"
                    :max="11"
                    v-model="dataObj.phone"
                />
            </div>
            <div class="input-bar input-border" @click="showArea = true">
                <div class="ET3 input-title">所在地区</div>
                <input type="text" class="input" placeholder="选择省/市/区" readonly v-model="dataObj.area" />
                <i class="iconfont icon-tiaozhuan"></i>
            </div>
            <div class="input-bar input-border">
                <div class="ET3 input-title">详细地址</div>
                <input type="text" class="input" placeholder="街道、门牌号等" v-model="dataObj.detail" maxlength="50" />
            </div>
        </div>
        <!-- 默认收货地址开关组件 -->
        <div class="default-wrapper">
            <div class="ET3">设为默认收货地址</div>
            <van-switch
                v-model="isdefault"
                :class="{ 'theme-customize-bg': isdefault }"
                size="24px"
                @change="switchEvent"
            />
        </div>
        <!-- 底部操作按钮 -->
        <div class="finish-btn">
            <div v-if="pageType == 'new'" class="finish EC10 ET5 theme-customize-bg" @click="saveAddress">
                {{ !haveAddress ? '保存并使用' : '保存' }}
            </div>
            <div class="finish-double" v-else>
                <div class="cancel-btn ET5 c11" @click="deleteAddress">删除</div>
                <div class="finish2 EC10 ET5 theme-customize-bg" @click="saveAddress">保存地址</div>
            </div>
        </div>
        <!-- 地址选择器 -->
        <van-popup v-model="showArea" position="bottom" :overlay="true">
            <area-select
                :value="vantValue"
                :area-list="areaList"
                :columns-num="3"
                @confirm="onConfirmArea"
                @cancel="showArea = false"
            />
        </van-popup>
        <alert-box />
    </div>
</template>
<script>
import { Popup, Switch } from 'vant';
import 'vant/lib/switch/index.css'
import toast from '@/lib/toast';
import Network from '@/lib/network';
import Eventbus from '@/lib/eventbus';
import alertBox from './alertBox';
import areaSelect from '../../areaSelect/index';

export default {
    props: {
        editData: Object,
        haveAddress: Boolean // 标识是否从地址选择页直接新增地址
    },
    data() {
        return {
            // 展示地址选择器、地址列表等
            showArea: false,
            isdefault: false, // 是否默认收货地址
            // 客户信息等
            dataObj: {
                receiver: '',
                phone: '',
                area: '',
                detail: '',
                province: '',
                city: '',
                county: ''
            },
            addressList: [],
            cityList: []
        };
    },
    components: {
        [Popup.name]: Popup,
        [Switch.name]: Switch,
        alertBox,
        areaSelect
    },
    watch: {
        addressDetailCount(val) {
            if (val.length >= 50) {
                toast('详细地址最多50个字');
            }
        }
    },
    computed: {
        isWeChatEnv() {
            const userAgent = window && window.navigator && window.navigator.userAgent;
            // 企业微信浏览器不显示
            const isWxworkBrowser = /wxwork/.test(userAgent);
            return window.wx && window.wx.CLIENT_ENV === 'wechat' && !isWxworkBrowser;
        },
        addressDetailCount() {
            return this.dataObj.detail;
        },
        // 用于正则校验每个输入框的数组
        dataArray() {
            const arr = [];
            for (const item in this.dataObj) {
                arr.push({
                    key: item,
                    value: this.dataObj[item]
                });
            }
            return arr;
        },
        vantValue() {
            return this.dataObj.province + ';' + this.dataObj.city + ';' + this.dataObj.county;
        },
        // 用于标示进入编辑页时是新增（new）/编辑（edit）
        pageType() {
            return this.editData.type;
        },
        areaList() {
            return this.cityList;
        }
    },
    created() {
        this.getCityList();
    },
    mounted() {
        this.getAddressList();
        // 用于标示页面是来自订单(true)还是个人中心(false)
        const addressId = this.editData.address_id;
        addressId && this.getAddressInfo(addressId);
    },
    methods: {
        // 获取收货地址信息
        getCityList() {
            Network.request('entity_goods/get_region', '', (res) => {
                if (res.code === 0) {
                    this.cityList = res.data;
                }
            }) 
        },
        // 获取收货地址列表
        getAddressList() {
            const that = this;
            Network.request('entity_goods/receive_address_list', '', (res) => {
                if (res.code === 0) {
                    that.addressList = res.data;
                }
            })
        },
        // 编辑时获取地址详情回填
        getAddressInfo(id) {
            const that = this;
            Network.request('entity_goods/select_receive_address', {
                address_id: id
            }, (res) => {
                if (res.code === 0) {
                    const { province, city, county } = res.data;
                    that.dataObj = res.data;
                    that.dataObj.area = `${province}` + (city ? `/${city}` : '') + (county ? `/${county}` : '');
                    that.isdefault = res.data.is_default == 1;
                }
            })
        },
        // 获取微信收货地址
        getWechat() {
            const that = this;
            window.wx.openAddress({
                success: function(res) {
                    // 微信地址与地址列表匹配，不重复添加
                    let compareRes = that.compareWechat(res);
                    if (!compareRes) {
                        that.createAddress(res);
                    } else {
                        toast('已有相同收货地址');
                    }
                },
                fail: function(err) {
                    console.log(err.errMsg);
                }
            });
        },
        // 创建地址，因为存在多种交互判断，故与保存事件的分开写，后续优化
        createAddress(wechatAddress) {
            const params = {
                receiver: wechatAddress.userName, // 收件人
                phone: wechatAddress.telNumber, // 手机号码
                province: wechatAddress.provinceName, // 省
                city: wechatAddress.cityName, // 市
                county: wechatAddress.countryName, //区/县
                detail: wechatAddress.detailInfo, // 详细地址
                is_default: 1 // 是否设为默地址,
            };
            Network.request('/entity_goods/create_receive_address', params, (res) => {
                if (res.code === 0) {
                    this.$emit('address-change', params)
                }
            });
        },
        // 确认选择地址事件
        onConfirmArea(val) {
            let s = '';
            for (let i = 0; i < val.length; i++) {
                if (val[i] && val[i].code !== '-1') {
                    s += (i > 0 ? '/' : '') + val[i].name;
                }
            }
            this.dataObj.province = val[0].name;
            this.dataObj.city = val[1] ? val[1].name : '';
            this.dataObj.county = val[2] ? val[2].name : '';
            this.dataObj.area = s;
            this.showArea = false;
        },
        // 设置默认地址
        switchEvent() {},
        // 保存事件
        saveAddress() {
            const flag = this.checkValue(this.dataArray);
            // flag可能为其他内容，必须判断boolean值
            if (flag !== true) {
                toast(flag);
            } else {
                const url =
                    this.pageType === 'new'
                        ? '/entity_goods/create_receive_address'
                        : '/entity_goods/update_receive_address';
                const params = {
                    receiver: this.dataObj.receiver, // 收件人
                    phone: this.dataObj.phone, // 手机号码
                    province: this.dataObj.province, // 省
                    city: this.dataObj.city, // 市
                    county: this.dataObj.county, // 区/县
                    detail: this.dataObj.detail, // 详细地址
                    is_default: this.isdefault ? 1 : 0, // 是否设为默地址,
                    id: this.dataObj.id || null
                };
                Network.request(url, params, (res) => {
                    if (res.code === 0) {
                        this.$emit('address-change', params)
                    }
                })
            }
        },
        // 删除地址
        deleteAddress() {
            Eventbus.$emit(
                'alert_box_2',
                {
                    title: '是否确认删除地址？',
                    button_type: 2, // 1 表示一个按钮，2 表示两个按钮
                    cancel: '取消',
                    cancel_color: '#888888',
                    confirm: '确认',
                    confirm_color: '#105CFB'
                },
                // 确定回调
                () => {
                    Network.request('/entity_goods/delete_receive_address', {
                        id: this.dataObj.id
                    }, (res) => {
                        if (res.code === 0) {
                            this.$emit('address-delete')
                        }
                    })
                }
            );
        },
        // 电话输入优化
        limitInput(e) {
            const str = String(e.target.value);
            this.phone = str.replace(/[^\d]/g, '');
        },
        // 所有输入框校验
        checkValue(val) {
            let flag = true;
            for (let item of val) {
                switch (item.key) {
                    case 'receiver':
                        if (item.value || item.value.length > 0) {
                            continue;
                        } else {
                            flag = '请填写收货人姓名';
                            return flag;
                        }
                    case 'phone':
                        if (item.value || item.value.length > 0) {
                            if (/^[1]([3-9])[0-9]{9}$/.test(item.value)) {
                                continue;
                            } else {
                                flag = '手机号格式错误';
                                return flag;
                            }
                        } else {
                            flag = '请填写手机号码';
                            return flag;
                        }
                    case 'area':
                        if (item.value || item.value.length > 0) {
                            continue;
                        } else {
                            flag = '请选择所在地区';
                            return flag;
                        }
                    case 'detail':
                        if (item.value || item.value.length > 0) {
                            continue;
                        } else {
                            flag = '请填写详细地址';
                            return flag;
                        }
                    default:
                        break;
                }
            }
            return true;
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
.input-wrapper {
    padding: 0.16rem 0.32rem 0;
    box-sizing: border-box;
    background: #fff;
    .input-bar {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.32rem 0;
        i {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .input-title {
            width: 1.44rem;
            text-align: left;
        }
        .input:focus {
            outline: none;
        }
        .input::placeholder {
            color: #b2b2b2;
        }
        .input {
            width: 5rem;
            font-size: 0.28rem;
            box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
            -webkit-appearance: none;
            padding-left: 0.16rem;
        }
    }
}
.default-wrapper {
    margin-top: 0.16rem;
    height: 1.12rem;
    padding: 0 0.32rem;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.finish-btn {
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: 0.16rem 0.28rem;
    box-sizing: border-box;
    border-top: 0.02rem solid #eee;
    width: 100%;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    max-width: 480px;
    margin: 0 auto;
    .finish {
        padding: 0.2rem 0;
        border-radius: 0.4rem;
        text-align: center;
        background: #09BB07;
    }
    .finish-double {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cancel-btn {
            text-align: center;
            width: 2.12rem;
            padding: 0.16rem 0;
            margin-right: 0.24rem;
            background: rgba(255, 255, 255, 1);
            border-radius: 0.4rem;
            color: #666;
            border: 0.02rem solid rgba(183, 183, 183, 1);
        }
        .finish2 {
            width: 4.5rem;
            padding: 0.2rem 0;
            border-radius: 0.4rem;
            text-align: center;
            background: #09BB07;
        }
    }
}
.input-border {
    border-top: 0.02rem solid #f5f5f5;
}
.icon-tiaozhuan {
    color: #d8d8d8;
    font-size: 0.4rem;
}
.van-popup--bottom {
    max-width: 480px;
    margin: 0 auto;
}
</style>
