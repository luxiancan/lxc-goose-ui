<template>
   <div>
       <div class="recommend-block-wrapper">
            <p>精品课程</p>
            <div v-for="(item,index) in recommendList" :key="index" class="recommend-wrapper"  @click="handleItemClick(item)">
                <div  class="recommend-cover-wrapper">
                    <span class="recommend-market-tag" v-if="item.marketing_tag[0]">{{ item.marketing_tag[0] }}</span>
                    <img :src="item.img_url" class="recommend-cover-img" />
                    <span class="recommend-cover-type EC10" v-if="srcTypeMap[item.src_type]">{{ srcTypeMap[item.src_type] }}</span>
                </div>
                <div class="recommend-cover-base-wrapper">
                    <span class="recommend-cover-base-title EC13 ET5">{{ item.title }}</span>
                    <div class="recommend-cover-base-price EC13 ET5" v-if="item.show_price"><span class="ET6">￥</span>{{ item.show_price }}</div>
                </div>
            </div>
        </div>
        <div v-if="recommendList.length==0" class="empty-recommend">
            <img src="@/assets/images/aliveRecommend/details_no_recommend.png" />
            <span>进入主页发现更多精品课程</span>
        </div>
   </div>
</template>

<script>
export default {
    name: 'recommend',
    props: {
        recommendData: {
            type: Object,
            default: ()=>{
                return {
                    list: []
                }
            }
        }
    },
    data() {
        return {
            srcTypeMap: { // 资源类型映射
                audio: '音频',
                image_text: '图文',
                video: '视频',
                member: '会员',
                alive: '直播',
                column: '专栏',
                topic: '大专栏',
                distribute_goods: '专栏',
                content_market: '专栏',
                term: '训练营',
                big_class: '班课'
            },
        };
    },
    computed: {
        recommendList() {
            return this.recommendData.list;
        }
    },
    methods: {
        handleItemClick (item) {
            this.$emit('item-click', item);
        }
    }
};
</script>

<style lang="scss" scoped>
.recommend-block-wrapper{
    margin-top:0.4rem;
    padding-bottom: 0.32rem;
    p{
        font-size:0.32rem;
        font-weight:500;
        color:#000000;
        margin-left:0.32rem;
        margin-bottom:0.32rem;
        display: flex;
        align-items: center;
    }
    .recommend-wrapper{
        display: flex;
        justify-content: space-between;
        margin-bottom:0.42rem;
        padding:0 0.32rem;
        flex-shrink: 0;
        .recommend-cover-wrapper{
            width:2rem;
            height:1.5rem;
            position: relative;
            overflow: hidden;
            .recommend-market-tag{
                position: absolute;
                top: .24rem;
                left: -.5rem;
                width: 1.8rem;
                height: .3rem;
                line-height: .3rem;
                text-align: center;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                background: #ff002a;
                color: #fff;
                font-size: .2rem;
            }
            .recommend-cover-img{
                width:2rem;
                height:1.5rem;
                border-radius:0.08rem;
            }
            .recommend-cover-type{
                font-size: 0.18rem;
                padding:0 0.12rem;
                height:0.32rem;
                background:rgba(0,0,0,0.5);
                border-radius:0.04rem;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                bottom:0.1rem;
                right:0.1rem;
            }
        }
        .recommend-cover-base-wrapper{
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            flex:1;
            margin-left:0.24rem;
            .recommend-cover-base-title{
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
                word-break: break-all;
                font-weight:500;
            }
            .recommend-cover-base-price{
                text-align: right;
                font-weight:500;
            }
        }
    }
}
.empty-recommend{
    text-align: center;
    padding: 0.8rem 0;
    // margin-top:0.8rem;
    // margin-bottom:0.8rem;
    img{
        width:1.76rem;
        height:1.62rem;
    }
    span{
        margin-top:0.32rem;
        font-size: 0.24rem;
        color:#999999;
        display: block;
        text-align: center;
    }
}
.recommend-useful-coupon-wrapper{
    border-bottom:0.02rem solid #F5F6F9;
    margin:0.4rem 0.32rem 0 0.32rem;
    padding-bottom:0.4rem;
}
</style>
