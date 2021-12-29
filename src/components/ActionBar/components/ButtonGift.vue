<template>
  <figure @click.prevent="onClick">
    <img :src="iconSrc" />
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<script>
export default {
    props: {
        iconSrc: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        },
        onPayButtonClick: {
            type: Function,
            required: true
        }
    },
    methods: {
        onClick() {
            const sendFriendBackUrl = window.location.href;
            this.onPayButtonClick('pay', {
                showNum: true,
                prePayType: 2,
                backUrl: `${sendFriendBackUrl}${
                    sendFriendBackUrl.indexOf('?') !== -1 ? '&' : '?'
                }fromSendFriend=1`
            });
        }
    }
};
</script>

<style lang="scss">
figure {
  font-size: 0.2rem;
  color: #4a4c5b;
  margin: 0 0.1rem;
  text-align: center;
  line-height: 100%;
  cursor: pointer;
  img {
    width: 0.48rem;
    height: 0.48rem;
  }
}
</style>
