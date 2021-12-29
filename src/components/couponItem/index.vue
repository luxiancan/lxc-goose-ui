<template>
 <div class="couponNewWrap" :style="{'width':outWidth}">
    <div class="couponNewV2" :style="{'background-color':couponBgcolor,'width':outWidth}" :class="{'disabledState':disabled}">
        <div class="couponValue"  :style="{'background':couponValueBg}" :class="{'unselectState':!lightState}">
            <div class="couponPrice">
                <template v-if="item.discount_way === 1">
                    <span class="coupon-symbol">￥</span>
                    <span style="left: -0.05rem;" :class="{'fontSmall': isLongNum(item.price) == 'small','fontLastSmall':isLongNum(item.price)=='smallLast'}">{{item.price | ToFilter}}<span class="fixedfont" v-if="item.price % 100 !== 0">.{{fixedFont(item.price)}}</span></span>              
                </template>
                <span style="left: -0.05rem;" :class="{'fontSmall': isLongNum(item.price) == 'small','fontLastSmall':isLongNum(item.price)=='smallLast'}" v-if="item.discount_way === 2">{{item.discount_percent | ToFilter(false)}}<span class="fixedPercent" v-if="item.discount_percent % 10 !== 0">.{{fixedFont(item.discount_percent,false)}}</span><span class="discountFont">折</span></span>
            </div>
            <div v-if="item.require_price==0" class="couponUseCondition t3">无门槛</div>
            <div v-if="item.require_price!=0" class="couponUseCondition t3">{{item.discount_way === 2 ? `满${item.require_price/100}元可用`:`满${item.require_price/100}减${item.price/100}元`}}</div>
        </div>
        <div class="couponInfo">
            <div class="couponName">{{item.title.length > 10 ? `${item.title.substr(0, 10)}...`:item.title}}</div>
            <span class="couponUseHint" v-if="item.type==0">部分{{isEnterpriseLive?'商品':'课程'}}可用</span>
            <span class="couponUseHint" v-if="item.type==1">全部{{isEnterpriseLive?'商品':'课程'}}可用</span>
            <span class="couponUseTime" v-if="item.valid_day">{{item.valid_after === 1? `领取次日`:`自领取起`}}{{item.valid_day}}天内有效</span>
            <span class="couponUseTime" v-if="!item.valid_day && item.valid_at && item.invalid_at">{{formatDate(item.valid_at)}}-{{formatDate(item.invalid_at)}}</span>          
            <div class="moreInfo" v-if="!disabled">详细信息 <span class="operateBtn expand" :class="{'retract':is_viewMoreInfo}" @click="handleLook"></span> </div>
        </div>
        <div class="couponState">
            <slot name="couponState"></slot>
        </div>
    </div>
    <!-- 详细信息框 -->
    <div class="detail_info" v-show="is_viewMoreInfo" :style="{'background-color':detailInfoBg}" :class="{'white_bg':disabled}">
        <template v-if="disabled">
            <img src="../../assets/images/couponItem/hint.png" class="disabledHint">
            <span>{{item.invalid_text}}</span>
        </template>
        <template v-else>
            <div class="available_detail_info">
                <div  v-if="dateInDetail && item.valid_at && item.invalid_at">有效时间：{{formatDateToMinte(item.valid_at)}}-{{formatDateToMinte(item.invalid_at)}}</div>
                <div>{{item.type ==1?'全部':'部分'}}{{isEnterpriseLive?'商品':'课程' }}可用</div>            
                <template v-if="item.require_price!=0">
                         <div v-if="item.discount_way === 2">满{{item.require_price/100}}元享{{item.discount_percent/10}}折<span v-if="item.discount_limit_price">，最多可减{{item.discount_limit_price/100}}元</span></div>
                         <div v-if="item.discount_way === 1">满{{item.require_price/100}}元可用</div>
                </template>
                <template v-else>
                    <div v-if="item.discount_way === 2 && item.discount_limit_price">最多可减{{item.discount_limit_price/100}}元</div>
                </template>

            </div>
        </template>
    </div>
 </div>
</template>

<script>
    const ENTERPRISE_LIVE = 'qlive_shop'; //企业直播
    export default {
        name:'SsCouponItem',
        props: {
            item:{ //单个优惠券数据
                type: Object,
                default: ()=>{
                    return {}
                }
            },
            outWidth:{ //外部优惠券高度
                type: String,
                default:'6.9rem'
            },
            couponValueBg:{ //单个优惠券左边金额背景颜色，默认渐变背景
                type: String,
                default:'linear-gradient(to right,#FFB073,#FF9D52)'
            },
            outborder:{ //单个外部边框颜色
                type: String,
                default:'none'
            },
            outHeight:{ //单个外部高度
                type: String,
                default:'2.04'
            },
            detailInfoBg:{ //详细信息的背景色
                type: String,
                default:'#FFFAF4'
            },
            couponBgcolor:{//单个优惠券边框外部别背景色
                type: String,
                default:'#fff'
            },
            disabled:{ //标记优惠券是否可用，默认可用 
                type: Boolean,
                default:false
            },
            lightState:{ //标记优惠券是否处于高亮太 默认高亮，选择优惠券时，不选中时，处于未高亮态
                type: Boolean,
                default:true
            },
            dateInDetail:{ //时间分秒信息是否展示在详细信息里面，默认不展示
                type: Boolean,
                default:false
            }
        },
        data () {
            return {
                is_viewMoreInfo:false, //是否点击了详细信息
            };
        },
        created () {
            // 如果不可用优惠券，详细信息默认展开
           if( this.disabled){
             this.is_viewMoreInfo = true;
           }
        },
        computed: {
            // 是否为企业直播店铺
            isEnterpriseLive(){
                const qLive = window.wx.SHOP_TYPE_ENV;
                return qLive == ENTERPRISE_LIVE
            },
            // 时间精确到日期
            formatDate () {
                return function (date) {
                    let execStr = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date);
                    if( execStr && execStr[0] ){
                        return execStr[0].replace(/-/g, '.');
                    }else{
                        return date
                    }
                    
                };
            },
            // 时间精确到分
            formatDateToMinte(){
                return function (date) {
                    if(date){
                      let lastIndex = date.lastIndexOf(':');
                       return date.substring(0,lastIndex).replace(/-/g,".");
                    }else{
                        return date
                    }
                    
                };
            },
            // 判断金额长度，不同金额区间端显示不同样式
            isLongNum () {
                return function (price) {             
                    if(price) {
                        let tempPrice = price/100;
                        if( price % 100 === 0){                        
                            if (tempPrice.toString().length > 5) {
                                    return 'smallLast';
                                } else if(tempPrice.toString().length > 3) {
                                    return 'small';
                                }else{
                                    return 'normal';
                                }
                        }else{
                            // 含小数点
                            if (tempPrice.toString().length > 7) {
                                return 'smallLast';
                            } else if(tempPrice.toString().length > 5) {
                                return 'small';
                            }else{
                                return 'normal';
                            }
                        }
                    
                    }else{
                        return 'normal';
                    }

                };
            },
            // 小数点后的样式补充 ToFix2-默认保留2位,其他保留1位
            fixedFont(){
                return (value,ToFix2=true) =>{
                    if(value){
                        let result = (value/100).toString();
                        if(!ToFix2){
                            result = (value/10).toString();
                        }
                        if( result.toString().indexOf('.') >-1){
                            return result.split('.')[1]; 
                        }else{
                            return '';  
                        }
                    }

                }
            }         
        },
        filters: {
            // 做数值过滤，value-要处理的数字 ToFix2-默认保留两位，默认转分转元，除以100。其他除以10(如折扣)
            ToFilter: (value,ToFix2=true)=> {
                let result = (value/100).toString();
                if(!ToFix2){
                   result = (value/10).toString();
                }             
                if( result.indexOf('.') >0){
                    return result.split('.')[0]; 
                }else{
                    return result;  
                }
                        
            }
        },
        methods: {
            // 控制查看信息按钮点击操作
            handleLook(){
                 this.is_viewMoreInfo = !this.is_viewMoreInfo;
                 this.dataUpPush('优惠券_详细信息');
            },
            /**
                埋点上报 
                data-自定义事件名称
                */
            dataUpPush(data) {
                let dataUpArr = {
                    et: 1,
                    sc: 2,
                    cpg: "优惠券组件",
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
    .couponNewWrap{
        width: 6.9rem;
        margin-bottom: 0.24rem;
        margin-left: auto;
        margin-right: auto;
       &:last-child {
            margin-bottom: 0;
        }
        .detail_info{
            display: flex;
            align-items: center;
            padding: 0.32rem;
            background-color: #FFFAF4;
            box-sizing: border-box;
            border-radius: 0 0 4px 4px;
            color: #505050;
            font-size: 0.2rem;
            text-align: left;
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
            width: 2.08rem;
            height: 2.04rem;
            background: linear-gradient(to right,#FFB073,#FF9D52);
            box-sizing: border-box;
            border-radius: 4px 0 0 4px;
            .couponPrice {
                position: relative;
                width: 100%;
                height: 0.9rem;
                margin: 0.28rem auto 0.08rem;
                text-align: center;
                line-height: 0.9rem;
                font-size: 0.88rem;
                font-weight: 500;
                color: #fff;
                .fontSmall {
                    font-size: 0.48rem !important;
                }
                .fontLastSmall{
                    font-size: .32rem !important;
                }
                
                .fixedfont{
                    font-size: .24rem !important;
                    
                }
                .fixedPercent{
                    font-size: .32rem !important;
                }
                span {
                    position: relative;
                    display: inline-block;
                }
                 .discountFont,.coupon-symbol{
                    font-size: 0.32rem;
                    margin-left: 0.02rem;
                    margin-left: -0.01rem;
                }
               
            }
           
            .couponUseCondition {
                width: 100%;
                overflow: hidden;
                max-height: 0.8rem;
                line-height: 0.36rem;
                color:#fff;
                text-align: center;
            }
        }
       // 非高亮态样式
        .unselectState{
           background: #CDCDCD!important;
        }

        .couponInfo {
            float: left;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 3rem;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            padding: .32rem 0 .32rem .24rem;
            border-bottom-right-radius: 0.08rem;
            border-top-right-radius: 0.08rem;
            color:#888888;          
            font-size: 0.2rem;
            text-align: left;
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
                font-weight:500;
            }
            .couponUseTime {
                width: 100%;
                height: 0.28rem;
                line-height: 0.28rem;
                font-size: 0.2rem;
            }
            .moreInfo{
                display: flex;
                align-items: center;
                padding: 0.02rem 0;
            }
            .operateBtn{
                width: 0.24rem;
                height: 0.24rem;
                cursor: pointer;
                margin-left: 0.06rem;
                background-size: 100% 100%;
            }
            .expand{                
                background: url('../../assets/images/couponItem/down.svg') center no-repeat;               
            }
            .retract{
                background: url('../../assets/images/couponItem/up.svg') center no-repeat;
            }
        }

        .couponState {
            float: left;
            position: relative;
            width: 1.7rem;
            height: 100%;
            border-bottom-left-radius: 0.08rem;
            border-top-left-radius: 0.08rem;
        }
    }
    // 优惠券不可用样式
    .disabledState{
        background-color: #EEEEEE!important;
       .couponValue{
           background: #CDCDCD!important;
       }
    }
    // 详细信息不可用优惠券时的字段
    .white_bg{
        background-color: #fff!important;
    }
    .disabledHint{
        width: 0.28rem;
        margin-right: 0.1rem;
    }
</style>