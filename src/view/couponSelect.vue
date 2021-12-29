<template>
  <div class="container">
    <div class="title">couponSelect</div>
    <div class="content">
      <h2>优惠券选择页</h2>
      <h3>##1、这里为批价时调用的优惠券选择页，关闭和确定按原来的方式走的事件触发，监听到才有效</h3>
      <div class="h5_content">
        <ss-coupon-select :choosedCoupon="choosedCoupon" :couponList="couponList" :disableCouponList="disableCouponList"/>
      </div>
     
    </div>
  </div>
</template>

<script>
import SsCouponSelect from '@/components/couponSelect'

export default {
  components: {
    SsCouponSelect
  },
  data() {
    return {
        choosedCoupon:{
               bind_res_count:0,
                cu_id:"cu_5d88cc0c5559c_6JTUHnw0",
                discount_limit_price:0,
                discount_percent:0,
                discount_way:1,
                has_detail:1,
                id:"cou_5d88830fba2ed-c8MGff",
                invalid_at:"2019-09-26 00:00:00",
                invalid_text:"",
                price:5000,
                receive_at:"2019-09-23 21:43:40",
                require_price:0,
                title:"jerry测试2",
                type:1,
                valid_at:"2019-09-24 00:00:00",
                valid_type:"valid"
        },
        couponList:[
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
          }
        ],
        disableCouponList:[
           {
               bind_res_count:0,
                cu_id:"cu_5d88cc0c5559c_6JTUHnw0",
                discount_limit_price:0,
                discount_percent:0,
                discount_way:1,
                has_detail:1,
                id:"cou_5d88830fba2ed-c8MGff",
                invalid_at:"2019-09-26 00:00:00",
                invalid_text:"仅可原价购买时使用，无法在如秒杀、拼团、限时折扣等特价活动中使用",
                price:5000,
                receive_at:"2019-09-23 21:43:40",
                require_price:0,
                title:"jerry测试2",
                type:1,
                valid_at:"2019-09-24 00:00:00",
                valid_type:"invalid"
           },
           {
               bind_res_count:0,
               cu_id:"cu_5d8a1f60e40a7_kBo5jO7G",
               discount_limit_price:0,
               discount_percent:0,
               discount_way:1,
               has_detail:1,
               id:"cou_5d88830fba2ed-c8MGff",
               invalid_at:"2019-09-26 00:00:00",
               invalid_text:"仅可原价购买时使用，无法在如秒杀、拼团、限时折扣等特价活动中使用",
               price:5000,
               receive_at:"2019-09-24 21:51:28",
               require_price:0,
               title:"jerry测试2",
               type:1,
               valid_at:"2019-09-24 00:00:00",
               valid_type:"invalid"
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
h3{
    margin: 15px 0;
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
  background: #FAFAFD;
  width: 375px;
  padding: 15px;
}

code {
  white-space: pre;
}
</style>
