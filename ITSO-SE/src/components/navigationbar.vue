<template>
  <div class="menubar-container">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <!-- Logo -->
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </template>

      <template #end>
        <div class="icons">
          <!-- Notification Bell -->
          <div class="relative">
            <i class="pi pi-bell notification-icon" @click="toggleNotifications"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            <!-- Notification Overlay -->
            <OverlayPanel ref="notificationOverlay">
              <ul class="dropdown-menu">
                <li v-for="(notif, index) in limitedNotifications" :key="notif.id" class="dropdown-item" @click="goToDetail(notif.id)">
                  <div class="notif-title">{{ notif.title }}</div>
                  <div :class="['notif-status', notif.status.toLowerCase()]">{{ notif.status }}</div>  <!-- Display Status Text with Dynamic Class -->
                  <div class="notif-time">{{ relativeTime(notif.uploadedAt) }}</div>
                </li>
              </ul>
            </OverlayPanel>
          </div>

          <!-- Profile Dropdown -->
          <div ref="profileMenu" class="relative">
            <div class="profile-icon" @click="toggleProfileMenu($event)"></div>
            <OverlayPanel ref="profileOverlay">
              <ul class="dropdown-menu">
                <li v-if="!user" @click="navigateTo('/login')" class="dropdown-item">Login</li>
                <li v-if="!user" @click="navigateTo('/signup')" class="dropdown-item">Signup</li>
                <li v-if="user" @click="logout" class="dropdown-item">Logout</li>
              </ul>
            </OverlayPanel>
          </div>

          <!-- Services Dropdown -->
          <div class="relative">
            <i class="pi pi-bars services-icon" @click="toggleServiceMenu"></i>
            <OverlayPanel ref="serviceOverlay">
              <ul class="dropdown-menu">
                <li @click="navigateTo('/ipsdisclaimer')" class="dropdown-item">IP Protection Application</li>
                <li @click="navigateTo('/cs1')" class="dropdown-item">Competition and Publication Form</li>
              </ul>
            </OverlayPanel>
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import Menubar from 'primevue/menubar';
import OverlayPanel from 'primevue/overlaypanel';

const router = useRouter();
const profileOverlay = ref(null);
const serviceOverlay = ref(null);
const notificationOverlay = ref(null);  // Define the notification overlay reference
const user = ref(null);
const notifications = ref([]);

const items = ref([
  { label: 'Home', command: () => router.push('/') },
  { 
    label: 'Services',
    command: (event) => toggleServiceMenu(event.originalEvent),
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

const toggleNotifications = (event) => {
  notificationOverlay.value.toggle(event);  // Toggle the notification overlay on bell click
};

const navigateTo = (path) => {
  router.push(path);
};

const logout = async () => {
  await signOut(auth);
  user.value = null;
  router.push('/'); // Redirect to landing page
};

// Fetching notifications for the logged-in user
const fetchNotifications = async () => {
  const submissionsCollection = collection(db, 'submissions');
  const competitionsCollection = collection(db, 'competitions');

  // Listen to submissions collection filtered by userId
  onSnapshot(query(submissionsCollection, where('userId', '==', user.value.uid)), async (submissionSnapshot) => {
    const submissionNotifs = await Promise.all(
      submissionSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Untitled Submission',
          uploadedAt: data.uploadedAt,
          uploaderName: data.fullName || 'Unknown',
          read: data.read || false,
          userId: data.userId,
          type: 'IP Protection',
          status: data.status || 'For Revision',  // Default to 'For Revision'
          applicationType: data.applicationType || 'General',
        };
      })
    );

    // Listen to competitions collection filtered by userId
    onSnapshot(query(competitionsCollection, where('userId', '==', user.value.uid)), async (competitionSnapshot) => {
      const competitionNotifs = await Promise.all(
        competitionSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Competition',
            uploadedAt: data.createdAt,
            uploaderName: data.fullName || 'Unknown',
            read: data.read || false,
            userId: data.userId,
            type: 'Competition',
            status: data.status || 'For Revision',  // Default to 'For Revision'
            applicationType: data.applicationType || 'General',
          };
        })
      );

      // Combine both submission and competition notifications
      const allNotifs = [...submissionNotifs, ...competitionNotifs];
      notifications.value = allNotifs.sort((a, b) => {
        if (!a.uploadedAt || !b.uploadedAt) return 0;
        return b.uploadedAt.seconds - a.uploadedAt.seconds; // Sort by uploadedAt
      });
    });
  });
};

const unreadCount = computed(() =>
  notifications.value.filter((notif) => !notif.read).length
);

const limitedNotifications = computed(() => notifications.value.slice(0, 10));

const goToDetail = async (id) => {
  const notifRef = doc(db, 'IP_Protection', id);
  await updateDoc(notifRef, { read: true });
  router.push(`/adminips/${id}`);
};

const relativeTime = (timestamp) => {
  if (!timestamp?.seconds) return 'Just now';
  const seconds = timestamp.seconds;
  const now = Date.now() / 1000;
  const diff = now - seconds;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(seconds * 1000).toLocaleDateString();
};

// Track authentication state
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      fetchNotifications(); // Only fetch notifications if a user is logged in
    }
  });
});
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

/* Notification Status */
.notif-status {
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

.notif-status.approved {
  color: green;
}

.notif-status.rejected {
  color: red;
}

.notif-status.revision {
  color: orange;
}

.notif-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}
</style>
