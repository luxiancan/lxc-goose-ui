<template>
    <!-- 地址栏 -->
    <div class="address-control">
        <div class="address-container" v-show="showAddressSelect">
            <div class="address-tips ET6" v-show="showTips">{{tips}}</div>
            <div class="address-bar EC10_BG" @click="changeAddress">
                <!-- 无默认地址 -->
                <div v-if="!haveAddress" class="add-address">
                    <i class="iconfont icon-icon_adrs t7"></i>
                    <span class="ET3">请先添加收货地址</span>
                </div>
                <!-- 选择了地址/有默认地址 -->
                <div v-else class="address-wrapper">
                    <div class="address-info ET3">
                        <span>{{ address_data.receiver }}</span>
                        <span>{{ address_data.phone }}</span>
                    </div>
                    <div
                        class="address ET5"
                    >{{ address_data.province + address_data.city + address_data.county + address_data.detail }}</div>
                </div>
                <img class="img-arrow-right" src="../../assets/images/couponList/icon_arrow.png" />
            </div>
        </div>
        <!-- 地址栏底部彩线 -->
        <div class="line-img" v-if="haveAddress && showAddressSelect"></div>
        <div class="address-manage" v-show="addressManageChangeShow" @touchmove.stop>
            <address-manage
                v-if="showAddressManage"
                :currentAddressId="address_data.id"
                @address-change="onAddressChange"
                @address-edit="onEditAddress"></address-manage>
            <address-edit
                v-if="showAddressEdit"
                :editData="editData"
                :haveAddress="haveAddress"
                @address-change="onAddressChangeFromEdit"
                @address-delete="onAddressDelete"
                ></address-edit>
        </div>
    </div>
</template>

<script>
import NetWork from '@/lib/network';

import addressEdit from './components/addressEdit';
import addressManage from './components/addressManage';

export default {
    name: 'SsAddressSelect',
    props: {
        tips: String
    },
    data() {
        return {
            address_data: '',
            editData: {},
            showAddressSelect: true,
            showAddressManage: false,
            showAddressEdit: false,
            hasNewPushstate: false
        }
    },
    components: {
        addressEdit,
        addressManage
    },
    created() {
        this.getAddressData();
    },
    computed: {
        haveAddress() {
            return !!this.address_data && !!Object.keys(this.address_data).length;
        },
        addressManageChangeShow() {
            return this.showAddressManage || this.showAddressEdit;
        },
        showTips() {
            return !!this.tips && (!this.address_data || !Object.keys(this.address_data).length || this.tips.indexOf('送好友') > -1);
        }
    },
    watch: {
        address_data(addressData) {
            this.$emit('select-address', addressData)
        }
    },
    methods: {
        // 显示地址选择组件
        showAddressSelectComp() {
            this.showAddressSelect = true;
            this.showAddressManage = false;
            this.showAddressEdit = false;
        },
        // 显示地址管理组件
        showAddressManageComp() {
            this.showAddressSelect = false;
            this.showAddressManage = true;
            this.showAddressEdit = false;
        },
        // 显示地址编辑组件
        showAddressEditComp() {
            this.showAddressSelect = false;
            this.showAddressManage = false;
            this.showAddressEdit = true;
        },
        // 修改地址
        changeAddress() {
            if (this.haveAddress) {
                this.showAddressManageComp()
            } else {
                this.editData = {
                    type: 'new'
                }
                this.showAddressEditComp();
            }
        },
        onAddressChange(addressData) {
            this.address_data = addressData;
            this.showAddressSelectComp();
        },
        onAddressChangeFromEdit(addressData) {
            if (!this.haveAddress) {
                this.address_data = addressData;
                this.showAddressSelectComp();
            } else {
                this.showAddressManageComp();
            }
        },
        onEditAddress(editData) {
            this.editData = editData;
            this.showAddressEditComp();
        },
        onAddressDelete() {
            this.showAddressManageComp();
        },
        getAddressData() {
            NetWork.request('entity_goods/receive_address_list', '', (res) => {
                if (res.code === 0) {
                    const defaultAddress = res.data.find(address => address.is_default === 1);
                    this.address_data = defaultAddress || (res.data.length ? res.data[0] : {});
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.address-tips {
    padding: .22rem .32rem;
    background: #FFF7EC;
    color: #FF8533;
}
.address-bar {
    padding: 0.32rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-address {
        display: flex;
        align-items: center;
        .icon-icon_adrs {
            color: #979797;
            margin-right: 0.08rem;
        }
    }
    .address-wrapper {
        display: flex column;
        align-items: flex-start;
        .address-info {
            display: flex;
            align-items: center;
            font-weight: 500;
            span:first-child {
                display: inline-block;
                margin-right: 0.48rem;
                max-width: 3rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .address {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-top: 0.16rem;
            max-width: 6.14rem;
            color: #666;
        }
    }
    .icon-tiaozhuan {
        color: #c8c8c8;
    }

}

.img-arrow-right {
    height: 0.3rem;
}

.line-img {
    width: 100%;
    height: 0.06rem;
    background: url('../../assets/images/addressSelect/img_adrr.svg') center;
    background-size: cover;
}
.address-manage {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    margin: auto;
    width: 100%;
    max-width: 480px;
    background: #f5f6f9;
}
</style>