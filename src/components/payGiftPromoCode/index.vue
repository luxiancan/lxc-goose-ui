<!-- 支付有礼-送优惠码组件 -->
<template>
    <div class="pay-gift-promo-code">
        <div class="promo-code-inner">
            <div class="code-content">{{ codeInfo.promo_code }}</div>
            <div class="promo-code-info">
                <span>{{getPromoInfo(codeInfo).title}}</span>
                <span>{{getPromoInfo(codeInfo).desc}}</span>
            </div>
            <div class="promo-code-max" v-if="getPromoInfo(codeInfo).max">{{getPromoInfo(codeInfo).max}}</div>
            <div class="division-box">
                <div class="dashed-line"></div>
            </div>
            <slot name="btn">
                <button class="the-main-btn copy-and-use" type="button" @click="copyAndUseCode"
                    :data-clipboard-text="codeInfo.promo_code">复制并使用</button>
            </slot>
            <div class="code-validity">
                有效期: {{codeInfo.start_at | transformDate}} - {{codeInfo.end_at | transformDate}}
            </div>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import eJump from '@/lib/eJump';

export default {
    name: 'payGiftPromoCode',
    props: {
        // 单个优惠码数据。根据后端接口返回的 /pay_gift/get_receive_detail
        codeInfo: {
            type: Object,
            default: () => ({})
        },
    },
    filters: {
        transformDate (value) {
            let str = (value || '').replace(/-/g, '.'); // '2020.09.09 14:12:36'
            return str.substr(0, str.length - 3); // 去掉秒
        },
    },
    methods: {
        // 具体的优惠信息
        getPromoInfo (detail) {
            if (Object.keys(detail).length === 0) return {};
            let promoType = detail.style; // 优惠类型 0-全额抵扣  1-满减  2-折扣
            let min_charge = detail.min_charge / 100; // 使用门槛, 0 表示无门槛
            let discount = detail.discount / 100; // 优惠内容 减X元 / 折扣,打X折
            let bind_res_type = detail.bind_res_type; // 适用商品  0-全部商品可用  1-指定商品可用
            let discount_limit = detail.discount_limit / 100; // 最多优惠X元, 0表示不限制
            let title = '', max = '';
            let desc = `${bind_res_type === 0 ? '全部' : '部分'}商品可用`;
            switch (promoType) {
                case 0:
                    title = '全额抵扣';
                    break;
                case 1:
                    title = `${min_charge ? `满${min_charge}元` : '无门槛'}减${discount}元`;
                    break;
                case 2:
                    title = `${min_charge ? `满${min_charge}元` : '无门槛'}打${discount}折`;
                    max = discount_limit ? `（最多优惠${discount_limit}元）` : '';
                    break;
            }
            return { title, desc, max };
        },
        // 支付有礼-优惠码，点击 复制并使用
        copyAndUseCode () {
            let vm = this;
            // 设置复制按钮
            let clipboard = new Clipboard('.copy-and-use');
            clipboard.on('success', function(e) {
                e.clearSelection();

                // 跳转到优惠码领取成功页面
                eJump.jump(`/promo_code/center/${vm.codeInfo.batch_id}`);
            });

            clipboard.on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        },
    }
}
</script>

<style scoped lang="scss">
    .pay-gift-promo-code {
        box-sizing: border-box;
        margin-top: .24rem;
        > * {
            box-sizing: border-box;
        }
    }
    
    /* 优惠码 */
    .promo-code-inner {
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        width: 6.86rem;
        min-height: 4.56rem;
        padding-bottom: .42rem;
        border-radius: .2rem;
        background-color: #fff;
        box-shadow: 0 .02rem .12rem 0 rgba(0, 0, 0, 0.06);

        .code-content {
            position: relative;
            margin-top: .38rem;
            height: .66rem;
            line-height: .66rem;
            font-size: .48rem;
            color: #FF8205;
        }

        .promo-code-info {
            display: flex;
            margin-top: .24rem;
            line-height: .44rem;
            font-size: .32rem;
            color: #333;
            span:last-child {
                margin-left: .24rem;
            }
        }
        .promo-code-max {
            margin-top: .04rem;
            line-height: .44rem;
            font-size: .32rem;
            color: #333;
        }

        /* 分割线 */
        .division-box {
            position: relative;
            margin-top: .56rem;
            width: 100%;
            height: .02rem;
            &::before,
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: .36rem;
                height: .36rem;
                border-radius: 50%;
                background-color: #F5F6F9;
                box-shadow: 0 .02rem .12rem 0 rgba(0, 0, 0, 0.06) inset;
            }
            &::before {
                left: -0.18rem;
            }
            &::after {
                right: -0.18rem;
            }
            .dashed-line {
                margin: 0 auto;
                width: 88%;
                height: .02rem;
                border-top: .02rem dashed #D8D8D8;
            }
        }

        .the-main-btn {
            margin-top: .54rem;
            width: 5.74rem;
            line-height: .8rem;
            border-radius: .4rem;
            border: none;
            text-align: center;
            font-size: .28rem;
            font-weight: 500;
            color: #fff;
            background-color: #FF8205;
        }
        .the-main-btn:active,
        .the-main-btn:focus {
            outline: none;
        }

        .code-validity {
            margin-top: .16rem;
            line-height: .34rem;
            font-size: .24rem;
            color: #999;
        }
    }
</style>