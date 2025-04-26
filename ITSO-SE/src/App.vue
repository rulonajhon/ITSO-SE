<template>
  <!-- Show regular Navbar if not admin route -->
  <Navbar v-if="showUserNavbar" />
  <!-- Show admin Navbar only for /adminips -->
  <AdminNavbar v-if="showAdminNavbar" />
  
  <router-view />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from "@/components/navigationbar.vue";
import AdminNavbar from "@/components/adminnavbar.vue";
const route = useRoute();

// Computed logic to decide which navbar to show
const showAdminNavbar = computed(() => {
  return route.path.startsWith('/adminips') || route.path.startsWith('/adminviewips/');
});
const showUserNavbar = computed(() => !showAdminNavbar.value);
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
