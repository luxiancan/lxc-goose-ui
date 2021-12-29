<template>
  <div class="container">
    <div class="title">phoneCode</div>
    <phone-code></phone-code>
  </div>
</template>

<script>
import './testAssets/common.css'
import phoneCode from '@/components/phoneCode'

export default {
  components: {
      phoneCode
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
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
</style>