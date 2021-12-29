<template>
  <div class="container">
    <div class="title">accountModal</div>
    <account-modal :showBindPhoneModal="true" :type="4"></account-modal>
  </div>
</template>

<script>
import './testAssets/common.css'
import accountModal from '@/components/accountModal'

export default {
  components: {
      accountModal
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