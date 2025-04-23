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
                  <li v-if="!user" @click="navigateTo('/login')" class="dropdown-item">Login</li>
                  <li v-if="user" @click="logout" class="dropdown-item">Logout</li>
                </ul>
              </OverlayPanel>
            </div>
          </div>
        </template>
      </Menubar>
  
      <!-- Admin Services Dropdown -->
      <OverlayPanel ref="adminOverlay">
        <ul class="dropdown-menu">
          <li @click="navigateTo('/adminips')" class="dropdown-item">Manage IP Submissions</li>
          <li @click="navigateTo('/admin-users')" class="dropdown-item">Manage Users</li>
        </ul>
      </OverlayPanel>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebase';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import Menubar from 'primevue/menubar';
  import OverlayPanel from 'primevue/overlaypanel';
  
  const router = useRouter();
  const profileOverlay = ref(null);
  const adminOverlay = ref(null);
  const user = ref(null);
  
  const items = ref([
    { label: 'Dashboard', command: () => router.push('/adminips') },
    {
      label: 'Admin Tools',
      command: (event) => toggleAdminMenu(event.originalEvent),
    },
    { label: 'Reports', command: () => router.push('/admin-reports') },
  ]);
  
  const toggleProfileMenu = (event) => {
    profileOverlay.value.toggle(event);
  };
  
  const toggleAdminMenu = (event) => {
    adminOverlay.value.toggle(event);
  };
  
  const navigateTo = (path) => {
    router.push(path);
  };
  
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  });
  
  const logout = async () => {
    await signOut(auth);
    user.value = null;
    router.push('/');
  };
  </script>
  
  <style scoped>
  .menubar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .custom-menubar {
    background-color: #f47b91;
    padding: 10px 20px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  
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
  
  .icons {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: auto;
  }
  
  .notification-icon {
    font-size: 20px;
    color: white;
    cursor: pointer;
  }
  
  .profile-icon {
    width: 30px;
    height: 30px;
    background-color: #d3d3d3;
    border-radius: 50%;
    cursor: pointer;
  }
  
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
  