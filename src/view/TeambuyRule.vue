<template>
  <div class="container">
    <h4>普通拼团</h4>
    <teambuy-rule
      overview="支付开团邀请1人参团，人数不足自动退款。"
    ></teambuy-rule>
    <h4>阶梯拼团</h4>
    <teambuy-rule
      type="step"
      overview="支付开团邀请1人参团，人数不足自动退款。"
    ></teambuy-rule>
  </div>
</template>

<script>
import TeambuyRule from "@/components/teambuyRule";
export default {
  components: {
    TeambuyRule
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  h4 {
    margin-left: 10px;
  }
}
</style>
