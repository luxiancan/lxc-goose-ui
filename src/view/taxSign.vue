<template>
  <div>
    <tax-sign :signScene="1"></tax-sign>
  </div>
</template>
<script>
import taxSign from "@/components/taxSign";
export default {
  components: {
    taxSign
  }
};
</script>

<style lang="scss" scoped>
h4 {
  margin-left: 10px;
}
</style>