<template>
  <div class="container">
    <div class="title">couponList</div>
    <div class="content">
      <h2>默认展示:分享弹框</h2>
      <div class="h5_content">
        <ss-receive-address :visible="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import SsReceiveAddress from '@/components/receiveAddress'

export default {
  components: {
    SsReceiveAddress
  },
  data() {
    return {
        showBox:true
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
