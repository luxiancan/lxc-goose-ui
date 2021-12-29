<template>
  <div id="app">
    <div v-if="$route.query.title" class="component-title">
      {{ $route.query.title }}
    </div>
    <!-- <float-menu /> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
@import "@/assets/scss/index.scss";

html,
body {
  padding: 0;
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

.component-title {
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.navbar {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  font-size: 14px;
  color: #2a75ed;
  text-align: right;
  a {
    text-decoration: none;
  }
}
</style>
