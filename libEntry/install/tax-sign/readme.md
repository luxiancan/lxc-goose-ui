# taxSign

个人是否签约个税代缴组件

## 参数

|参数名|参数类型|参数含义|默认值|
|---|---|---|---:|
|zIndex|Number|弹窗层级|10
|signScene|Number|触发场景|0
|needScene|Boolean|是否需要校验场景值|true

## 事件

无

## 方法

$taxSignConfirm

返回值：Promise；已签约（不需要弹窗提示）会返回true，未签约或者接口报错则返回false

## 示例

js用法

```js
import {taxSign} from '@xiaoe/goose'
Vue.use(taxSign)
this.$taxSignConfirm({
    signScene: 2
}).then((hasSign) => {});
```

vue组件用法

```vue
<template>
<tax-sign :signScene="2"></tax-sign>
</template>

<script>
import {taxSign} from '@xiaoe/goose'
export default {
    components: {
        taxSign
    }
}
</script>
```
