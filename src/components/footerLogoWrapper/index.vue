<template>
    <div class="footer_logo_out_wrapper">
        <div class="page_wrapper" :class="{'reset_padding_bottom':is_reset}">
            <slot></slot>
        </div>

        <div class="footer_logo_wrapper" :class="{'reset_margin_top':is_reset,'faviriteState':favoriteState}">
            <footer-logo ref="footer"></footer-logo>
        </div>
    </div>
</template>

<script>
    import footerLogo from '@/components/footer';

    export default {
        name: 'footerLogoWrapper',
        props:['is_reset','favoriteState'],
        data: function () {
            return {
            };
        },
        components: {
            footerLogo
        }
    };
</script>

<style>
    html,body{
        height: 100%;
    }
</style>

<style scoped>
    .footer_logo_out_wrapper{
        height: 100%;
    }
    .page_wrapper{
        min-height: 100vh;
        overflow: hidden;
        padding-bottom: 2.46rem;
        box-sizing: border-box;
        background: #f5f5f5;
    }
    .reset_padding_bottom {
        padding-bottom: 3.46rem;
    }
    .footer_logo_wrapper {
        /* margin-top: -2.46rem; */
        height: 2.46rem;
    }
    .reset_margin_top {
        margin-top: -3.46rem;
    }
    .faviriteState{
        margin-bottom: 1rem;
    }
</style>