<template>
  <div class="container">
    <div class="title">invoiceSelect</div>
    <div class="content">
      <h2 @click="showInvoice = true">发票弹窗</h2>
      <span
        >##因为目前微信初始化后端未添加发票api，需要业务方初始化的时候传入发票api，所以当时把获取微信发票抬头方法放在了业务方进行数据通讯，后续可以优化，完全把获取微信发票黑盒</span
      >
      <div class="h5_content">
        <ss-invoice-select
          v-show="showInvoice"
          :wechatInvoice="wechatInvoice"
          :invoiceTypeData="invoiceTypeData"
          @closeInvoice="showInvoice = false"
          @getWechatInvoice="getWechatInvoice"
          @invoiceData="getInvoiceData"
        ></ss-invoice-select>
      </div>
    </div>
  </div>
</template>

<script>
import SsInvoiceSelect from "@/components/invoiceSelect";
export default {
  components: {
    SsInvoiceSelect
  },
  data() {
    return {
      showInvoice: false,
      //微信发票信息
      wechatInvoice: "",
      //发票类型
      //因为支持店铺设置是否开启发票，支持什么类型发票，需要从业务方传入店铺发票数据
      invoiceTypeData: ["GOODS_DETAIL", "GOODS_CATEGORY"]
    };
  },
  methods: {
    //组件传到业务方的发票信息
    getInvoiceData(val) {
      console.log("发票信息", val);
    },
    //业务侧调用微信api获取发票抬头
    getWechatInvoice() {
      let that = this;
      window.wx.invoke("chooseInvoiceTitle", { scene: "1" }, function(res) {
        let { title, taxNumber } = JSON.parse(res.choose_invoice_title_info);
        console.log("发票抬头与税号", title, taxNumber);
        that.wechatInvoice = {
          invoice_title: title,
          tax_number: taxNumber
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  margin: 15px 0;
  font-size: 16px;
}
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

.h5_content {
  margin: 20px 0;
  background: #fafafd;
  width: 375px;
  padding: 15px;
}
</style>
