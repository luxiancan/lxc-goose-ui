<template>
    <div class="team-buy__item" :class="{none_border_top:noTorderTop}" >
        <div>
            <img class="user-avatar" :src="item.wx_avatar"/>
            <span class="user-name">{{item.name || item.wx_nickname}}</span>
        </div>
        <div class="right">
            <div class="item-info__wrapper">
                <div class="item-join__num t3 c2">{{item.sum}}人团，还差<span>{{remainNum}}</span>人成团</div>
                <div class="item-count__time t3 c3">{{countTime}}</div>
            </div>
            <!-- <span class="team-buy__price t3">¥ {{parseInt(price)/100}}</span> -->
            <div class="go-to__buy t3" @click="is_start && goToDetail()">
                {{item.is_team_user ? '去邀请':'去凑团'}}
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from '@/lib/eventbus.js';
    export default {
        props:['item','noTorderTop','remainNum','price','complete'],
        data: function () {
            return {
                countTime: '',
                is_start:true
            };
        },
        mounted() {
            this.countDownStart();
        },
        methods: {
            /**
             * goToDetail进入详情页
             */
            goToDetail () {
                this.$emit("join-team",this.item)
                // if(!this.complete){
                //     eJump(this.item.url);
                // }else{
                //     EventBus.$emit('vueAlert', {
                //         type: 'toast',
                //         time: 2000,
                //         desc: '您已参与拼团不能同时参与其它拼团',
                //     });
                // }
                this.newDataUpPush('详情页_去拼团弹窗_去拼团');
            },
            /**
             *  countDownStart倒计时
             */
            countDownStart () {
                let that = this;
                let nowTime = Date.parse(new Date()) * 0.001;
                let stopTime = that.item.stop_at;
                let interval = stopTime - nowTime;
                if (interval > 0) {
                    that.countTime = that.timeConvert(interval);
                    that.timeIntervalStart = setInterval(function () {
                        nowTime += 1;
                        interval = stopTime - nowTime;
                        if (interval >= 0) {
                            that.countTime = that.timeConvert(interval);
                            //改变状态
                            if(interval == 0){
                                that.punch_card_detail.is_start = true;
                                that.is_start = false;
                            }
                        }
                        else {
                            clearInterval(that.timeIntervalStart);
                        }
                    }, 1000);
                }else{
                    that.countTime='拼团已结束';
                    that.is_start = false;
                }
            },
            /**
             * timeConvert 倒计时时间显示
             * num timeInterval 时间
             */
            timeConvert (timeInterval) {
                let hours = parseInt(timeInterval / (60 * 60));
                let minutes = parseInt((timeInterval % (60 * 60)) / 60);
                let seconds = parseInt(timeInterval % 60);
                hours = this.addZero(hours);
                minutes = this.addZero(minutes);
                seconds = this.addZero(seconds);
                return `剩余${hours}:${minutes}:${seconds}`;
            },
            addZero: function (num) {
                if (num < 10) {
                    return "0" + num;
                }
                else {
                    return num;
                }
            },
            //颜值正义埋点上报
            newDataUpPush(data) {
                let dataUpArr = {
                    et: 1,
                    actn: data
                };
                try {
                    window._YS_report.push([dataUpArr]);
                } catch (error) {
                    console.log(error)
                }
               
            }
        }
    };
</script>

<style lang="scss">
    .team-buy__item {
        user-select: none;
        font-size: 14px;
        height: 0.64rem;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -moz-box-align: center;
        align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        border-top: solid 0.01rem #e5e5e5;

        .right {
            display: flex;
            align-items: center;
        }
    }
    .none_border_top {
        border-top: none;
    }
    .user-avatar {
        width: 0.64rem!important;
        height: 0.64rem!important;
        border-radius: 50%;
        margin-right: 0.24rem !important;
        vertical-align: middle;
    }
    .user-name {
        height: 0.64rem;
        font-size: 0.29rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 0.64rem;
        vertical-align: middle;
    }
    .item-info__wrapper {
        flex: 1;
        text-align: right;
    }
    .item-join__num {
        font-size: 0.24rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 0.36rem;
    }
    .item-join__num span {
        color: #f66a4b;
    }
    .item-count__time {
        margin-top: 0.06rem !important;
        font-size: 0.2rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 0.32rem;
    }
    .team-buy__price {
        color: #f66a4b;
        margin-right: 0.4rem;
    }
    .go-to__buy {   
        margin-left: 0.16rem !important;
        padding: 0.06rem 0.2rem !important;
        font-size: 0.24rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 0.36rem;
        background: #FF4C51;
        border-radius: 0.24rem;
    }
</style>