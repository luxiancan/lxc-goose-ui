<template>
  <div class="container">
    <div class="title">couponList</div>
    <div class="content">
      <h2>默认展示:默认h5详情页优惠券列表</h2>
      <div class="h5_content">
        <ss-coupon-list :showCoupons="showCoupons" :coupon_lists="coupon_list"/>
      </div>
    </div>
  </div>
</template>

<script>
import SsCouponList from '@/components/couponList'

export default {
  components: {
    SsCouponList
  },
  data() {
    return {
        showCoupons:true,
        coupon_list:[
            {
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:12365090,
            receive_rule:1,
            require_price:1000000000,
            discount_way:1,
            title:"Stephen",
            has_detail:0,
            discount_percent:0,
            discount_limit_price:1000,
            type:1,
            valid_day:3,
            valid_at:"2019-08-16 12:00:00"
          },{
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:10000000,
            receive_rule:1,
            require_price:1000000000,
            discount_way:1,
            discount_percent:0,
            has_detail:1,
            discount_limit_price:1000,
            title:"测试",
            valid_day:7,
            type:1,
            valid_at:"2019-08-16 12:00:00"
        },
        {
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:1000,
            receive_rule:1,
            require_price:0,
            discount_way:2,
            discount_percent:90,
            valid_day:0,
            title:"折扣券",
            has_detail:1,
            discount_limit_price:3333,
            type:1,
            valid_at:"2019-09-16 12:00:00"
        },
        {
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:1000,
            receive_rule:1,
            require_price:1025,
            discount_way:2,
            discount_percent:75,
            valid_day:0,
            title:"测试折扣券",
            has_detail:1,
            discount_limit_price:333,
            type:1,
            valid_at:"2019-09-16 12:00:00"
        }
      ],
      diabled_list:[
        {
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:4000,
            receive_rule:1,
            require_price:1000,
            discount_way:1,
            discount_percent:0,
            has_detail:1,
            discount_limit_price:1000,
            title:"不可用测试",
            valid_day:7,
            type:1,
            valid_at:"2019-08-16 12:00:00"
        },
        {
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:15000,
            receive_rule:1,
            require_price:1025,
            discount_way:2,
            discount_percent:85,
            valid_day:0,
            title:"不可用测试折扣券",
            has_detail:1,
            discount_limit_price:33873,
            type:1,
            valid_at:"2019-09-16 12:00:00"
        }
      ]
    }
  },
  mounted() {
    
  
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.simulate_h5 {
  font-size: 50px;
}

.title {
  padding: 20px;
  line-height: 50px;
  font-size: 32px;
  font-weight: 600;
  color: #353535;
}

.content {
  padding: 0 20px;
}

.h5_content {
  margin: 20px 0;
  background: #efeff4;
  width: 375px;
}

code {
  white-space: pre;
}
</style>
