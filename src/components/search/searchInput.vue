<!--搜索输入框-->

<template>
    <div class="search-input-container">
        <div class="search-input-inner">
            <img class="search-icon" :src="imgs.searchImg" />
            <form class="search-form" action @submit.prevent>
                <input autofocus
                    ref="search-input"
                    class="search-input c2 t2"
                    type="search"
                    :placeholder='place_holder_text? place_holder_text:"输入搜索内容"'
                    @keyup.enter="clickSearch"
                    v-model="input_word"
                />
            </form>
            <!--清除关键词-->
            <img v-show="input_word" @click.stop="clearInput" class="search-cancel-icon"
                :src="imgs.searchDeleteImg" />
            <div @click="clickCancel" class="search-cancel t1">取消</div>
        </div>
    </div>
</template>

<script>
    import EventBus from '@/lib/eventbus.js';
    import { urlParse } from '@xiaoe/js-tools';
    import funcTool from '../../../libEntry/install/func-tool';
    import searchImg from '@/assets/images/search/icon_search.png';
    import searchDeleteImg from '@/assets/images/search/icon_search_delete.png';

    export default {
        name: "search_input",
        props:['place_holder_text'],
        data() {
            return {
                input_word:this.key_word?this.key_word:'',
                imgs:{
                    searchImg,
                    searchDeleteImg
                }
            };
        },
        created() {
            EventBus.$on('update_input_word', (word) =>{
                this.input_word = word;
            });
        },
        mounted(){
            // 手动聚焦
            this.$nextTick(() => {
                this.$refs['search-input'] && this.$refs['search-input'].focus();
            });
        },
        methods:{
            //删除输入文本
            clearInput() {
                sessionStorage.removeItem("search_save_key_word");
                EventBus.$emit('click_cancel_reset');
                this.reset();
                this.input_word = '';
                this.$refs['search-input'].focus();
            },
            //点击取消
            clickCancel() {
                // let params = urlParse();
                // if (wx && wx.CLIENT_ENV === 'wx_miniProgram') {
                //     funcTool.navigateTo('/', true);
                //     return;
                // }
                // if (!params.historyUrl && !document.referrer) {
                //     eJump('/homepage');
                //     return;
                // }
                // window.location.assign(params.historyUrl || document.referrer);
                this.$emit('close')
            },
            //恢复初始值
            reset() {
                EventBus.$emit('reset_type_page_id');
            },
            //点击搜索
            clickSearch() {
                // this.reset();
                let value = this.input_word;
                if (value.replace(/\s*/, '').length <= 0) { // 不允许提交空内容
                    EventBus.$emit('vueAlert', {
                        type: 'toast',
                        time: 1000,
                        desc: '请输入搜索关键词',
                    });
                    this.$refs['search-input'].focus();
                    return;
                }
                this.input_word = value;
                this.$refs['search-input'].blur();

                EventBus.$emit('handle_search_event', this.input_word);
                EventBus.$emit('update_history_arr', this.input_word)
            }
        }
    };
</script>

<style scoped>
    .search-input-container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        margin: 0 auto;
        height: 1.2rem;
        max-width: 480px;
        box-sizing: border-box;
        z-index: 100;
        background-color: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .search-input-inner{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .3rem;
    }
    .search-input-inner .search-form{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .search-input {
        width: 5.96rem;
        height: 0.8rem;
        padding: 0.12rem 0.72rem 0.12rem 0.68rem;
        /*line-height: 0.6rem;*/
        border-radius: 0.4rem;
        vertical-align: top;
        -webkit-appearance: none;
        outline: none;
        border:1px solid rgba(241,241,241,1);
        color: #B2B2B2;
    }
    .search-input::placeholder {
        color: #B2B2B2;
    }
    .search-input::-webkit-search-cancel-button {
        display: none;
    }
    .search-cancel-icon {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: 1.4rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .search-icon {
        width: 0.4rem;
        height: 0.4rem;
        position: absolute;
        left: 0.48rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .search-cancel {
        color: #333333;
        float: right;
        line-height: 1.2rem;
        height: 1.2rem;
    }
</style>