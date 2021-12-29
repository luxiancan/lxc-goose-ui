<template>
    <div class="new-edit-address-box">
        <!-- 新增或编辑地址 -->
        <div class="new-edit-address">
            <div class="input-box">
                <van-field 
                class="common-input" 
                v-model="userName" 
                label-width="1.44rem"
                label="收货人" 
                placeholder="收货人姓名" />
            </div>
            <div class="input-box">
                <van-field 
                class="common-input" 
                v-model="userPhone" 
                label-width="1.44rem"
                label="手机号码" 
                placeholder="收货人手机号" />
            </div>
            <div class="input-box"  @click="showAreaList">
                <van-field 
                readonly="readonly"
                class="common-input" 
                v-model="userAddress" 
                label-width="1.44rem"
                label="所在地区" 
                placeholder="选择省/市/区" />
            </div>
            <div class="input-box none-border">
                <van-field 
                class="common-input" 
                v-model="userDetAddress" 
                label-width="1.44rem"
                label="详细地址" 
                placeholder="街道、门牌号等" />
            </div>
            <div class="set-default-add">
                <div class="set-default-text">
                    设为默认收货地址
                </div>
                <van-switch 
                v-model="switchChecked" 
                :class="{ 'default-color': switchChecked,'theme-customize-bg': switchChecked }"
                size="24px" />
            </div>
        </div>  
        <div class="commit-btn" @click.stop="saveAddress">
            <div class="theme-customize-bg commit-btn-text">
                保存
            </div>
        </div>
        <van-popup v-model="showArea" position="bottom" :overlay="true">
            <area-select
                :area-list="areaList"
                :value="vantValue"
                columns-num="3"
                @confirm="onConfirmArea"
                @cancel="showArea = false"
            />
        </van-popup>
    </div>
</template>

<script>
import { Popup, Field, Switch } from 'vant';
import Network from '@/lib/network.js';
import toast from '@/lib/toast';
import areaSelect from '../../areaSelect/index';


export default {
    props:{
        addressData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        pageType: {
            type: Number,
            default: 1 // 1: 新建 2：编辑
        },
        isShowNewOrEdit: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            userName: '',
            userPhone: '',
            addressProvince: '',
            addressCity: '',
            addressCounty: '',
            userDetAddress: '',
            showArea: false,
            cityList: [],
            switchChecked: false
        }
    },
    components: {
        [Popup.name]: Popup,
        [Field.name]: Field,
        [Switch.name]: Switch,
        areaSelect
    },
    watch: {
        showArea (val) {
            let ele = document.getElementById('new-edit-address-node');
            console.log('ele', ele);
            if (val) {
                ele.style['-webkit-overflow-scrolling'] = 'auto';
            } else {
                ele.style['-webkit-overflow-scrolling'] = 'touch';
            }
        }
    },
    created() {
        this.getCityList();
        if (this.pageType == 2) {
            this.userName = this.addressData.receiver;
            this.userPhone = this.addressData.phone;

            this.addressProvince = this.addressData.province;
            this.addressCity = this.addressData.city;
            this.addressCounty = this.addressData.county;

            this.userDetAddress = this.addressData.detail;

            this.switchChecked = this.addressData.is_default ? true : false;
        }
    },
    computed: {
        userAddress() {
            return this.addressProvince 
            + this.addressCity
            + this.addressCounty;
        },
        areaList() {
            return this.cityList;
        },
        vantValue() {
            return this.addressProvince + ';' + this.addressCity + ';' + this.addressCounty;
        },
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
        showAreaList () {
            this.showArea = true;
        },
        onConfirmArea(val) {
            
            for (let key in val) {
                if (val[key] && val[key].code !== '-1') {
                    if (key == '0') {
                        this.addressProvince = val[key].name;
                    } else if (key == '1') {
                        this.addressCity = val[key].name;
                    } else {
                        this.addressCounty = val[key].name;
                    }
                } else if (!val[key] || val[key].code === '-1') {
                    if (key == '0') {
                        this.addressProvince = '';
                    } else if (key == '1') {
                        this.addressCity = '';
                    } else {
                        this.addressCounty = '';
                    }
                }
            }

            this.showArea = false;
        },
        saveAddress() {
            
            const url =
            this.pageType == 1
                ? '/entity_goods/create_receive_address'
                : '/entity_goods/update_receive_address';
            const params = {
                receiver: this.userName, // 收件人
                phone: this.userPhone, // 手机号码
                province: this.addressProvince, // 省
                city: this.addressCity, // 市
                county: this.addressCounty, // 区/县
                detail: this.userDetAddress, // 详细地址
                is_default: this.switchChecked ? 1 : 0, // 是否设为默地址,
                id: this.pageType == 2 ? this.addressData.id : null
            };

            const flag = this.checkValue(params);
            if (flag !== true) {
                toast(flag);
            } else {
                 Network.request(url, params, (res) => {
                    if (res.code === 0) {
                        this.$emit('addressChange', params);
                    }
                })
            }
           
        },
        // 所有输入框校验
        checkValue(val) {
            let flag = true;
            for (let key in val) {
                switch (key) {
                    case 'receiver':
                        if (val[key]|| val[key].length > 0) {
                            continue;
                        } else {
                            flag = '请填写收货人姓名';
                            return flag;
                        }
                    case 'phone':
                        if (val[key] || val[key].length > 0) {
                            if (/^[1]([3-9])[0-9]{9}$/.test(val[key])) {
                                continue;
                            } else {
                                flag = '手机号格式错误';
                                return flag;
                            }
                        } else {
                            flag = '请填写手机号码';
                            return flag;
                        }
                    case 'province':
                    case 'city':
                    case 'county':        
                        if (val['province'] 
                        || val['city']  
                        || val['county'] 
                        || val['province'].length > 0
                        || val['city'].length > 0
                        || val['county'].length > 0) {
                            continue;
                        } else {
                            flag = '请选择所在地区';
                            return flag;
                        }
                    case 'detail':
                        if (val[key] || val[key].length > 0) {
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
        }
    }
}
</script>

<style scoped lang="scss">
    .new-edit-address-box{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .new-edit-address{
        flex: 1;
        // padding-bottom: 1.12rem;
        .input-box{
            background: #fff;
            width: 100%;
            height: 1.12rem;
            display: flex;
            align-items: center;
            background: #fff;
            border-bottom: 0.02rem solid #F5F5F5;
        }
        .none-border{
            border-bottom: none;
        }
        .common-input{
            padding: 0 0.32rem;
            box-sizing: border-box;
            // line-height: 1.12rem;
            color: #333333;
            font-size: 0.28rem;
        }
        .common-left{
            width: 1.44rem;
            margin-right: 0;
        }
        .set-default-add{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 1.12rem;
            background: #fff;
            line-height: 1.12rem;
            margin-top: 0.16rem;
            padding: 0 0.32rem;
            box-sizing: border-box;
            .set-default-text{
                color: #333333;
                font-size: 0.28rem;
            }
            .default-color{
                background: #09BB07;
            }
        }
    }
    .commit-btn{
        // position: fixed;
        // left: 0;
        // bottom: 0;
        width: 100%;
        height: 1.12rem;
        background: #fff;
        padding: 0.16rem 0.28rem;
        box-sizing: border-box;
        .commit-btn-text{
            height: 0.8rem;
            line-height: 0.8rem;
            text-align: center;
            background: #09BB07;
            border-radius: 0.4rem;
            font-size: 0.28rem;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
</style>

<style lang="scss">
    .receive-address-box{
        .new-edit-address{
            .van-field__label{
                margin-right: 0;
                color: #333333;
            }
            .van-field__control{
                color: #333333;
            }
        }
    }
</style>