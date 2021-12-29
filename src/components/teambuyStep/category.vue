<template>
  <div class="category">
    <div class="name">{{ category.name }}</div>
    <div class="item-wrapper">
      <span
        v-for="(item, index) of category.items"
        :key="index"
        class="item"
        :class="[
          item.disabled ? 'is-disabled' : '',
          selected && selected.value === item.value
            ? 'is-selected theme-customize-border theme-customize-bg-light'
            : ''
        ]"
        @click.stop="handleClick(item)"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    category: {
      type: Object,
      default: () => ({}),
      required: true
    },
    select: {
      type: Object
    }
  },
  data() {
    return {
      selected: {}
    };
  },
  methods: {
    handleClick(item) {
      if (item.disabled) {
        return;
      }
      if (this.selected === item) {
        this.selected = null;
      } else {
        this.selected = item;
      }
      this.$emit("update:select", this.selected);
    }
  }
};
</script>

<style lang="scss" scoped>
$--color-red: #ff4c51;

.category {
  font-size: 16px;
  padding-bottom: 0.64rem;
  .name {
    font-size: 0.29rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 0.4rem;
  }
  .item-wrapper {
    .item {
      padding: 0.1rem 0.16rem;
      margin-right: 0.24rem;
      min-width: 0.48rem;
      vertical-align: middle;
      margin-top: 0.24rem;
      display: inline-block;
      text-align: center;
      font-size: 0.24rem;
      border-radius: 0.08rem;
      border-color: transparent;
      background-color: #f5f5f5;

      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 0.36rem;

      img {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 0.04rem;
        border: 0.01rem solid rgba(229, 229, 229, 1);
        object-fit: cover;
        vertical-align: middle;
        margin-right: 0.08rem;
      }

      border-width: 1px;
      border-style: solid;

      &.is-selected {
        border-color: $--color-red !important;
        background-color: rgba($color: $--color-red, $alpha: 0.2) !important;
      }

      &.is-disabled {
        opacity: 0.3;
      }
    }
  }
}

@media (-webkit-min-device-pixel-ratio: 2) {
  .item-wrapper {
    .item {
      border-width: 0.5px;
    }
  }
}
</style>
