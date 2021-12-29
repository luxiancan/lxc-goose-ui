<template>
  <!-- <div v-show="showMask"> -->
  <div>
    <div
      class="mask"
      :class="{ 'z-2': showNotice }"
      @click="showNotice = false"
    ></div>
    <!-- 发票须知弹窗 -->
    <div class="notice-wrapper" v-if="showNotice">
      <div class="notice-container">
        <div class="close-notice" @click="showNotice = false">
          <i class="iconfont icon-danchuang-guanbi"></i>
        </div>
        <div class="notice-title">发票须知</div>
        <div class="notice-content">
          1、电子发票是税局认可的有效收付款凭证，其法律效力、基本用途及使用规定同纸质发票，支持报销入账，如需纸质发票可自行下载打印
        </div>
        <div class="notice-content">
          2、如申请发票时填写发票抬头错误，请联系商家将发票冲红后在重新开票
        </div>
        <div class="close-btn theme-customize-bg" @click="showNotice = false">
          知道了
        </div>
      </div>
    </div>
    <div class="invoice-container">
      <div class="invoice">
        <!-- 弹窗标题 -->
        <div class="top-title">
          发票
          <div class="close-wrapper" @click="closeMask">
            <i class="iconfont icon-danchuang-guanbi"></i>
          </div>
        </div>

        <div class="content-wrapper">
          <!-- 微信抬头 -->
          <div v-if="isWeChatEnv" class="use-wechat" @click="useWechat">
            使用微信抬头
            <i class="iconfont icon-tiaozhuan"></i>
          </div>
          <!-- 类型提示文案 -->
          <div class="top-text">
            <div class="type-title">发票类型</div>
            <div class="notice" @click="showNotice = true">
              查看发票须知
              <i class="iconfont icon-icon-tishi"></i>
            </div>
          </div>
          <div class="notice-bottom">
            此处为申请增值税普通发票（电子发票或者纸质发票），如需专用发票联系商家。
          </div>
          <!-- 发票类型选项 -->
          <div class="type">
            <div
              @click="chooseType(item.id, index)"
              v-for="(item, index) in invoiceType"
              :key="item.id"
              class="choice-pad"
              :class="
                params.invoice_type === item.id
                  ? 'chosen theme-customize-border theme-customize-light-new'
                  : 'nochosen'
              "
            >
              {{ item.title }}
            </div>
          </div>
          <!-- 抬头输入区 -->
          <div class="small-title">发票抬头</div>
          <input
            type="text"
            class="input"
            :placeholder="`请输入${invoiceType[invoice_idx].title}名称`"
            v-model="params.invoice_title"
            @blur.prevent="changeBlur"
          />
          <div class="small-title" v-if="params.invoice_type == 1">
            企业税号
          </div>
          <input
            type="text"
            v-if="params.invoice_type == 1"
            class="input"
            placeholder="请输入企业税号"
            v-model="params.tax_number"
            @blur.prevent="changeBlur"
          />
          <div v-if="invoiceTypeData.length > 0">
            <div class="content-title type-title">发票内容</div>
            <div class="content-bottom">
              发票内容将显示{{
                params.content_type === 1 ? "商品相关类别" : "详细商品"
              }}名称
            </div>
            <!-- 发票内容选项 -->
            <div class="type">
              <div
                @click="chooseContent(item.id)"
                v-for="item in typeArray"
                :key="item.id"
                class="choice-pad"
                :class="
                  params.content_type === item.id
                    ? 'chosen theme-customize-border theme-customize-light-new'
                    : 'nochosen'
                "
              >
                商品{{ item.title }}
              </div>
            </div>
          </div>
          <div class="content-title2 type-title">收票邮箱</div>
          <input
            type="text"
            class="input"
            placeholder="用于向你发送电子发票"
            v-model="params.email"
            @blur.prevent="changeBlur"
          />
        </div>
        <!-- 底部操作按钮 -->
        <div class="finish-btn" v-fixIPhoneX="{ paddingBottom: '0.68rem' }">
          <div
            class="finish theme-customize-bg theme-customize-font-black"
            @click="submitInvoice"
          >
            完成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import toast from "@/lib/toast.js";

export default {
  // props: ["wechatInvoice", "invoiceTypeData"],
  props: {
    wechatInvoice: {
      default: ""
    },
    invoiceTypeData: {
      type: Array | String,
      default: []
    }
  },
  watch: {
    wechatInvoice: {
      handler(val) {
        const { invoice_title, tax_number } = this.wechatInvoice;
        this.params.invoice_title = invoice_title;
        if (tax_number == "") {
          this.chooseType(2, 1);
        } else {
          this.params.tax_number = tax_number;
        }
      },
      deep: true
    },
    invoiceTypeData: {
      handler(val) {
        if (val.length == 1) {
          this.params.content_type = this.typeArray[0].id;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      // 发票类型与内容、相对应的值
      invoiceType: [
        { id: 1, title: "企业" },
        { id: 2, title: "个人" }
      ],
      // invoice_type:["GOODS_DETAIL","GOODS_CATEGORY"]
      // invoiceContent: [
      //   { id: 1, title: "类别" },
      //   { id: 2, title: "明细" }
      // ],
      params: {
        invoice_type: 1,
        content_type: 1,
        // 抬头、税号、邮箱
        invoice_title: "",
        tax_number: "",
        email: ""
      },
      invoice_idx: 0,
      // 须知弹窗
      showNotice: false
    };
  },
  computed: {
    dataArray() {
      const arr = [];
      for (const item in this.params) {
        arr.push({
          key: item,
          value: this.params[item]
        });
      }
      return arr;
    },
    // 发票内容的数组
    typeArray() {
      const detail = this.invoiceTypeData.includes("GOODS_DETAIL");
      const cate = this.invoiceTypeData.includes("GOODS_CATEGORY");
      if (detail && !cate) {
        return [{ id: 2, title: "明细" }];
      } else if (!detail && cate) {
        return [{ id: 1, title: "类别" }];
      } else if (detail && cate) {
        return [
          { id: 1, title: "类别" },
          { id: 2, title: "明细" }
        ];
      } else {
        return [];
      }
    },
    isWeChatEnv() {
      return window.wx && window.wx.CLIENT_ENV === "wechat";
    }
  },
  methods: {
    changeBlur() {
      setTimeout(() => {
        const scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 200);
    },
    // 两个类型选择事件
    chooseType(id, idx) {
      this.params.invoice_type = id;
      this.invoice_idx = idx;
      // 选择个人时重置企业税号，以防带进请求参数
      if (id == 2) {
        this.params.tax_number = "";
      }
    },
    chooseContent(id) {
      this.params.content_type = id;
    },
    // 因为目前后端未添加发票api，需要业务方初始化的时候传入发票api，
    // 所以当时把获取微信发票抬头方法放在了业务方进行数据通讯，后续可以优化
    // 通知父组件调用微信api
    useWechat() {
      this.$emit("getWechatInvoice");
    },
    // 父组件控制发票弹窗关闭
    closeMask() {
      const flag = this.checkValue(this.dataArray);
      if (flag !== true) {
        this.$emit("invoiceData", "");
      }
      this.$emit("closeInvoice");
    },
    // 提交发票
    submitInvoice() {
      const flag = this.checkValue(this.dataArray);
      // flag可能为其他内容，必须判断boolean值
      if (flag !== true) {
        toast(flag);
      } else {
        this.$emit("invoiceData", this.params);
        this.$emit("closeInvoice");
      }
    },
    // 所有输入框校验
    checkValue(val) {
      let flag = true;
      for (const item of val) {
        switch (item.key) {
          case "invoice_title":
            if (item.value || item.value.length > 0) {
              continue;
            } else {
              flag = "请填写发票抬头";
              return flag;
            }
          case "tax_number":
            if (this.params.invoice_type == 2) {
              continue;
            } else if (item.value || item.value.length > 0) {
              continue;
            } else {
              flag = "请填写企业税号";
              return flag;
            }
          case "email":
            if (item.value || item.value.length > 0) {
              if (
                /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
                  item.value
                )
              ) {
                continue;
              } else {
                flag = "请填写正确的邮箱";
                return flag;
              }
            } else {
              flag = "请填写收票邮箱";
              return flag;
            }
          default:
            break;
        }
      }
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.invoice-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  height: 85%;
  width: 100%;
  z-index: 1;
  border-radius: 0.32rem 0.32rem 0rem 0rem;
  max-width: 480px;
  margin: 0 auto;
  .invoice {
    position: relative;
    height: 100%;
    .top-title {
      font-weight: 500;
      color: #333;
      font-size: 0.38rem;
      height: 1.16rem;
      text-align: center;
      line-height: 1.16rem;
      position: relative;
      .close-wrapper {
        position: absolute;
        top: 0;
        height: fit-content;
        right: 0;
        padding: 0 0.32rem;
        i {
          font-size: 0.24rem;
          color: #bfbfbf;
        }
      }
    }
    .content-wrapper {
      height: 100%;
      padding: 0 0.32rem 2.6rem 0.32rem;
      box-sizing: border-box;
      overflow: scroll;
      .use-wechat {
        width: fit-content;
        color: #09bb07;
        font-size: 0.28rem;
        display: flex;
        align-items: center;
        i {
          font-size: 0.4rem;
        }
      }
      .top-text {
        margin: 0.32rem 0 0.16rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .notice {
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 0.24rem;
          color: #999;
          i {
            margin-left: 0.08rem;
            font-size: 0.34rem;
            color: #b2b2b2;
          }
        }
      }
      .notice-bottom {
        font-size: 0.24rem;
        color: #999;
      }
      .type {
        margin: 0.24rem 0 0.32rem 0;
        display: flex;
        align-items: center;
      }
      .content-title {
        margin: 0.4rem 0 0.16rem 0;
      }
      .content-bottom {
        font-size: 0.24rem;
        color: #999;
      }
      .content-title2 {
        margin: 0.32rem 0 0.08rem 0;
      }
    }
    .finish-btn {
      background: #fff;
      position: absolute;
      bottom: 0;
      padding: 0.16rem 0.28rem;
      box-sizing: border-box;
      border-top: 0.02rem solid #eee;
      width: 100%;
      .finish {
        padding: 0.2rem 0;
        border-radius: 0.4rem;
        text-align: center;
        background: #105cfb;
        font-weight: 500;
        font-size: 0.28rem;
        color: #fff;
      }
    }
  }
  .choice-pad {
    padding: 0.12rem 0.16rem;
    box-sizing: border-box;
    border-radius: 0.08rem;
    font-size: 0.24rem;
  }
  .choice-pad:first-child {
    margin-right: 0.24rem;
  }
  .chosen {
    color: #333;
    background: rgba(221, 231, 251, 1);
    border: 0.02rem solid rgba(16, 92, 251, 1);
  }
  .nochosen {
    color: #333333;
    background: rgba(245, 245, 245, 1);
    border: 0.02rem solid rgba(245, 245, 245, 1);
  }
  .input::placeholder {
    color: #b2b2b2;
  }
  .input:focus {
    outline: none;
  }
  .input {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    -webkit-appearance: none;
    font-size: 0.28rem;
    margin: 0.16rem 0 0.24rem 0;
    width: 100%;
    padding: 0 0.24rem;
    height: 0.88rem;
    border-radius: 0.04rem;
    border: 0.02rem solid rgba(219, 219, 219, 1);
  }
}
.type-title {
  font-weight: 500;
  font-size: 0.28rem;
  color: #333;
}
.small-title {
  font-size: 0.28rem;
  color: #333;
}
.notice-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 5.9rem;
  background: rgba(255, 255, 255, 1);
  border-radius: 0.16rem;
  z-index: 3;
  .notice-container {
    padding: 0.64rem 0.48rem;
    box-sizing: border-box;
    position: relative;
    .close-notice {
      line-height: 1.04rem;
      text-align: center;
      position: absolute;
      width: 1.04rem;
      height: 1.04rem;
      top: 0;
      right: 0;
      i {
        font-size: 0.24rem;
        color: #bfbfbf;
      }
    }
    .notice-title {
      text-align: center;
      font-weight: 500;
      margin-bottom: 0.56rem;
      font-size: 0.36rem;
      color: #333;
    }
    .notice-content {
      letter-spacing: 0.02rem;
      line-height: 0.56rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #333;
    }
    .close-btn {
      margin-top: 0.56rem;
      background: rgba(16, 92, 251, 1);
      font-size: 0.28rem;
      color: #fff;
      border-radius: 0.4rem;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      font-weight: 500;
      text-align: center;
    }
  }
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.5);
}
.z-2 {
  z-index: 2;
}
</style>
