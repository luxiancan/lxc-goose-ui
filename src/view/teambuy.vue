<template>
  <div>
    <h4>预热模式(传start-time)</h4>
    <teambuy
      price="99.8"
      label="人多更优惠"
      line-price="112.4"
      start-time="2020-10-18"
      multiplePrice
    ></teambuy>
    <h4>非预热模式(只传end-time)</h4>
    <teambuy
      price="99.8"
      line-price="112.4"
      end-time="2020-10-18"
      label="三人拼团"
    ></teambuy>
  </div>
</template>
p
<script>
import Teambuy from "@/components/teambuy";
export default {
  components: {
    Teambuy
  }
};
</script>

<style lang="scss" scoped>
h4 {
  margin-left: 10px;
}
</style>
