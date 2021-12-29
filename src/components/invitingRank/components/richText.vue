<template>
  <div class="rich-text" v-html="text"></div>
</template>

<script>
export default {
    name: 'richText',
    props: {
        text: {
            type: String,
            default: null
        }
    }
};
</script>

<style lang="scss">
.rich-text {
  position: relative;
  word-wrap: break-word;
  word-break: normal;
  font-size: 0.32rem;
}
.rich-text * {
  max-width: 100%;
  box-sizing: border-box;
}
.rich-text ul {
  box-sizing: border-box;
}
.rich-text img {
  max-width: 100%;
}

.rich-text img[alt*="二维码"] {
  position: relative;
  z-index: 1004;
}

.rich-text .auto-height {
  height: auto;
  max-height: none;
}

.rich-text a {
  pointer-events: all;
}

.rich-text iframe {
  pointer-events: all;
}
.xiaoe-iframe-video {
  height: calc((100vw - 0.64rem) * 0.5625);
}
.xiaoe-iframe-outside {
  height: calc((100vw - 0.64rem) * 0.5625);
}
</style>
