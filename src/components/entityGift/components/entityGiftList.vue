<template>
    <div class="entity-list" @touchmove.stop @click.stop="close">
        <div class="entity-list-wrapper" @click.stop>
            <div class="entity-list-header">
                <span class="entity-list-title t1">套餐</span>
                <div class="entity-list-close" @click="close">
                    <img src="@/assets/images/couponList/icon_close.png" alt="" class="img">
                </div>
            </div>
            <div class="entity-list-count">
                <span class="entity-list-count-item">总价：￥{{total}}</span>
                <span class="entity-list-count-item">实付：￥0</span>
            </div>
            <div class="entity-goods-list">
                <entity-item v-for="goods in goodsList" :key="goods.goods_id" :goods="goods"></entity-item>
                <div class="entity-list-tips" v-if="courseCount">* 知识商品只能领取一次</div>
            </div>
        </div>
    </div>
</template>

<script>
import NetWork from '@/lib/network';
import entityItem from './entityItem';

export default {
    name: 'entityGiftList',
    props: {
        // 知识商品数量
        courseCount: {
            type: Number,
            default: 0
        },
        goodsId: {
            type: String,
            default: ''
        },
        resourceType: Number
    },
    data() {
        return {
            goodsList: []
        }
    },
    components: {
        entityItem
    },
    computed: {
        total() {
            return (this.goodsList.reduce((total, good) => {
                return total + good.sku_price;
            }, 0) / 100).toFixed(2)
        }
    },
    created() {
        this.getGoodsInfo();
    },
    methods: {
        close() {
            this.$emit('close')
        },
        getGoodsInfo() {
            NetWork.request('marketing/get_package_goods_list', {
                goods_id: this.goodsId,
                resource_id: this.goodsId,
                resource_type: this.resourceType
            }, (res) => {
                if (res.code === 0) {
                    this.goodsList = res.data.goods_list
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.entity-list {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100vh;
    background: rgba($color: #000000, $alpha: 0.5);

    &-wrapper {
        flex: 1;
        padding: .32rem 0;
        margin: 0 auto;
        max-width: 480px;
        overflow: auto;
        background: #ffffff;
        border-radius: 0.32rem 0.32rem 0px 0px;
    }

    &-header {
        position: relative;
        padding: 0 .32rem;
        text-align: center;
        font-weight: 600;
    }

    &-close {
        position: absolute;
        top: .1rem;
        right: .32rem;
        width: .24rem;
        height: .24rem;
        font-size: 0;

        .img {
            width: 100%;
            height: 100%;
        }
    }

    &-count {
        padding: .4rem .32rem .32rem;

        &-item {
            padding-right: .4rem;
        }
    }

    &-tips {
        padding: .48rem 0 1.4rem;
        line-height: .36rem;
        text-align: center;
        font-size: .24rem;
        color: #999;
    }
}

.entity-goods-list {
    padding: 0 .32rem;
    height: 63.1vh;
    overflow: auto;
}
</style>