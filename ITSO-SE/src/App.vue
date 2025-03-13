<template>
    <Navbar />
    <router-view />
</template>

<script setup>
import Navbar from "@/components/navigationbar.vue";
</script>

<style>

/* Global styles */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}


</style>