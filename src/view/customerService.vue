<template>
  <div class="container">
    <div class="title">customerService</div>
    <div class="content">
      <h2 @click="showService=true">默认展示:客服弹窗</h2>
      <div class="h5_content">
        <ss-customer-service :customerItem="testData" :visible.sync="showService"/>
      </div>
    </div>
  </div>
</template>

<script>
import SsCustomerService from '@/components/customerService'

export default {
  components: {
    SsCustomerService
  },
  data() {
    return {
        showBox:true,
        showService: false,
        testData: {
            contact_type: ["PHONE", "WECHAT"],
            enable: 1,
            entry_type: ["GOODS_DETAIL_PAGE", "ORDER_DETAIL_PAGE"],
            guide_jump_url: "//www.baidu.com",
            guide_type: 0,
            phone: "12312312323",
            tips: "如有疑问请联系客服↵ss↵函数式↵",
            wechat_img_url: "http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/k8fatrcy0dlpi96hheg.gif",
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

.title {
  padding: 20px;
  line-height: 50px;
  font-size: 32px;
  font-weight: 600;
  color: #353535;
}

.content {
//   padding: 0 20px;
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
