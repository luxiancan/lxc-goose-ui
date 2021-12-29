<template>
    <div class="receive-address-box" v-show="visible">
        <div class="shade-box" @click="closeEvent"></div>

        <van-popup
                v-model="visible"
                position="bottom"
                @close="closeEvent"
                :overlay="false"
                :round="true"
                >
            <div class="receive-address-con">
                <div class="receive-address-title">
                    <div class="common-icon back-icon" @click.stop="backEvent">
                        <i class="iconfont icon-previewleft"></i>
                    </div>
                    <div class="option-title">
                        {{optionTitle}}
                    </div>
                    <div class="common-icon close-icon" @click.stop="closeEvent">
                        <i class="iconfont icon-icon_close"></i>
                    </div>
                </div>

                <!-- 选中地址 -->   
                <div v-if="!isShowNewOrEdit && !isLoading" class="receive-address-list">
                    <div class="address-list-content">
                        <div class="receive-address-item" 
                        v-for="(item, index) in addressList" 
                        :key="index"
                        @click.stop="chooseAddress(item)">
                            <div class="select-icon">
                                <i v-show="currentAddress.id == item.id" class="iconfont icon-success_status_icon theme-customize-font"></i>
                                <i v-show="currentAddress.id != item.id" 
                                class="iconfont icon-icon_Unselected"></i>
                            </div>
                            <div class="user-address">
                                <div class="user-msg">
                                    <div class="user-name">
                                        {{item.receiver}}
                                    </div>
                                    <div class="user-phone">
                                        {{item.phone}}
                                    </div>
                                    <div v-if="item.is_default" class="default-label theme-customize-border theme-customize-font theme-customize-font-black theme-customize-light-new">
                                        默认
                                    </div>
                                </div>
                                <div class="address-msg">
                                    {{ item.province + item.city + item.county + item.detail }}
                                </div>
                            </div>
                            <div class="edit-icon" @click.stop="goEditAddress(item)">
                                <i class="iconfont icon-icon_edit"></i>
                            </div>

                        </div>

                        <div class="add-address" @click.stop="newAddress">
                            <i class="iconfont icon-jiahao theme-customize-font"></i>
                            <div class="add-address-text">
                                新增地址
                            </div>
                            <i class="iconfont icon-tiaozhuan"></i>
                        </div>
                    </div>
                    <div class="commit-btn" @click.stop="selectAddress">
                        <div class="theme-customize-bg commit-btn-text">
                            提交
                        </div>
                    </div>
                </div>

                <div v-if="isShowNewOrEdit" id="new-edit-address-node" class="new-edit-address">
                    <edit-address
                    :addressData="currentAddress"
                    :pageType="pageType"
                    @addressChange="addressChange"
                    ></edit-address>
                </div>
            </div>

        </van-popup>     
    </div>
</template>

<script>
import NetWork from '@/lib/network.js';
import editAddress from './components/editAddress';
import toast from '@/lib/toast';
import { Popup } from 'vant';



export default {
    name: 'SsReceiveAddress',
    data() {
        return {
            addressList: [],
            currentAddress: {},
            isShowNewOrEdit: false,
            pageType: 1,
            isLoading: false
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    components: {
        editAddress,
        [Popup.name]: Popup,
    },
    created() {
        this.getAddressList();
    },
    computed: {
        optionTitle() {
            if (!this.isShowNewOrEdit) {
                return '选择收货地址';
            } else if (this.pageType == 1) {
                return '新建地址';
            } else {
                return '编辑地址';
            }
        }
    },
    methods: {
        getAddressList() {
            this.isLoading = true;
            NetWork.request(
                'entity_goods/receive_address_list',
                {},
                (res) => {
                    this.isLoading = false;
                    if (res.code === 0) {
                        if (res.data.length > 0) {
                            this.addressList = res.data;
                            
                            if (!this.currentAddress.id ) {
                                const defaultAddress = res.data.find(address => address.is_default === 1);
                                this.currentAddress = defaultAddress || (res.data.length ? res.data[0] : {});
                            } else {
                                const updateAddress = res.data.find(address => address.id === this.currentAddress.id);
                                this.currentAddress = updateAddress;
                            }
                           
                        }
                        if (res.data.length === 0) {
                            this.addressList = [];
                            this.newAddress();
                        }
                    }
                }
            )
        },
        // 选择地址
        chooseAddress(address) {
            this.currentAddress = address;
        },
        newAddress() {
            this.pageType = 1;
            this.isShowNewOrEdit = true;
        },
        goEditAddress(address) {
            this.pageType = 2;
            this.currentAddress = address;
            this.isShowNewOrEdit = true;
        },
        addressChange(params) {
            console.log(params.id);
            this.getAddressList();
            this.isShowNewOrEdit = false;
        },
        backEvent() {
           if (this.isShowNewOrEdit) {
               this.isShowNewOrEdit = false;
           } else {
               this.$emit('update:visible', false);
           }
        },
        closeEvent() {
            this.$emit('update:visible', false);
        },
        selectAddress() {
            if (this.currentAddress.id) {
                this.$emit('selectAddress',this.currentAddress);
                this.$emit('update:visible', false);
            } else {
                toast('请选择收货地址');
            }  
        }
    }
}
</script>

<style scoped lang="scss">
    .receive-address-box{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
    }
    .shade-box{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,0.4);
    }
    .receive-address-con{
        display: flex;
        flex-direction: column;
        // position: absolute;
        // left: 0;
        // bottom: 0;
        width: 100%;
        height: 9.6rem;
        background: #F5F6F9;
        border-radius: 0.16rem 0.16rem 0rem 0rem;
        overflow: hidden;
        .receive-address-title{
            width: 100%;
            height: 1.46rem;
            background: #F5F6F9;
            position: relative;
            .common-icon{
                height: 1.46rem;
                display: flex;
                align-items: center;
                position: absolute;
                top: 0;
                .icon-previewleft,.icon-icon_close{
                    color: #C8C8C8;
                    font-size: 0.4rem;
                }
            }
            .back-icon{
                left: 0.32rem;
            }
            .close-icon{
               right: 0.32rem;
            }
            .option-title{
               line-height: 1.46rem;
               text-align: center;
               font-size: 0.36rem; 
               color: #333333;
               font-weight: 500;
            }
        }
        /*滚动条宽度设置*/
        .address-list-content::-webkit-scrollbar {
            width: 0;
        }

        .address-list-content::-o-scrollbar {
            -moz-appearance: none !important;
            width: 0;
        }
        .receive-address-list{
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            // padding-bottom: 1.12rem;
            // overflow-y: auto;
            .address-list-content{
               flex: 1;
               overflow-y: auto;
            } 
           .receive-address-item{
               display: flex;
               padding: 0.32rem;
               margin-bottom: 0.16rem;
               background: #FFFFFF;
              .select-icon,.edit-icon{
                  display: flex;
                  align-items: center;
                  .iconfont{
                        font-size: 0.4rem;
                  }
                  .icon-success_status_icon{
                      color: #09BB07;
                  }
              } 
              .user-address{
                  padding-left: 0.32rem;
                  flex: 1;
                  .user-msg{
                      display: flex;
                      color: #333333;
                      font-weight: 500;
                      font-size: 0.32rem;
                      .user-name{
                            max-width: 2.8rem;
                            line-height: 0.44rem;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                      }
                      .user-phone{
                          line-height: 0.44rem;
                          padding: 0 0.32rem;
                      }
                      .default-label{
                            width: 0.64rem;
                            height: 0.32rem;
                            background: rgba(16, 92, 251, 0.12);
                            border-radius: 0.08rem;
                            color: #09BB07;
                            font-size: 0.2rem;
                            font-weight: 400;
                            margin-top: 0.06rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                      }
                  }
                  .address-msg{
                      line-height: 0.4rem;
                      margin-top: 0.16rem;
                      font-size: 0.28rem;
                      color: #666666;

                  }
              }
           } 
           .add-address{
                width: 100%;
                height: 1.12rem;
                background: #fff;
                display: flex;
                padding: 0 0.32rem;
                box-sizing: border-box;
                margin-bottom: 0.16rem;
                .icon-jiahao, .icon-tiaozhuan{
                    font-size: 0.4rem;
                    display: flex;
                    align-items: center;
                }
                .icon-tiaozhuan{
                    color: #D8D8D8;
                }
                .add-address-text{
                    flex: 1;
                    padding-left: 0.16rem;
                    line-height: 1.12rem;
                    font-size: 0.32rem;
                    color: #333333;
                }
           }
        }
        .new-edit-address{
            flex: 1;
            overflow-y: auto;
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
    }
</style>

