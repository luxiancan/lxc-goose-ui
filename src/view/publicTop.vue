<template>
  <div class="container">
    <div class="title">publicTop</div>
    <div class="content">
      <h2>默认展示:默认logo</h2>
      <div class="h5_content">
        <ss-public-top  ref="publicTop1"/>
      </div>
      <h2>自定义logo</h2>
      <div class="h5_content">
        <ss-public-top  ref="publicTop2"/>
      </div>
      <p>使用方法：</p>
      <code class="code">
        import { publicTop } from '@xiaoe/goose'; // 导入组件

        把publicTop添加到components下使用
      </code>
      
      <p>关于传入属性使用方法：</p>
      <code>
        is-fixed:控制顶部是否固定布局

        e.g.
        &lt;public-top  :is-fixed="false"/&gt;

      </code>
      <p>接口缓存控制：</p>
      <code>
         头部组件使用localstorage做本地存储，设置了5分钟的过期时间，<br>过期或没有缓存自动获取并更新缓存值

      </code>
    </div>
  </div>
</template>

<script>
import SsPublicTop from '@/components/publicTop'

export default {
  components: {
    SsPublicTop
  },
  data() {
    return {}
  },
  mounted() {
    const topData = {
        store_code:'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/cmVzb3VyY2Utc2hvcFNldHRpbmctNTI1NDI2MTY.png',
        account_name:'测试店铺公众号',
        store_name:'测试店铺',
        word:'关注',
    }
    // 在h5端 qr是请求获取的，这里展示用写死
    this.$refs.publicTop1.store_name = this.$refs.publicTop2.store_name = topData.store_name;
    this.$refs.publicTop1.account_name = this.$refs.publicTop2.account_name = topData.account_name;
    this.$refs.publicTop1.word = this.$refs.publicTop2.word = topData.word;
    this.$refs.publicTop1.store_code = this.$refs.publicTop2.store_code = topData.store_code;
    this.$refs.publicTop2.shoplogo = 'http://wechatapppro-1252524126.file.myqcloud.com/apppcHqlTPT3482/image/cmVzb3VyY2Utc2hvcFNldHRpbmctNTEwNzIzODA.jpg';
  
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.simulate_h5 {
  font-size: 50px;
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

.h5_content {
  margin: 20px 0;
  background: #efeff4;
  width: 375px;
}

code {
  white-space: pre;
}
</style>
