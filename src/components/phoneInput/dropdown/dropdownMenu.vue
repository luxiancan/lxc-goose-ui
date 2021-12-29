<template>
  <ul class="ss-dropdown-menu" 
    :class="[isShow && 'ss-dropdown-menu__show']"
    :style="style"
  >
    <slot v-if="$slots.default"></slot>
    <div v-else class="ss-dropdown-menu-empty">
      选项为空
    </div>
  </ul>
</template>

<script>
export default {
  name: 'SsDropdownMenu',
  componentName: 'SsDropdownMenu',
  props: {
    width: [Number, String]
  },
  data() {
    return {
      isShow: false,
      style: {},
      selfHeight: 0,
      bodyHeight: 0
    }
  },
  mounted() {
    this.bodyHeight = document.documentElement.clientHeight
    this.$nextTick(() => {
      this.initMenuPlacement()
      this.updateMenuPlacement()
    })

    this.$on('visible', this.visible)
    this.$on('update', this.updateMenuPlacement)
    window.addEventListener('resize', this.setBodyHeight)
    window.addEventListener('scroll', this.updateMenuPlacement)
  },
  watch: {
    width(val) {
      this.style.minWidth = `${val - 2}px`
    }
  },
  methods: {
    setSelfHeight() {
      this.selfHeight = this.$el.clientHeight
    },
    setBodyHeight() {
      this.bodyHeight = document.documentElement.clientHeight
    },
    initMenuPlacement() {
      const placement = this.$parent.placement
      const parent = this.$parent.$el.getBoundingClientRect()
      if (placement === 'bottomRight') {
        this.style.right = '1px'
      } else if (placement === 'bottomCenter') {
        const selfWidth = this.$el.clientWidth
        this.style.left = `${(parent.width - selfWidth) / 2}px`
      } else {
        this.style.left = '1px'
      }
      this.style.top = `${parent.height}px`
    },
    updateMenuPlacement() {
      this.$nextTick(() => {
        this.setSelfHeight()
        const parent = this.$parent.$el.getBoundingClientRect()
        if (parent.bottom + this.selfHeight > this.bodyHeight - 10) {
          this.style.top = `-${this.selfHeight}px`
          this.style.transformOrigin = '50% 100%'
        } else {
          this.style.top = `${parent.height}px`
          this.style.transformOrigin = '50% 0%'
        }
      })
    },
    visible(isShow) {
      this.isShow = isShow
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setBodyHeight)
    window.removeEventListener('scroll', this.updateMenuPlacement)
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/packages/dropdown-menu.scss';
</style>