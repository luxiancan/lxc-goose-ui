<template>
  <div class="container">
    <div class="content">
      <h2>默认样式:</h2>
      <div class="h5_content">
        <ss-footer ref="ssfooter1" />
      </div>
      <h2>自定样式:</h2>
      <div class="h5_content">
        <ss-footer ref="ssfooter2"
          @data-finish="a" />
      </div>
      <p>使用方法：</p>
      <code class="code">
        import { FooterLogo } from '@xiaoe/goose'; // 导入组件

        把FooterLogo添加到components下使用
      </code>
      <p>属性：</p>
      <code>
        hasCacheData 是否缓存请求数据，默认缓存
      </code>
      <p>方法：</p>
      <code>
        data-finish 组件内部数据请求完成触发
      </code>
      <p>关于埋点等使用方法：</p>
      <code>
        监听data-finish
        给footer组件添加ref属性
        通过ref属性找到内部导航列表（navList）
        遍历navList找到你要埋点的项
        给这个item添加beforeFn属性（点击前触发的前置钩子函数）

        e.g.
        &lt;footer-logo ref="footer" @data-finish="finish" /&gt;

        finish(){
          const list = this.$refs.footer.navList
          const item = list.find(i => i.name === 'user')
          item.beforeFn = function(){
            // 埋点
          }
        }

        目前只提供点击的埋点
      </code>
    </div>
  </div>
</template>

<script>
import SsFooter from '@/components/footer'

export default {
  components: {
    SsFooter
  },
  data() {
    return {}
  },
  mounted() {
    const list = [{
      title: '店铺主页'
    }, {
      title: '个人中心',
      name: 'user'
    }, {
      title: '关注我们',
      name: 'follow',
      data: {
        wx_app_name: 'Miaox',
        wx_qr_url: 'http://wechatapppro-1252524126.file.myqcloud.com/undefined/image/3027b7912bb2108727a9d91b69e85021.png'
      }
    }, {
      title: '意见反馈'
    }]
    // 在h5端 qr是请求获取的，这里展示用写死
    this.$refs.ssfooter1.navList = list
    this.$refs.ssfooter2.navList = list
    this.$refs.ssfooter2.isDefaultImg = false
    this.$refs.ssfooter2.customLogo = 'https://admin.xiaoe-tech.com/images/logo-xiaoe.png'
  },
  methods: {
    a() {
      const list = this.$refs.ssfooter2.navList
      const item = list.find(i => i.name === 'user')
      item.beforeFn = this.b
    },
    b() {
      console.log(1111);
    }
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
//   padding: 0 20px;
    h2 {
        padding-left: 10px;
    }
}

.h5_content {
  margin: 20px 0;
  background: #efeff4;
  width: 100%;
}

code {
  white-space: pre;
  width: 100%;
}
</style>
