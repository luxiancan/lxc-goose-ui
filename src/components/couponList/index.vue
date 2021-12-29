<template>
  <div class="barContent">
      <div class="section-useful-coupons-wrap"
          v-if="showCoupons"
          @click="showCouponsBox">
        <div class="coupons">
          <span class="tag"
                :key="`coupon_item_${index}`"
                v-for="(coupon, index) in usefulCouponsForDisplay">
            {{coupon.couponTitle}}
          </span>
        </div>
        <div class="actions">
          点击领券
        </div>
    </div>

    <div class="boxScreen"
         v-show="couponsBoxShow"
         @click="hideCouponsBox">
    </div>
    <div class="usefulCouponsBox"
       v-show="couponsBoxShow"
        >
      <div class="couponBoxTitle">
        <span class="c2 t1 couponBoxTitleName" >优惠券</span>
        <div class="couponBoxClose"
             @click="hideCouponsBox"><img src="@/assets/images/couponList/icon_close.png" alt="">
        </div>
      </div>
      <div class="usefulCouponsList">
          <coupon v-for="(item, index) in coupon_lists"
                  :item="item"
                  :key="`useful_coupon_item_${index}`"
                  :coupons_type="coupon_type"
                  :isInfoCollectLoad="isInfoCollectLoad"
                  :needInfoCollect="needInfoCollect"
                  @getInfoCollect="getInfoCollect">
          </coupon>
      </div>
    </div>
    <div class="successBox"
         v-show="successBoxShow">
      {{ boxWords }}
    </div>

    <div v-if="outerVisible">
        <new-info-collection
            v-show="innerVisible"
            :fromType="3"
            :resourceId="couponId"
            @directShowEven="closeInfo" 
            :directShowInfo="innerVisible"
            @onInfoCollectionLoaded="onInfoCollectionLoaded"
            @infoAfterPay="infoCollectBack"
            scene="conver_page"
            :showLoadingTit="true"
            :showSaveSucTit="false"
        ></new-info-collection>
    </div>
  </div>
</template>


<script>
import EventBus from '@/lib/eventbus.js';
import { newInfoCollection } from '@xiaoe/xiaoe-common-pay';
import coupon from './components/coupon.vue';
import '@xiaoe/xiaoe-common-pay/lib/index/style.css';


export default {
    name: 'SsCouponList',
    props: {  
        showCoupons: {// 详情页是否显示优惠券入口
            type: Boolean | Number,
            default: false
        }, 
        coupon_lists: { // 优惠券列表数据
            type: Array,
            default: () => []
        },
        reportData: { // 数据上报埋点事件名
            type: String,  
            default: null
        },
    },
    data() {
        return {
            couponsBoxShow: 0, // 控制详情页优惠券领取弹窗的显示
            coupon_type: 1, // 优惠券的领取状态，默认为领取
            successBoxShow: 0, // 是否领取优惠券的提示
            boxWords: '领取成功', // 领取状态的文案
            isInfoCollectLoad: false, // 加载信息采集接口
            needInfoCollect: false, // 是否需要信息采集
            outerVisible: false, // 外层信息采集组件-显示开关
            innerVisible: false, // 内层信息采集组件-显示开关
            infoCollectBack: () => {}, // 信息采集后，回调方法
            couponId: ''
        };
    },
    watch: {
        isInfoCollectLoad(val) {
            if (val) {
                if (this.needInfoCollect) {
                    this.innerVisible = true;
                } else {
                    this.$nextTick(() => {
                        this.infoCollectBack();
                        this.closeInfo();
                    });
                }
            }
        }
    },
    computed: {
        usefulCouponsForDisplay() {
            // 最多显示三种类型优惠券
            let couponTitle = '';
            let array = [];
            array = this.coupon_lists.filter((coupon, index) => index < 2);
            array = array.map((coupon) => {
                if (coupon.require_price !== 0) {
                    // discount_way优惠方式， 1 满减券；2 折扣券
                    if (coupon.discount_way === 2) {
                        couponTitle = `满${(coupon.require_price / 100)}享${coupon.discount_percent / 10}折`;
                    } else {
                        couponTitle = `满${(coupon.require_price / 100)}减${(coupon.price / 100)}`;
                    }
                } else {
                    // discount_way优惠方式， 1 满减券；2 折扣券
                    if (coupon.discount_way === 2) {
                        couponTitle = `${coupon.discount_percent / 10}折优惠券`;          
                    } else {
                        couponTitle = `${(coupon.price / 100)} 优惠券`;
                    }
                }
                return {
                    ...coupon,
                    couponTitle
                };
            });
            array = array.filter((coupon, index) => {
                // 标题太长显示一个 
                if (coupon.couponTitle && coupon.couponTitle.length > 12) {
                    return index < 1;
                } else {
                    return index < 2;
                }
            });
            return array;
        }
    },
    components: {
        coupon,
        newInfoCollection
    },
    mounted() {
        const that = this;
        // 监听领取成功的状态
        EventBus.$on('getSuccess', (data) => {
            that.successBoxShow = 1;
            that.boxWords = data;
            setTimeout(() => {
                that.successBoxShow = 0;
            }, 500);
        });
        // 监听领取失败的状态
        EventBus.$on('getFail', (data) => {
            that.successBoxShow = 1;
            that.boxWords = data;
            setTimeout(() => {
                that.successBoxShow = 0;
            }, 1000);
        });
    },
    methods: {
    // 显示优惠券列表弹框
        showCouponsBox() {
            try {
                if (this.reportData) {
                    this.dataUpPush(this.reportData)
                }
            } catch (error) {      
                console.log(error);
            }
            this.couponsBoxShow = 1;
        },
        // 隐藏优惠券列表弹框
        hideCouponsBox() {
            this.couponsBoxShow = 0;
        },
        /**
      埋点上报 
      data-自定义事件名称
      */
        dataUpPush(data) {
            const dataUpArr = {
                et: 1,
                actn: data
            };
            try {
                window._YS_report.push([dataUpArr]);
            } catch (error) {
                console.log(error)
            }
        },
        getInfoCollect(item) {
            this.couponId = item.id;
            this.outerVisible = true;
            this.infoCollectBack = item.cb;
        },
        onInfoCollectionLoaded(isInfoCollectLoad, needCollectBeforePay) {
            this.needInfoCollect = needCollectBeforePay;
            this.isInfoCollectLoad = isInfoCollectLoad;
        },
        closeInfo() {
            this.innerVisible = false;
            this.outerVisible = false;
            this.isInfoCollectLoad = false;
            this.needInfoCollect = false; 
        }
    }
};
</script>

<style lang="scss" scoped>
.section-useful-coupons-wrap {
    display: flex;
    align-items: center;
    font-size: 0.26rem;
    color: #484848;
    padding: 0.3rem 0.2rem;
    height:.96rem;
    box-sizing: border-box;
    background:url('../../assets/images/couponList/coupon_listBg.png');
    background-size:100% 100%;
    .coupons {
        flex: 1;
        padding: 0 0.04rem 0 0.12rem;
      .tag {
          position: relative;
          display: inline-flex;
          color: #FF882D;
          font-size: 0.28rem;
          border-radius: 0.06rem;
          padding: 0.02rem 0.17rem;
      }
  }
  .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      width:1.6rem;
      height:0.56rem;
      background:#FF9849;
      border-radius:0.28rem;
      color: #fff;
      font-size: 0.24rem;
      text-align: center;
      span{
          color:#999999;
          font-size:0.28rem;
      }
      img {
          width: 0.15rem;
          height: 0.24rem;
          margin-left: 0.2rem;
      }
  }
}


.boxScreen {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
}

.usefulCouponsBox {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    margin: 0 auto;
    max-width: 480px;
    height: 9.66rem;
    background: #F5F6F9;
    border-radius: 0.24rem 0.24rem 0 0;
}

.couponBoxTitle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 1.08rem;
    line-height: 0.54rem;
    text-align: center;
    .couponBoxTitleName{
        font-weight: 500;
    }
}

.couponBoxClose {
    position: absolute;
    right: 0.2rem;
    top: 0.3rem;
    width: 0.4rem;
    height: 0.4rem;
}

.couponBoxClose img {
    position: relative;
    top: 0.1rem;
    left: 0.1rem;
    float: left;
    width: 0.24rem;
    height: 0.24rem;
}

.usefulCouponsList {
    width: 100%;
    height: 8.26rem;
    overflow: auto;
    box-sizing: border-box;
    padding: 0 0.32rem;
    -webkit-overflow-scrolling: touch;
}

.successBox {
    position: fixed;
    top: 50%;
    left: 50%;
    background: rgba(0, 0, 0, 0.7);
    transform: translate(-50%, -50%);
    border-radius: 0.1rem;
    padding: 0.16rem 0.32rem;
    font-size: 0.28rem;
    z-index: 11;
    color: #fff;
}

.successIcon {
    width: 0.98rem;
    height: 0.7rem;
    margin-top: 0.5rem;
    margin-left: auto;
    margin-right: auto;
}

.successIcon img {
    float: left;
    width: 100%;
    height: 100%;    
}

.successWord {
    width: 100%;
    height: 0.33rem;
    margin-top: 0.2rem;
    text-align: center;
}

.conponsBarShow {
    float: left;
    margin-left: 0.2rem;
}

.conponsBarItem {
    position: relative;
    float: left;
    margin-right: 0.2rem;
    overflow: hidden;
}
</style>