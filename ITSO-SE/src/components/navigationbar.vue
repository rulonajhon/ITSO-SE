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

          <!-- Profile Dropdown -->
          <div ref="profileMenu" class="relative">
            <div class="profile-icon" @click="toggleProfileMenu($event)"></div>
            <OverlayPanel ref="profileOverlay">
              <ul class="dropdown-menu">
                <li @click="navigateTo('/login')" class="dropdown-item">Login</li>
                <li @click="navigateTo('/signup')" class="dropdown-item">Signup</li>
              </ul>
            </OverlayPanel>
          </div>
        </div>
      </template>
    </Menubar>

    <!-- Services Dropdown -->
    <OverlayPanel ref="serviceOverlay">
      <ul class="dropdown-menu">
        <li @click="navigateTo('/ips1')" class="dropdown-item">IP Protection Application</li>
        <li @click="navigateTo('/cs1')" class="dropdown-item">Competition and Publication Form</li>
      </ul>
    </OverlayPanel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import OverlayPanel from 'primevue/overlaypanel';

const router = useRouter();
const profileOverlay = ref(null);
const serviceOverlay = ref(null);

const items = ref([
  { label: 'Home', command: () => router.push('/') },
  {
    label: 'Services',
    command: (event) => toggleServiceMenu(event.originalEvent), // Custom dropdown trigger
  },
  { label: 'Policies', command: () => router.push('/policies') },
  { label: 'Contact', command: () => router.push('/contacts') },
]);

const toggleProfileMenu = (event) => {
  profileOverlay.value.toggle(event);
};

const toggleServiceMenu = (event) => {
  serviceOverlay.value.toggle(event);
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
/* Floating Navbar */
.menubar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Navbar Styling */
.custom-menubar {
  background-color: #f47b91;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Logo */
.logo {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}

/* Center Menu */
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

/* Profile Icon */
.profile-icon {
  width: 30px;
  height: 30px;
  background-color: #d3d3d3;
  border-radius: 50%;
  cursor: pointer;
}

/* Dropdown Menu */
.dropdown-menu {
  background-color: #fff;
  list-style: none;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f3f3f3;
}
</style>
