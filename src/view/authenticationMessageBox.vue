<template>
  <div class="container">
    <div class="title">authenticationMessageBox</div>
    <authenticationMessageBox></authenticationMessageBox>
  </div>
</template>

<script>
import SSButton from '@/components/button'
import authenticationMessageBox from '@/components/authenticationMessageBox'

export default {
  components: {
    'authenticationMessageBox': authenticationMessageBox,
    'ss-button': SSButton
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