<template>
    <div class="search-history">
        <div class="title-wrapper" v-show="history_arr.length">
            <div class="title t2 c2">搜索历史</div>
            <!-- <div class="text t3 c3">自动保留最近10条搜索历史</div> -->
            <div v-if="history_arr.length" class="clear-btn t3 c6" @click="clearHistoryAll">清空历史记录</div>
        </div>
        <div class="content-wrapper">
            <div v-for="(item,index) in history_arr" :key="index" class="item-wrapper">
                <div @click="clickHistoryItem(item,index)" class="item-text t3 c3">{{item}}</div>
                <img class="item-clear" :src="imgs.closeImg" @click="clearHistory(index)"/>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from '@/lib/eventbus.js';
    import closeImg from '@/assets/images/search/icon_close.png';

    export default {
        name: "search_history",
        data() {
            return {
                app_id: window.APPID,
                history_arr:[],
                imgs:{
                    closeImg
                }
            };
        },
        created() {
            //更新历史数据
            EventBus.$on('update_history_arr',this.updateHistoryArr);
            this.getSearchHistory();
        },
        methods:{
            //更新历史数据,最多十条，最新在前面
            updateHistoryArr(item) {
                let index = this.history_arr.indexOf(item);
                if(index > -1){
                    this.history_arr.splice(index,1);
                    this.history_arr.unshift(item);
                }else{
                    if(this.history_arr.length < 10){
                        this.history_arr.unshift(item);
                    }else{
                        this.history_arr.pop();
                        this.history_arr.unshift(item);
                    }
                }
                this.setSearchHistory();
            },
            //清除某项
            clearHistory(index) {
                this.history_arr.splice(index,1);
                this.setSearchHistory();
            },
            //清除全部
            clearHistoryAll() {
                let that = this;
                if(that.history_arr.length > 0){
                    that.history_arr = [];
                    localStorage.removeItem('search_history');
                }
            },
            //获取缓存历史搜索数据
            getSearchHistory() {
                let search_history = localStorage.getItem('search_history');
                if(search_history) {
                    search_history = JSON.parse(search_history);
                    if(search_history[this.app_id] && search_history[this.app_id].length){
                        this.history_arr = search_history[this.app_id];
                    }
                }
            },
            //设置缓存搜索数据
            setSearchHistory() {
                let search_history = {};
                search_history[this.app_id] = this.history_arr;
                localStorage.setItem('search_history', JSON.stringify(search_history));
            },
            //点击历史搜索项
            clickHistoryItem(item) {
                EventBus.$emit('update_input_word',item);
                EventBus.$emit('handle_search_event',item);
            }
        }
    };
</script>

<style scoped>
    .search-history {
        padding: 0 0.3rem;
    }
    .title-wrapper {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        height: 0.9rem;
    }
    .title {
        display: inline-block;
        margin-right: 0.2rem;
        color: #666666;
    }
    .text {
        flex: 1;
    }
    .clear-btn {
        display: inline-block;
        /* width: 0.6rem; */
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: right;
        margin-left: auto;
        margin-right: 0;
        color: #C8C8C8;
    }
    .content-wrapper {
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: flex-start
    }
    .item-wrapper {
        display: flex;
        align-items: center;
        background:rgba(255,255,255,1);
        border-radius: 0.25rem;
        padding: 0.07rem 0;
        margin: 0.16rem 0.16rem 0.16rem 0;
    }
    .item-text {
        padding-left: 0.2rem;
        padding-right: 0.08rem;
        line-height: 0.36rem;
        max-width: 89%;
        color: #C8C8C8;
    }
    .item-clear {
        /* width: 0.2rem; */
        height: 0.2rem;
        padding-right: 0.18rem;
    }
</style>