<template>
  <li class="ss-dropdown-item" 
    :class="[disabled && 'ss-dropdown-item__disabled']"
    @click.stop="handleClick">
    <slot></slot>
  </li>
</template>

<script>
import Emitter from '../emitter'

export default {
  name: 'SsDropdownItem',
  componentName: 'SsDropdownItem',
  mixins: [Emitter],
  props: {
    disabled: Boolean
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
        this.dispatch('SsDropdown', 'itemClick')
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/packages/dropdown-item.scss';
</style>