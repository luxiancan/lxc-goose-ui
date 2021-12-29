<template>
  <popup
    class="teambuy-step"
    :visible="visible"
    @change="$emit('change', $event)"
    round
    closeable
    :custom-style="{ height: '5.7rem' }"
  >
    <div class="header">
      <img :src="image" />
      <div>
        <div>
          <span class="tag">{{ tag }}</span>
        </div>
        <div class="price">¥{{ price }}
            <span v-if="multiPrice" class="multi-price">起</span>
        </div>
      </div>
    </div>
    <div class="body">
      <category :category="category" :select.sync="select"></category>
      <div class="buy-count" v-if="showBuyCount">
        <span>购买数量</span>
        <span>
          <img
            src="@/assets/images/teamBuy/decrease.png"
            @click.stop="decrease"
          />
          <input
            v-model.number="buyCount"
            class="count"
            min="1"
            type="number"
            pattern="[0-9]*"
          />
          <img src="@/assets/images/teamBuy/add.png" @click.stop="add" />
        </span>
      </div>
    </div>
    <div class="footer">
      <button :disabled="disabled" @click.stop="confirm">
        确定
      </button>
    </div>
  </popup>
</template>

<script>
import Popup from "../popup";
import Category from "./category";
import toast from "@/lib/toast.js";
import { formatPrice } from "@/utils";
import NetWork from '@/lib/network.js';

export default {
  name: "SsTeambuyStep",
  model: {
    prop: "visible",
    event: "change"
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 主图
    image: {
      type: String
    },
    // sku信息
    sku: {
      type: Object
    },
    // 是否显示购买数量，大部分知识商品不需要显示购买数量
    showBuyCount: {
      type: Boolean,
      default: false
    },
    // 是否需要校验库存
    validateStock: {
      type: Boolean,
      default: false
    },
    // 是否需要校验限购数量
    validateLimit: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 选择完毕需要领取的优惠券
    couponPrice:{
      default:null
    }
  },
  components: {
    Popup,
    Category
  },
  data() {
    return {
      select: null,
      buyCount: 1,
      multiPrice:false,
      rules: [
        {
          // 校验sku
          validator: () => !!this.select,
          message: "请选择拼团类型"
        },
        {
          // 校验购买数量
          validator: () => {
            if (/^[1-9]*[1-9][0-9]*$/.test(this.buyCount)) {
              const count = parseInt(this.buyCount);
              return !Number.isNaN(count);
            }
            return false;
          },
          message: "数量必须为正整数"
        },
        {
          // 校验库存
          validator: () => {
            if (this.validateStock) {
              const count = parseInt(this.buyCount);
              return count <= this.stock;
            }
            return true;
          },
          message: "库存不足"
        },
        {
          // 校验限购数量
          validator: () => {
            if (this.validateLimit) {
              return this.buyCount <= this.select.limit_one;
            }
            return true;
          },
          message: "超出限购数量"
        }
      ]
    };
  },
  computed: {
    tag() {
      return "拼团价";
    },
    price() {
      let price;
      let lowPrice;
      let highPrice;
      if (!this.select) {
        if (
          this.sku.lowPrice &&
          this.sku.highPrice &&
          this.sku.lowPrice !== this.sku.highPrice
        ) {
          this.multiPrice = true;
          lowPrice = this.sku.lowPrice;
          highPrice = this.sku.highPrice;
        } else {
          this.multiPrice = false;
          price = this.sku.lowPrice || this.sku.price;
        }
      } else {
        this.multiPrice = false;
        price = this.select.price;
      }
      if (lowPrice && lowPrice !== highPrice) {
        return `${formatPrice(parseInt(lowPrice))}`;
      }
      return formatPrice(parseInt(price));
    },
    stock() {
      // 目前这里用不到库存，所以写死，有用到的时候再修改
      return 50;
    },
    category() {
      const steps = this.sku.steps || [];
      return {
        name: "拼团类型",
        items: steps
      };
    }
  },
  methods: {
    // 领取优惠券
        async getCouponItem() {
            let that = this;
            let url = 'addMyCoupon/v3';
            let params = {
                id:this.couponPrice?this.couponPrice.id:''
            };
            toast('已为您领取优惠券,下单更优惠');
            await NetWork.request(
            url,
            params,res => {
              console.log(2222)
                if (res.code === 0) {
                    
                }else{
                  toast('优惠券领取失败');
                }
            }
        )
        },
    decrease() {
      if (this.buyCount > 1) {
        this.buyCount--;
      }
    },
    add() {
      if (this.buyCount < this.stock) {
        this.buyCount++;
      }
    },
    confirm() {
      new Promise((resolve, reject) => {
        // Array的some、every有兼容问题
        for (let index = 0; index < this.rules.length; index++) {
          const item = this.rules[index];
          if (!item.validator()) {
            resolve(item.message);
            break;
          }
        }
        resolve();
      })
        .then(async message => {
          if (message) {
            toast(message);
          } else {
            if(this.couponPrice){
              try{
                await this.getCouponItem()
                console.log(3333)
              }catch(e){

              }
            }
            this.$emit("confirm", {
              buyCount: this.buyCount,
              ...this.select
            });
          }
        })
        .catch(console.error);
    }
  }
};
</script>

<style lang="scss" scoped>
.teambuy-step {
  font-size: 16px;
  user-select: none;
  .header {
    display: flex;
    padding: 0.32rem;
    border-bottom: solid 0.02rem #f5f5f5;

    img {
      height: 1.8rem;
      width: 1.8rem;
      border-radius: 0.08rem;
      margin-right: 0.32rem;
    }

    .tag {
      padding: 0.04rem 0.12rem;
      color: #ff4c51;
      border-radius: 0.18rem;
      background-color: rgba($color: #ff4c51, $alpha: 0.2);
      font-size: 0.2rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff4c51;
      line-height: 0.28rem;
    }

    .price {
      margin-top: 0.2rem;
      font-size: 0.36rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff4c51;
      line-height: 0.48rem;
      &::first-letter {
        font-size: 0.28rem;
        font-weight: 500;
        color: #ff4c51;
        line-height: 0.4rem;
      }
      .multi-price {
          font-size: 0.28rem;
      }
    }
  }
  .body {
    padding: 0.24rem 0.32rem 0;
    .buy-count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.32rem;

      input {
        outline: none;
        display: inline-block;
        height: 0.48rem;
        line-height: 0.48rem;
        vertical-align: middle;
        width: 0.92rem;
        text-align: center;
        border: none;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      img {
        width: 0.48rem;
        height: 0.48rem;
        vertical-align: middle;
      }
    }
  }

  .footer {
    padding: 0.16rem 0.28rem;
    border-top: solid 0.02rem #f5f5f5;
    button {
      width: 100%;
      height: 0.8rem;
      border-radius: 0.4rem;
      background-color: #ff4c51;
      border-radius: 0.4rem;
      border: none;
      font-size: 0.28rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 0.4rem;
      user-select: none;
      outline: none;
    }
  }

  /deep/.ss-popup__close {
    top: .3rem;
    right: .3rem;
    font-size: .44rem;
  }
}
</style>
