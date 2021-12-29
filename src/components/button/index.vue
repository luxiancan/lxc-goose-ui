<template>
  <button class="ss-button"
    @click="handelClick"
    :disabled="disabled || loading"
    :type="nativeType"
    :class="[
      type && `ss-button__${type}`,
      size && `ss-button__${size}`,
      disabled && `ss-button__${disabled}`,
      loading && `ss-button__${loading}`,
      plain && `ss-button__${plain}`,
      round && `ss-button__${round}`,
      circle && `ss-button__${circle}`
    ]"
  >
    <i class="icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'SsButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    disabled: Boolean,
    loading: Boolean,
    plain: Boolean,
    round: Boolean,
    circle: Boolean
  },
  data() {
    return {}
  },
  methods: {
    handelClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '@/assets/scss/packages/button.scss';
</style>
