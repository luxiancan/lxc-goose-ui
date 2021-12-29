<template>
  <div class="container">
    <div class="title">couponItem</div>
    <div class="content">
      <h2>这里抽出来公共部分：单张优惠券左边部分</h2>
      <h3>##1、无门槛减价优惠券</h3>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_noRule" />
      </div>
      <h3>##2、满减优惠券</h3>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_rule" />
      </div>
      <h3>##3、折扣优惠券</h3>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_discount" />
      </div>
      <h3>##4、未选中时，不高亮</h3>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_discount"  :lightState="false"/>
      </div>
      <h3>##5、不可用的样式</h3>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_disabled"  :disabled="true"/>
      </div>
      <h3>##6、自定义优惠券左边金额背景和整个背景，详细信息背景色</h3>
      <p>
        couponValueBg:左边金额背景颜色;<br/>
        couponBgcolor:单张金额背景色<br/>
        detailInfoBg:详细信息背景色<br/>

      </p>
      <div class="h5_content">
        <ss-coupon-item :item="couponItem_disabled"  :couponValueBg="'#CDCDCD'" :couponBgcolor="'#EEEEEE'" :detailInfoBg="'#fff'"/>
      </div>
    </div>
  </div>
</template>

<script>
import SsCouponItem from '@/components/couponItem'

export default {
  components: {
    SsCouponItem
  },
  data() {
    return {
        couponItem_noRule:{
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:123090,
            receive_rule:1,
            require_price:0,
            discount_way:1,
            title:"Stephen",
            has_detail:0,
            discount_percent:0,
            discount_limit_price:1000,
            type:1,
            valid_day:3,
            valid_at:"2019-08-16 12:00:00"
          },
        couponItem_rule:{
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:3000,
            receive_rule:1,
            require_price:1000,
            discount_way:1,
            discount_percent:0,
            has_detail:1,
            discount_limit_price:1000,
            title:"测试",
            valid_day:7,
            type:1,
            valid_at:"2019-08-16 12:00:00"
         },
        couponItem_discount:{
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:1000,
            receive_rule:1,
            require_price:1025,
            discount_way:2,
            discount_percent:90,
            valid_day:0,
            title:"折扣券",
            has_detail:1,
            discount_limit_price:3333,
            type:1,
            valid_at:"2019-09-16 12:00:00"
        },
        couponItem_disabled:{
            bind_res_count:0,
            current_user_received_count:0,
            id:"cou_5d56749dc4dee-9WoGoK",
            invalid_at:"2019-09-30 12:00:00",
            price:1000,
            receive_rule:1,
            require_price:1025,
            discount_way:2,
            discount_percent:76,
            valid_day:0,
            title:"折扣券",
            has_detail:1,
            discount_limit_price:3333,
            type:1,
            valid_at:"2019-09-16 12:00:00",
            invalid_text:'未到使用时间'
        }
      
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
