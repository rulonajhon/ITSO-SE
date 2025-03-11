<template>
  <div class="menubar-container">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <!-- Logo -->
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </template>

      <template #end>
        <div class="icons">
          <i class="pi pi-bell notification-icon"></i>
          <div class="profile-icon"></div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';

const items = ref([
  { label: 'Home' },
  {
    label: 'Service',
    items: [
      { label: 'File Submission' },
      { label: 'IP Protection Application' },
      { label: 'Compliance Checklist' },
      { label: 'Event Clearance Form' },
      { label: 'Publication Form' },
    ],
  },
  { label: 'Policies' },
  { label: 'Contact' },
]);
</script>

<style scoped>
/* Floating Navbar - Always at the Top */
.menubar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Full-width Navbar with Styling */
.custom-menubar {
  background-color: #f47b91 ;
  border-radius: 0px;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Logo Styling */
.logo {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}

:deep(.p-menubar-root-list) {
  margin: 0 auto;
  justify-content: center !important;
  flex-grow: 1 !important;
  gap: 130px;
}

/* Right Side Icons */
.icons {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
}

/* Notification Bell */
.notification-icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
}

/* Profile Circle */
.profile-icon {
  width: 30px;
  height: 30px;
  background-color: #d3d3d3;
  border-radius: 50%;
  cursor: pointer;
}

</style>
