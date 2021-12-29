<template>
  <div class="container">
        <div class="title">vuePreview</div>
        <div class="content">
            ## 一个图片基于photoSwipe的图片预览插件
            ### 使用
            <pre class="code">
            在入口文件中
            import vuePreview from '@xiaoe/goose'
            //使用
                {{code}}
            </pre>
            ###预览
            <div>
            previewImage(打开列表和列表中的某个图片，不依赖于已存在的图片)
            </div>
            <div class="group">
                <img src="http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg" @click="openPreview(imglist, 'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg')">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            imglist: [
                'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg',
                'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg',
                'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kel3e31c0a7xmy2vctkr.jpg'
            ],
            code:`
            注册实例：
            Vue.prototype.$preview = new vuePreview({
                arrowEl: false,
                fullscreenEl:false,
            })

            <div class="group">
                <img src="http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg" @click="openPreview(imglist, 'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/kem7udya0faufrvjd18s.jpg')">
            </div>

            openPreview( list , src ) {
                this.$preview.previewImage({
                    current: src,
                    urls: list
                })
            }
            `
        }
    },
    methods: {
        openPreview( list , src ) {
            this.$preview.previewImage({
                current: src,
                urls: list
            })
        }
    }
}
</script>

<style>
.group {
    display: flex;
    flex-wrap: wrap;
}

.group img {
    width: 150px;
    height: 150px;
}

.title {
    padding: 20px;
    line-height: 50px;
    font-size: 32px;
    font-weight: 600;
    color: #353535;
}
.content {
    padding: 0 20px;
}

.code {
    width: 50%;
    overflow: auto;
    color: aliceblue;
    background-color: #353535;
}
</style>