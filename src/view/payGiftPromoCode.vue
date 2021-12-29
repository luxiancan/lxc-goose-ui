<template>
    <div class="container">
        <div class="title">payGiftPromoCode</div>
        <div class="content">
            <h2>支付有礼-送优惠码组件</h2>
            <h3>##1、这里为购买商品成功后，支付有礼显示的送优惠码组件</h3>
            <div class="h5_content">
                <ssPayGiftPromoCode :codeInfo="item"></ssPayGiftPromoCode>
            </div>
        </div>
    </div>
</template>

<script>
import ssPayGiftPromoCode from '@/components/payGiftPromoCode'

export default {
    components: {
        ssPayGiftPromoCode
    },
    data() {
        return {
            item: {
                app_id: "appbasMCwxn8966",
                batch_id: "pc_wxn89660_fc5FtP0qEDmdl53VnVeDfM",
                bind_res_type: 1,
                discount: 20000,
                discount_limit: 0,
                end_at: "2021-09-30 00:00:00",
                min_charge: 100000,
                name: "carson优惠码2-默认分享语",
                promo_code: "0123456789",
                ptype: 0,
                skip_target: "/promo_code/center",
                start_at: "2020-09-12 00:00:00",
                status: 0,
                style: 1,
                use_in_acts: 0,
                user_limit: 5,
            }
        }
    }
}
</script>

<style>

</style>