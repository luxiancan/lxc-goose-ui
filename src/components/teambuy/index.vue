<template>
  <div class="teambuy" :class="[isPreheat ? 'preheat' : '']">
    <div class="teambuy__left">
      <div class="teambuy__price">
        <span class="teambuy__price__icon">¥</span>{{ price | formatPrice
        }}<span v-if="multiplePrice" class="multiple-price">起</span>
      </div>
      <div class="teambuy__label">
        <div class="label-wrapper">
          <span class="label">{{ label }}</span>
        </div>
        <div class="lineprice">¥{{ linePrice | formatPrice }}</div>
      </div>
    </div>
    <div v-if="time" class="teambuy__right">
      <div class="teambuy__countdownlabel">{{ countdownLabel }}</div>
      <div class="teambuy__countdown">
        <span class="dd">{{ time.dd }}天</span>
        <span class="hh">{{ time.hh }}</span>
        <font>:</font>
        <span class="mm">{{ time.mm }}</span>
        <font>:</font>
        <span class="ss">{{ time.ss }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { countdown, formatPrice, isBefore } from '@/utils';

export default {
    name: 'SsTeambuy',
    props: {
    // 是否有多个价格
        multiplePrice: {
            type: Boolean,
            default: false
        },
        price: {
            type: [String, Number]
        },
        linePrice: {
            type: [String, Number]
        },
        label: {
            type: String
        },
        startTime: {
            type: [String, Number]
        },
        endTime: {
            type: [String, Number]
        }
    },
    filters: {
        formatPrice
    },
    data() {
        return {
            time: null,
            handle: null
        };
    },
    computed: {
        isPreheat() {
            return this.startTime && isBefore(new Date(), this.startTime);
        },
        countdownLabel() {
            return this.isPreheat ? '距开始还有' : '距结束仅剩';
        }
    },
    mounted() {
        const endTime = this.isPreheat ? this.startTime : this.endTime;
        endTime &&
      countdown(endTime, (handle, time, isEnd) => {
          this.time = time;
          this.handle = isEnd ? null : handle;
          if (isEnd) {
              clearInterval(handle);
              this.$emit('countdown-end');
          }
      });
    },
    beforeDestroy() {
        clearInterval(this.handle);
    }
};
</script>

<style lang="scss" scoped>
$height: 1.12rem;
.teambuy {
  box-sizing: border-box;
  height: $height;
  display: flex;
  justify-content: space-between;
  justify-items: center;
  padding: 0.14rem 0.32rem;
  color: #ffffff;
  user-select: none;

  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/teamBuy/activity_normal.png");

  &__left {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .teambuy__label {
      margin-left: 0.16rem;
      padding-top: 0.06rem;
      .label-wrapper {
        display: flex;
        align-items: center;
        height: .32rem;
        margin-bottom: 0.08rem;
        border-radius: 0.22rem;
        background-color: #ffffff;
        .label {
          padding: 0 0.16rem;
          font-size: 0.2rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff4c51;
        }
      }

      .lineprice {
        font-size: 0.28rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 0.4rem;
        text-decoration: line-through;
        opacity: 0.6;
      }
    }

    .teambuy__price {
      font-size: 0.48rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      height: 0.6rem;
      line-height: 0.6rem;
      .teambuy__price__icon,
      .multiple-price {
        font-size: 0.24rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 0.36rem;
      }
      .teambuy__price__icon {
        margin-right: 0.08rem;
      }
      .multiple-price {
        margin-left: 0.08rem;
      }
    }
  }

  &__right {
    font-weight: bold;
    font-size: 0.24rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .teambuy__countdownlabel {
      text-align: right;
      margin-bottom: 0.08rem;
      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #ffffff;
      line-height: 0.36rem;
    }
    .teambuy__countdown {
      display: flex;
      align-items: center;
      height: .4rem;
      font {
        width: .2rem;
        text-align: center;
      }
    }
  }

  &.preheat {
    background-image: url("~@/assets/images/teamBuy/activity_preheat.png");
    .label {
      color: #0fb853 !important;
    }

    .hh,
    .mm,
    .ss {
      color: #0fb853;
    }
  }

  @mixin time-def {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
  }

  .dd {
    @include time-def;
    color: #ffffff;
    margin-right: 0.08rem;
  }

  .hh,
  .mm,
  .ss {
    @include time-def;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 0.04rem;
    color: #ff4c51;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
  }
}
</style>
