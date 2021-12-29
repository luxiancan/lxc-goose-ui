# lxc-goose-ui
UI组件库  h5

## 组件的写法
为了按需引入，libEntry/build文件夹下的组件文件夹命名单词之间必须以短线连接 -
组件内单独写样式，不要把样式单独放一个文件在 src\assets\scss\index.scss 引入

## 库引库问题
关于库与库之间相互引用、依赖版本不一致问题同步
- 1、 以业务方的依赖库为基准统一外部依赖库版本，我们自己的私有库内部不能"明引用"(不能放在dependencies或devDependencies里面)业务方已存在的依赖库（即公共外部依赖库），将公共外部依赖放在peerDependencies中（保留引用关系）
- 2、在编译配置文件中，配置 externals。让库的打包忽略这些引用，不导致打包报错
- 本地调试跑`npm run dev`时，此时库已经作为调用的业务方，本地安装externals抛出去的依赖包，不要保存至package.json中

## 使用形式
### 全量引入
```
 // 业务库babel版本为babel6，工程使用b-compile编译包的，鉴于b-compile中的babel用的babel 6 ，暂时只能全量引入
  // b-compile已经升级了，还在内测阶段，正式版更新后，更新正式版即可实现按需加载
    import { FooterLogo } from '@xiaoe/goose';
     // 注释或去除原有的样式文件引入
    //import '@xiaoe/goose/static/index.css';
    <ss-footer ref="footer" @data-finish="finish" />
```

### 按需引入
```
    import { FooterLogo } from '@xiaoe/goose';
    // 注释或去除原有的样式文件引入
    // import '@xiaoe/goose/static/index.css';
    <ss-footer ref="footer" @data-finish="finish" />
    
    // 安装插件  cnpm i babel-plugin-component -D
      # For babel 7
      cnpm i babel-plugin-component -D

    // 配置.babelrc文件或者.babel.config.js文件
      plugins: [
            [
                'component',
                {
                    libraryName: '@xiaoe/goose',
                    style: false
                },
                '@xiaoe/goose'
            ]
        ]
```




## 目录结构
- build webpack打包相关
- config webpack打包相关
- lib
  - build 生产环境的打包入口
  - install 各个包的instasll方法
- src
  - assets 资源目录
    - scss 存放样式
      - packages 各个包的样式
  - components 各个组件
  - mixins 组件中的插入方法
  - router view页面的路由
  - utils 组件中的公共方法
  - view 开发时的各个组件简单demo示例页面
- static 打包之后的css和js文件目录

## 如何开发
1. `git pull`
2. `npm run dev`
参考目录结构和已有的组件开发，端口号为9000

## 如何上线
### 第一次发包步骤
1. `git pull`
2. `/lib/install`下添加包的install方法，并在index.js中引入新添加的包
3. `npm run build`
4. `cnpm adduser`(新建用户)
5. `cnpm login`(登录)
6. 找roam开权限
7. 修改`package.json`中的`version`(必须修改，要不然无法发布)
8. `cnpm publish`

### 第n次发包步骤
1. `git pull`
2. `npm run build`
3. 修改`package.json`中的`version`
4. `cnpm publish`

值得注意的是，cnpm的域名要切换到正确的域名下(http://111.230.199.61:6888/)。cnpm config list查看当前域名

## 期望
组件库的组件功能还不够完善，组件也不够全，期待你能为项目贡献一份你宝贵的代码