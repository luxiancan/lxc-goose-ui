<template>
  <div>
    <ss-button @click="visible = true">open</ss-button>
    <teambuy-step
      v-model="visible"
      :sku="sku"
      image="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2918680148,1358576450&fm=26&gp=0.jpg"
    ></teambuy-step>
  </div>
</template>

<script>
import TeambuyStep from "@/components/teambuyStep";
import SsButton from "@/components/button";
export default {
  components: {
    SsButton,
    TeambuyStep
  },
  data() {
    return {
      visible: true,
      sku: {
        price: "100.00",
        lowPrice: 200,
        highPrice: 400,
        steps: [
          {
            price: "100",
            value: "￥100/2人团"
          },
          {
            price: "99",
            value: "￥99/2人团"
          },
          {
            price: "88",
            value: "￥88/2人团"
          }
        ]
      }
    };
  }
};
</script>
