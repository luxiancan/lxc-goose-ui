<template>
  <div class="container">
    <div class="title">couponList</div>
    <div class="content">
      <h2>默认展示:分享弹框</h2>
      <div class="h5_content">
        <ss-share-box @boxClose="showBox=false" v-show="showBox" saveTips="长按保存图片后在微信中发给好友"/>
      </div>
    </div>
  </div>
</template>

<script>
import SsShareBox from '@/components/shareBox'

export default {
  components: {
    SsShareBox
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
