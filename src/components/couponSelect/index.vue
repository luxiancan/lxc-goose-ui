<template>
    <div class="coupon-select-box">
        <div class="coupon-header">
            <span class="c2 t1">选择优惠券</span>
            <div class="coupon-box-close" @click="hideCouponsBox"><img src="../../assets/images/couponSelect/icon_close.png" alt="关闭按钮"></div>
        </div>
        <div class="coupon-tab_warp">
            <div class="tabItem" v-for="tab in coupon_tab" :key="`coupon-tab${tab.activeIndex}`" @click="curTabIndex=tab.activeIndex">
                <span class="tabTitle" :class="{'greyColor':curTabIndex !== tab.activeIndex}">{{tab.activeIndex === 1 ?`${tab.tabName}(${couponList.length})` : `${tab.tabName}(${disableCouponList.length})`}}</span> 
                <span class="activeBorder theme-customize-bg" v-show="curTabIndex === tab.activeIndex"></span>
            </div>           
        </div>
        <!-- 可用优惠券 -->
        <div class="coupon-list" v-show="curTabIndex==1">
            <template v-if="couponList.length>0">
                <div v-for="(item, index) in couponList" :key="`coupon-item-${index}`" class="coupon-item">                    
                    <coupon-item :item="item" :lightState="current_item.cu_id === item.cu_id" :dateInDetail="true">
                        <div class="coupon-choose-box" slot="couponState"  @click="choose(item)">
                            <div class="coupon-choose" :class="{'coupon-unchoosed': current_item.cu_id !== item.cu_id}"></div>
                        </div>
                    </coupon-item>               
                </div>
            </template>
            <div class="coupon_emptypage" v-else >
               <div class="coupon_emptyImg"></div>
               <div>您暂无可使用的优惠券</div>
            </div>
        </div>
        <!-- 不可用优惠券 -->
        <div class="coupon-list disabledList" v-show="curTabIndex==2">
            <div v-for="(item, index) in disableCouponList" :key="`disable_dcoupon-item-${index}`" class="coupon-item">
                <coupon-item :item="item" :disabled="true"  :dateInDetail="true"></coupon-item>
            </div>
        </div>
        <div class="coupon-confirm-box">
            <div class="coupon-confirm-btn theme-customize-bg theme-customize-font-black" @click="confirm">确定</div>
        </div>
    </div>
</template>
<script>
import  couponItem  from '../couponItem/index';
 export default {
    components: {
        couponItem
    },
    props: {
        choosedCoupon: { //当前选中的优惠券
            type: Object,
            default: ()=>{
                return {}
            }
        },
        couponList: { //可用优惠券列表
            type: Array,
            default: ()=>{
                return []
            }
        },
        disableCouponList:{ //不可用优惠券列表
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    data () {
        return {
            current_item: {},
            coupon_tab:[
                {
                  tabName:'可用优惠券',
                  activeIndex:1

                },{
                  tabName:'不可用优惠券',
                  activeIndex:2
                }],
            curTabIndex:1, //当前tab索引，默认为可用tab
        };
    },
    watch: {
        choosedCoupon() {
            this.current_item = this.choosedCoupon;
        }
    },
    methods: {
        /**
          选择优惠券的操作 
         item-优惠券的数据对象
         */
        choose(item) {
            if (this.current_item.cu_id === item.cu_id) {
                this.current_item = {cu_id: 'couponNoUse'};
            } else {
                this.current_item = item;
            }
        },
        // 关闭优惠券选择框
        hideCouponsBox () {
            this.$emit('close', '');
        },
        // 确认选中的优惠券并向父组件传递当前选中的优惠券的信息
        confirm () {
            if (this.current_item.cu_id === '') {
                this.$emit('close', {cu_id: 'couponNoUse'});
            } else {
                this.$emit('close', this.current_item);
            }
            this.dataUpPush('payment_coupon_confirm');
        },
        /**
          埋点上报 
          data-自定义事件名称
         */
        dataUpPush(data) {
            let dataUpArr = {
                et: 1,
                actn: data
            };
            try {
                 window._YS_report.push([dataUpArr]);
            } catch (error) {
                console.log(error)
            }
        }
    }
 };

</script>

<style scoped lang="scss">
.coupon-select-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;  
    z-index: 11;
    margin: 0 auto;
    display: flex;
    align-items:center;
    flex-flow: column;
    max-width: 480px;
    height: 9.28rem;
    background-color: #F5F6F9;
    border-radius: .24rem .24rem 0 0;

    .coupon-header {
        position: relative;
        width: 100%;
        height: 1.2rem;
        line-height: 0.6rem;
        text-align: center;

        .coupon-box-close {
            position: absolute;
            width: 0.4rem;
            height: 0.4rem;
            right: 0.2rem;
            top: 0.3rem;

            img {
                float: left;
                position: relative;
                width: 0.24rem;
                height: 0.24rem;
                top: 0.1rem;
                left: 0.1rem;
            }
        }
    }
    .coupon-tab_warp{
        display: flex;
        justify-items: center;
        align-items: center;
        width:100%;
        height: 0.96rem;
        font-size: 0.32rem;
        text-align: center;
        background-color:#fff;
        margin-bottom: 0.24rem;
        span{
            display: block;
        }
        .tabItem{
            position: relative;
            width:50%;
            height:0.96rem;
            line-height: 0.96rem;
            text-align: center;
            cursor: pointer;
        }
        .greyColor{
            color: #999999;
            font-size: 0.28rem;
        }
        .activeBorder{
            position:absolute;
            bottom:0;
            left:50%;
            transform: translateX(-50%);
            width:0.4rem;
            height:0.04rem;
            background:#09BB07;
            border-radius:0.03rem;
        }
    }
    .coupon-list {
        width: 100%;
        box-sizing: border-box;
        padding:.32rem;
        height: 6.2rem;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        text-align: center;

        .coupon-item {
            position: relative;
            display: flex;
            width: 6.9rem;
            margin-bottom: 0.3rem;           
            border-radius: 4px;
            background: #fff;

            .coupon-choose-box {
                display: flex;
                align-items: center;
                justify-content: center;
                width:1.6rem;
                height: 100%;
                border-radius: 0 .24rem .24rem 0;

                .coupon-choose {
                    width: 0.4rem;
                    height: 0.4rem;
                    background-size: 100% 100%;
                    border-radius: 50%;
                    box-sizing: border-box;
                    background: url(../../assets/images/couponSelect/coupon_select.png);
                    background-size: 100% 100%;
                }

                .coupon-unchoosed {
                    background: url(../../assets/images/couponSelect/coupon_unselect.png);
                    background-size: 100% 100%;
                }
            }
        }
        
    }
    .coupon_emptypage{
           text-align: center;
           font-size: 0.32rem;
           color:#ADADB4;          
            .coupon_emptyImg{
                width:4.8rem;
                height: 4.4rem;
                margin: 0.3rem auto 0;
                background: url('../../assets/images/couponSelect/emptypage.svg');
                background-size: 100% 100%;
            }         
           
        }
    .coupon-confirm-box {
        width: 100%;
        height: 1.12rem;
        box-sizing: border-box;
        padding: .12rem .32rem;
        background: #fff;

        .coupon-confirm-btn {
            width: 100%;
            height: .88rem;
            background: #09BB07;
            border-radius: .44rem;
            text-align: center;
            line-height: .88rem;
            color: #fff;
            font-size: .28rem;
        }
    }
}
</style>