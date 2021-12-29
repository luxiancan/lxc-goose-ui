<!-- 优惠券 coupon_type: 1-领取 2-继续领 3-已领完 4-已过期(领取失败) 5-已结束 6-已达上限 -->
<template>
 <div class="couponWrap_box">
    <coupon-item :item="item">
        <div class="couponState" slot="couponState">
            <div class="getCouponBtn t3" v-if="coupon_type === 1" @click="getCouponStatus">点击领取</div>
            <div class="getCouponBtn t3" v-if="coupon_type === 2" @click="getCouponStatus">继续领</div>
            <div class="getCouponBtn disabledBtn t3" v-if="coupon_type == 3">已抢光</div>
            <p class="hasReceivedStatus" v-show="item.current_user_received_count > 0 || has_received"></p>
        </div>
    </coupon-item>
 </div>
</template>

<script>
    import NetWork from '@/lib/network.js';
    import EventBus from '@/lib/eventbus.js';
    import couponItem from '@/components/couponItem/index.vue';
    export default {
        components: {
            couponItem
        },
        props: {  
            item:{//单张优惠券
                type: Object,
                default: ()=>{
                    return {}
                }
            }, 
            coupons_type:{ //当前优惠券的状态值
                type: Number | String ,  
                default: 1
            },
            isInfoCollectLoad: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                coupon_type: 1,//状态类型
                has_received: false,//标记是否领取过
                is_viewMoreInfo:false, //是否点击了详细信息
            };
        },
        created () {
            this.coupon_type = this.coupons_type;
            // 如果当前优惠券用户已领取过，变更状态
            if (this.item.current_user_received_count > 0) {
                this.coupon_type = 2;
            }
        },
        methods: {
            // 执行优惠券的领取操作，并反馈结果
            getCouponStatus () {
                if (!this.isInfoCollectLoad) {
                    this.$emit('getInfoCollect', {
                        cb:() => {
                            this.getCouponStatus();
                        },
                        id: this.item.id
                    });
                    return;
                } 

                const that = this;
                NetWork.request('/addMyCoupon/v3', {id: this.item.id}, function (data) {
                    const code = data.code;
                    let dataInfo = data.data;
                    if (code == 0) {                        
                        that.coupon_type = 2;
                        that.has_received = true;
                        // 达到领取上限，隐藏按钮
                        if( dataInfo && dataInfo.receive_rule === dataInfo.current_user_received_count){
                           that.coupon_type = 6;
                        }
                        EventBus.$emit('getSuccess', '领取成功');
                    } else if (code == 101) {
                        that.coupon_type = 3;
                        EventBus.$emit('getFail', '该优惠券已抢光');
                    } else if (code == 103) {
                        that.coupon_type = 5;
                        EventBus.$emit('getFail', '领取失败');
                    } else {
                        that.coupon_type = 4;
                        EventBus.$emit('getFail', '领取失败');
                    }
                });
                this.dataUpPush('detail_coupon_received');
            },
            // 控制查看信息按钮点击操作
            handleLook(){
                 this.is_viewMoreInfo = !this.is_viewMoreInfo;
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

<style lang="scss" scoped>
    .couponWrap_box{
        width: 6.9rem;
        margin-bottom: 0.24rem;
        margin-left: auto;
        margin-right: auto;
       &:last-child {
            margin-bottom: 0;
        }
        .detail_info{
            padding: 0.32rem;
            background-color: #FFFAF4;
            box-sizing: border-box;
            border-radius: 0 0 4px 4px;
            color: #505050;
            font-size: 0.2rem;
        }
    }
    .couponNewV2 {
        position: relative;
        width: 6.9rem;
        height: 2.04rem;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
        border-radius: 4px;
        background-color: #fff;

        .couponValue {
            float: left;
            width: 2.2rem;
            height: 2.04rem;
            background: linear-gradient(to right,#FFB073,#FF9D52);
            border-right: 1px dashed rgba(255,155,44,0.4);
            box-sizing: border-box;
            border-radius: 4px 0 0 4px;
            .couponPrice {
                position: relative;
                width: 100%;
                height: 0.9rem;
                margin: 0.2rem auto 0;
                font-size: 0.64rem;
                font-weight: 500;
                color: #fff;
                text-align: center;
                line-height: 0.9rem;

                .fontSmall {
                    font-size: 0.48rem !important;
                }
                .fontLastSmall{
                    font-size: .32rem !important;
                }
                
                .fixedfont{
                    font-size: .24rem !important;
                    
                }
                span {
                    position: relative;
                    display: inline-block;
                }
                 .discountFont{
                    font-size: 0.32rem;
                    margin-left: 0.02rem;
                }
                
            }
           
            .couponUseCondition {
                width: 100%;
                text-align: center;
                overflow: hidden;
                color:#fff;
            }
        }

        .couponInfo {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            float: left;
            width: 3rem;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            padding: .32rem 0 .32rem .24rem;
            border-bottom-right-radius: 0.08rem;
            border-top-right-radius: 0.08rem;
            color:#888888;          
            font-size: 0.2rem;
            span{
                display: inline-block;
            }
            .couponName {
                width: 100%;
                line-height: 0.3rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: .16rem;
                color:#505050;
                font-size: 0.24rem;
            }
            .couponUseTime {
                width: 100%;
                height: 0.28rem;
                line-height: 0.28rem;
                font-size: 0.2rem;
            }
            .moreInfo{
                vertical-align: bottom;
                padding: 0.02rem 0;
            }
            .operateBtn{
                width: 0.24rem;
                height: 0.24rem;
                cursor: pointer;
            }
            .expand{                
                background: url('../../../assets/images/couponList/expand.png') center no-repeat;
            }
            .retract{
                background: url('../../../assets/images/couponList/retract.png') center no-repeat;
            }
        }

        .couponState {    
            position: relative;
            float: left;
            width: 1.7rem;
            height: 100%;
            border-bottom-left-radius: 0.08rem;
            border-top-left-radius: 0.08rem;
            

            .getCouponBtn {
                position: absolute;
                right: .32rem;
                top: 50%;
                width: 1.5rem;
                height: .56rem;
                margin-top: -.28rem;
                border-radius: 0.28rem;
                box-sizing: border-box;
                color: #fff;
                text-align: center;
                line-height: .56rem;
                font-size: 0.24rem;
                background: #FF9849;
                font-weight:500;
            }

            .disabledBtn {
                opacity: .4;
            }

            .hasReceivedStatus {
                position: absolute;
                bottom: -0.04rem;
                right: -0.14rem;
                width: 1.06rem;
                height: 1.06rem;
                background: url('../../../assets/images/couponList/seal_receivingPage_received.png') center no-repeat;
                background-size: 100%;
                margin: 0;
            }
        }
    }
</style>