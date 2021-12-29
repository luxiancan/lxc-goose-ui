<template>
  <div class="marketing-buttons">
    <!-- 倒计时 -->
    <div class="remind">{{ remind }}</div>
    <a class="btn is-disabled">
      <div class="name">即将开售</div>
    </a>
  </div>
</template>

<script>
export default {
    props: {
        timeLeft: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            timer: null,
            remind: null
        };
    },
    methods: {
        preheatCountDown(countDownTime) {
            if (countDownTime && countDownTime > 0) {
                this.timer = setInterval(() => {
                    countDownTime = window.parseInt(countDownTime);
                    countDownTime--;
                    const days = Math.floor(countDownTime / (60 * 60 * 24));
                    const hours = Math.floor(
                        (countDownTime - days * 60 * 60 * 24) / (60 * 60)
                    );
                    const minutes = Math.floor(
                        (countDownTime - hours * 60 * 60 - days * 60 * 60 * 24) / 60
                    );
                    const seconds = countDownTime - minutes * 60 - hours * 3600 - days * 24 * 3600;
                    this.remind = `距开售 还剩${days}天${hours}时${minutes}分${seconds}秒`;
                    if (countDownTime === 0) {
                        clearInterval(this.timer);
                        window.location.reload();
                        return false;
                    }
                    return false;
                }, 1000);
            }
        }
    },
    created() {
        this.preheatCountDown(this.timeLeft);
    }
};
</script>

<style lang="scss" scoped>
.marketing-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  .btn {
    height: 0.76rem;
    flex: 1;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 0.38rem;
    line-height: 100%;
    background: #09bb07;
    font-family: "PingFangSC-Medium", "PingFang SC";
    font-weight: 500;
    font-size: 0.28rem;
    &.is-disabled {
      background: #c8c8c8;
    }
  }
  .remind {
    position: absolute;
    height: 0.68rem;
    left: 0;
    right: 0;
    z-index: 1;
    bottom: 100%;
    background: #fbf5ec;
    color: #ffb04f;
    font-size: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
