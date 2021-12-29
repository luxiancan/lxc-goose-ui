# 小鹅通助手APP相关SDK封装

### 1. 使用前需要 npm 引入 @xiaoe/xiaoe-common-jssdk

### 2. 文件目录
```
.
├── index.js
├── handlers.js             // 操作方法
├── listeners.js            // 监听方法
├── publishToSubscribe.js   // 简易的发布订阅，用于监听方法
```

### 3. 这里面console.log的打印有统一前缀，所以如果要看调试信息，可过滤：`=====> xiaoehelperAppSdk`