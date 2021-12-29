<template>
    <div class="entity-item">
        <div class="entity-item__img-wrapper">
            <div class="entity-item__unavailable" v-if="isEntityGoods && goods.sku_stock === 0">
                <img src="@/assets/images/entityGift/replenish.png" class="unavailable-img" />
            </div>
            <div class="entity-item__unavailable" v-if="goods.goods_type === 35 && goods.sku_stock === 0">
                <img src="http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/kgfyr6j60r0xphcnw1hq.png"
                    class="unavailable-img" />
            </div>

            <div class="entity-item__img-inner" :class="{ 'entity-goods': isEntityGoods }">
                <img :src="goods.goods_img" class="goods-img" />
                <div class="entity-item__tag" v-if="showGoodsTag">{{goodsTag}}</div>
            </div>
        </div>
        <div class="entity-item__content">
            <div class="entity-item__title">{{goods.goods_name}}</div>
            <div class="entity-item__des ET6 EC11">{{descInfo}}</div>
            <div class="entity-item__amount EC11">
                <div class="entity-item__price"><span class="entity-item__price-currency">￥</span>{{goods.sku_price | priceFilter}}</div>
                <div class="entity-item__count ET6" v-if="isEntityGoods">x1</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'entityItem',
    props: {
        goods: Object,
        default: {}
    },
    computed: {
        // 商品描述信息。不同商品类型有不同的描述
        descInfo() {
            const type = this.goods.goods_type;
            const specs_info = this.goods.specs_info;
            let desc = '';
            switch (type) {
                case 21:
                    // 实物商品
                    desc = (specs_info && specs_info.reduce((specifications, good) => {
                            return !specifications ? good.spec_value : `${specifications};${good.spec_value}`;
                        }, '')) || '';
                    break;
                case 23:
                    // 超级会员
                    const svipInfo = this.goods.goods_specification;
                    const standardMap = {
                        1: '7天',
                        2: '1个月',
                        3: '3个月',
                        4: '6个月',
                        5: '12个月',
                        6: svipInfo.period + '天',
                        7: svipInfo.period + '天',
                        8: '永久有效',
                    }
                    desc = standardMap[svipInfo.type] || '';
                    break;
                default:
                    break;
            }
            return desc;
        },
        // 是否是实物商品
        isEntityGoods() {
            return this.goods.goods_type === 21;
        },
        // 是否展示商品标签，实物商品可以设置为 展示/不展示
        showGoodsTag() {
            return !this.isEntityGoods || this.goods.goods_tag_is_show === 1;
        },
        // 商品标签
        goodsTag() {
            const typeMap = {
                0: '全部',
                1: '图文',
                2: '音频',
                3: '视频',
                4: '直播',
                5: '会员',
                6: '专栏',
                7: '社群',
                8: '大专栏',
                9: '活动管理',
                16: '打卡',
                20: '电子书',
                21: this.goods.goods_tag,
                22: '分销商品',
                23: '超级会员',
                25: '训练营',
                29: '面授课',
                31: '小班课',
                34: '练习',
                35: '大班课',
            }
            return typeMap[this.goods.goods_type] || '';
        },
    },
    filters: {
        priceFilter(val) {
            return (val / 100).toFixed(2); 
        }
    }
};
</script>

<style lang="scss" scoped>
.entity-item {
    display: flex;

    &+.entity-item {
        margin-top: .32rem;
    }

    &__img-wrapper {
        position: relative;
        width: 2.4rem;
        min-width: 2.4rem;
        height: 1.8rem;
        border-radius: .08rem;
        overflow: hidden;
        border: .02rem solid #eee;
    }

    &__img-inner {
        position: relative;
        width: 100%;
        height: 100%;
        .goods-img {
            width: 100%;
            height: 100%;
            border-radius: .08rem;
        }
    }

    &__img-inner.entity-goods {
        margin: 0 auto;
        width: 1.8rem;
    }
    
    &__unavailable {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: .08rem;
        background: rgba($color: #000000, $alpha: .5);

        .unavailable-img {
            width: 1.28rem;
            height: 1.16rem;
        }
    }
    &__tag {
        position: absolute;
        right: .08rem;
        bottom: .08rem;
        padding: .02rem .06rem;
        line-height: .24rem;
        font-size: .16rem;
        border-radius: .04rem;
        background: rgba($color: #000000, $alpha: .5);
        color: white;
    }

    &__content {
        position: relative;
        flex: 1;
        margin-left: .24rem;
        overflow: hidden;
    }

    &__title {
        display: -webkit-box;
        margin: .04rem 0 .08rem;
        line-height: .4rem;
        font-weight: 500;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }

    &__des {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 95%;
        line-height: .34rem;
    }

    &__amount {
        position: absolute;
        bottom: .04rem;
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    &__price {
        font-size: .24rem;
    }

    &__price-currency {
        font-size: .2rem;
    }
}
</style>