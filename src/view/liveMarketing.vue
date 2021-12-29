<template>
  <div>
    <!-- <h4>预热模式(传start-time)</h4>
    <teambuy
      price="99.8"
      label="人多更优惠"
      line-price="112.4"
      start-time="2020-10-18"
      multiplePrice
    ></teambuy> -->
    <h4>非预热模式(只传end-time)</h4>
    <live-marketing
      price="99.8"
      line-price="112.4"
      end-time="2020-10-18"
      label="三人拼团"
    ></live-marketing>
  </div>
</template>
<script>
import LiveMarketing from "@/components/liveMarketing";
export default {
  components: {
    LiveMarketing
  }
};
</script>

<style lang="scss" scoped>
h4 {
  margin-left: 10px;
}
</style>
