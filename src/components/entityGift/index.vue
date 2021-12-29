<template>
    <div class="entity-gift-wrapper ET5 EC10_BG" v-if="count > 0 || courseCount > 0" @click.stop="openEntityList">
        <entity-gift-list
            v-if="clickable"
            v-show="showList"
            @close="hideEntityList"
            :courseCount="courseCount"
            :goodsId="goodsId"
            :resourceType="resourceType">
        </entity-gift-list>
        <div class="entity-gift-select">
            <span class="entity-gift-desc">
                <i class="iconfont icon-taocan"></i>
                内含<span v-if="count">{{count}}个实物商品</span><span v-if="count && courseCount">，</span><span v-if="courseCount">{{courseCount}}个课程</span>
            </span>
            <span v-if="clickable" class="iconfont icon-icon-pagination-right"></span>
        </div>
    </div>
</template>

<script>
import entityGiftList from './components/entityGiftList';

export default {
    name: 'ssEntityGift',
    components: {
        entityGiftList
    },
    props: {
        // 实物商品数量
        count: {
            type: Number,
            default: 0
        },
        // 知识商品数量
        courseCount: {
            type: Number,
            default: 0
        },
        // 套餐组件是否可点击
        clickable: {
            type: Boolean,
            default: true
        },
        // 商品id
        goodsId: {
            type: String,
            default: ''
        },
        // 商品类型
        resourceType: Number
    },
    data() {
        return {
            showList: false
        }
    },
    methods: {
        openEntityList() {
            if (this.clickable) {
                this.showList = true;
                try {
                    window.sensors.track('click_butt', {
                        page_module: 'H5',
                        page_submodule: '实物商品',
                        page_name: '实物商品详情页',
                        page_button: '套餐'
                    });
                } catch (e) {
                    console.log(e);
                }

            }
        },
        hideEntityList() {
            this.showList = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.entity-gift-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.32rem;
}

.entity-gift-desc {
    display: inline-flex;
    align-items: center;
    line-height: .4rem;
}

.icon-icon-pagination-right {
    font-size: 0.32rem;
    color: #bfbfbf;
}

.icon-taocan {
    margin-right: .24rem;
    color: #FF882D;
    font-size: .28rem;
}
</style>