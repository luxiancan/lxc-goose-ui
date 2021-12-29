# messageBox

基本消息框组件，目前支持消息提示、确认消息

## 参数

| 参数名称 | 参数类型 | 参数说明 |
| -- | -- | -- | -- |
|title|String|标题|
|content|String|描述|
|showCancelButton|Boolean|是否显示取消按钮|
|showConfirmButton|Boolean|是否显示确认按钮|
|cancelText|String|取消按钮别名|
|confirmText|String|确认按钮别名|

## 事件

|事件名称|事件参数|事件说明|
|--|--|--|
|onConfirm||确定按钮点击事件|
|onCancel||取消按钮点击事件|

## 示例

```js
this.$alert({
    title: '我是一个标题',
    content: '我是一段描述',
    // showCancelButton: false,
    confirmText: 'ok'
})
```
