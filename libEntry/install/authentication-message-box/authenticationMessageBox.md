# authenticationMessageBox

涉及C端用户进行分账时(比如推广员、裂变海报)使用，用于当用户的微信支付没有进行实名认证时，提醒用户需要进行实名认证，才可进行提现。

## 使用示例

```vue
<template>
    <authentication-message-box></authentication-message-box>
</template>

<script>
import { authenticationMessageBox } from '@xiaoe/goose';
export default {
    components: {
        authenticationMessageBox
    }
}
</script>
```
