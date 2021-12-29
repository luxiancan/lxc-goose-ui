<template>
    <div class="cut-price-module">
        <div class="discount-box">
            <img
                class="img-title"
                src="@/assets/images/liveMarketing/event_title_kj.png"
                alt="砍价">
            <div class="discount-info">
                <div class="count_time">
                <small>活动倒计时：</small>
                    <span class="time">{{time_left.days}}</span>天
                    <span class="time">{{time_left.hours}}</span>时
                    <span class="time">{{time_left.minutes}}</span>分
                    <span class="time">{{time_left.seconds}}</span>秒
                </div>
                <div class="summary">
                    <span>
                        {{cutPriceInfo.now_stock > 0 ? `还剩${cutPriceInfo.now_stock}份` : ''}}
                    </span>
                    <span>
                        <span class="original-price">
                            ￥{{(cutPriceInfo.original_price/100).toFixed(2)}}
                        </span>
                        <span class="rate-price">
                            <small>￥</small>{{(cutPriceInfo.price_params/100).toFixed(2)}}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CutPrice',
    props: {
        cutPriceInfo: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            time_left: {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00' 
            }
        }
    },
    computed: {
        
    },
    created() {
        this.timeConvert();
    },
    methods: {
        timeConvert() {
            let discount_time_left = this.cutPriceInfo.time_left;
            const that = this;
            timer = setInterval(() => {
                discount_time_left = parseInt(discount_time_left);
                discount_time_left--;
                const days = Math.floor(discount_time_left / (60 * 60 * 24));
                const hours = Math.floor((discount_time_left - days * 60 * 60 * 24) / (60 * 60));
                const minutes = Math.floor((discount_time_left - hours * 60 * 60 - days * 60 * 60 * 24) / 60);
                const seconds = discount_time_left - minutes * 60 - hours * 3600 - days * 24 * 3600;
                that.time_left = {
                    // days: days / 10 < 1 ? "0" + days : "" + days,
                    days: days < 1 ? '0' : `${days}`,
                    hours: hours / 10 < 1 ? `0${hours}` : `${hours}`,
                    minutes: minutes / 10 < 1 ? `0${minutes}` : `${minutes}`,
                    seconds: seconds / 10 < 1 ? `0${seconds}` : `${seconds}`
                };
                if (discount_time_left == 0) {
                    clearInterval(timer);
                    window.location.reload();
                }
            }, 1000);
        }
    },
    watch: {
        showCutPrice(newVal) {
        // 记得埋点
        }
    },
    beforeDestroy() {
        clearInterval(timer);
    }
};
</script>

<style lang="scss" scoped>
.cut-price-module {
    font-size: 0.24rem;
    background: #fdece9;
    border-radius: 0.12rem;
    background-image: url("~@/assets/images/liveMarketing/bg_texture.png");
    background-position: bottom;
    background-size: contain;
    background-repeat: no-repeat;
    color: #4a4c5b;
}
.discount-box {
    display: flex;
    align-items: center;
    padding: 0.34rem 0.32rem;
}
.custom-label,
.img-title {
    flex-shrink: 0;
    width: 1.08rem;
    height: 1.08rem;
}
.custom-label {
    background-image: url("~@/assets/images/liveMarketing/event_tag_bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 500;
    font-size: 0.26rem;
    &.length-1 {
        font-size: 0.6rem;
        line-height: 100%;
    }
    &.length-2 {
        font-size: 0.36rem;
        line-height: 100%;
    }
    &.length-3 {
        font-size: 0.28rem;
        line-height: 100%;
    }
    &.length-4 {
        font-size: 0.28rem;
        line-height: 120%;
    }
    &.length-5 {
        font-size: 0.24rem;
        line-height: 120%;
    }
}
.discount-info {
    margin-left: 0.18rem;
    width: 100%;
}
.count_time {
    display: flex;
    align-items: center;
    font-size: 0.24rem;
    line-height: 0.34rem;
    small {
        font-size: 0.22rem;
    }
    .time {
        background: #4a4c5b;
        border-radius: 0.04rem;
        color: #fff;
        margin: 0.05rem;
        padding: 0 0.06rem;
        min-width: 0.3rem;
        text-align: center;
    }
}
.team_buy_text {
    line-height: 0.34rem;
    margin-top: 0.24rem;
}

.summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.22rem;
}

.rate-price {
    color: #ff002a;
    font-size: 0.4rem;
    font-weight:500;
    small {
        font-size: 0.24rem;
    }
}

.original-price {
    color: #ff002a;
    font-size: 0.24rem;
    margin-right: 0.06rem;
    text-decoration: line-through;
}
</style>
