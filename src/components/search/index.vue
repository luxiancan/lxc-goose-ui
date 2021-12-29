<template>
<div class="modal">
    <footer-logo-wrapper>
        <div class="search-inner">
            <search-input :place_holder_text="place_holder_text" @close="closeSearch"></search-input>
            <search-history></search-history>
        </div>
    </footer-logo-wrapper>
</div>
</template>

<script>

    import footerLogoWrapper from '@/components/footerLogoWrapper/index'; //底部导航logo
    import searchInput from './searchInput'; //输入框
    import searchHistory from './searchHistory'; //搜索历史
    import EventBus from '@/lib/eventbus'
    import eJump from '@/lib/eJump'

    export default {
        name: 'search',
        data() {
            return {
                place_holder_text: '',
                appId: window.APPID
            };
        },
        created() {
            EventBus.$on('handle_search_event', this.handleSearchEvent)
        },
        methods:{
           handleSearchEvent(word){
                console.log(word);
                //  搜索行为 神策埋点
                try {
                    window.sensors.track('click_butt', {
                        page_id: 'C#h5#homepage#search#search_home_page',
                        l_program: 'H5',
                        page_name: '搜索主页面',
                        page_path: 'C端#H5#首页#搜索#搜索主页面',
                        cmm1: word,
                        page_button: '搜索',
                        app_id: window.APPID || '',
                        c_user_id: window.USERID || '',
                    });
                } catch (error) {
                    console.log(error);
                }
               let linkType
                //判断是什么企业模式和个人模式
                if (window.location.host.indexOf('xiaoe-tech.com') !== -1) {
                    linkType = 0
                } else {
                    linkType = 1
                }
                word = decodeURI(word);
                let url = window.location.origin + `/${this.appId}/search?link_type=${linkType}&q=${word}`;
                eJump.jump(url);
            },
            closeSearch(){
                this.$emit('close');
            }
        },
        components: {
            footerLogoWrapper,
            searchInput,
            searchHistory,
        }
    };
</script>

<style scoped>
    .search-container{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .search-inner {
        width: 100%;
        height: 100%;
        padding-top: 1.2rem;
        background-color: #F5F5F5;
        box-sizing: border-box;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .modal{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 100%;
        max-height: 100vh;
        z-index: 100;
    }
</style>