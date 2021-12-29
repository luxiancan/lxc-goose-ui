<template>
  <div class="container">
    <div class="control">
      <xe-button @click="bottomVisible = !bottomVisible"> 底部 </xe-button>
      <xe-button @click="centerVisible = !centerVisible"> 中间 </xe-button>
      <xe-button @click="roundVisible = !roundVisible"> 圆角 </xe-button>
      <xe-button @click="closeVisible = !closeVisible"> 可关闭 </xe-button>
    </div>
    <xe-popup v-model="bottomVisible"></xe-popup>
    <xe-popup v-model="centerVisible" position="center" round closeable></xe-popup>
    <xe-popup v-model="roundVisible" round></xe-popup>
    <xe-popup v-model="closeVisible" round closeable></xe-popup>
  </div>
</template>
<script>
import XeButton from "../components/button";
import XePopup from "../components/popup";
export default {
  components: {
    XeButton,
    XePopup
  },
  data() {
    return {
      bottomVisible: false,
      centerVisible: false,
      roundVisible: false,
      closeVisible: false
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  .control {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
