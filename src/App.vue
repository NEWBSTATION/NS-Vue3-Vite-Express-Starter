<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
  import { RouterView } from "vue-router";
</script>

<style lang="scss">
  @import "./assets/scss/app";
</style>
