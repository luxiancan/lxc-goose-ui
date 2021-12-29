<template>
  <div class="container">
    <div class="title">button</div>
    <div class="content">
      <ss-button>demo</ss-button>
      <ss-button type="success">demo</ss-button>
      <ss-button type="error">demo</ss-button>
    </div>
  </div>
</template>

<script>
import SSButton from '@/components/button'

export default {
  components: {
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
