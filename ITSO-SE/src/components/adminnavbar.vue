<template>
  <div class="menubar-container">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </template>

      <template #end>
        <div class="icons">
          <!-- Notification Bell -->
          <div class="relative">
            <i class="pi pi-bell notification-icon" @click="toggleNotifications" />
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>

            <OverlayPanel ref="notificationOverlay">
              <div class="notif-dropdown">
                <h4 class="notif-header">Notifications</h4>
                <div class="notif-list">
                  <div v-if="notifications.length === 0" class="notif-empty">
                    No notifications
                  </div>
                  <div
                    v-for="notif in limitedNotifications"
                    :key="notif.id"
                    class="notif-item"
                    :class="{ unread: !notif.read }"
                    @click="goToDetail(notif.id)"
                  >
                    <div class="notif-avatar">
                      <i class="pi pi-user"></i>
                    </div>
                    <div class="notif-content">
                      <div class="notif-title">
                        <strong>{{ notif.uploaderName }}</strong> uploaded <strong>{{ notif.title }}</strong>
                      </div>
                      <!-- Display the type (application type) -->
                      <div class="notif-meta">
                        <span class="meta-tag">Type: {{ notif.type }}</span>
                      </div>
                      <div class="notif-time">{{ relativeTime(notif.uploadedAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </OverlayPanel>
          </div>

          <!-- Profile Icon -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import Menubar from 'primevue/menubar';
import OverlayPanel from 'primevue/overlaypanel';

const router = useRouter();
const profileOverlay = ref(null);
const notificationOverlay = ref(null);
const user = ref(null);
const notifications = ref([]);

const items = ref([
  { label: 'Dashboard', command: () => router.push('/adminips') },
  { label: 'Admin Tools', command: (event) => adminOverlay.value?.toggle?.(event.originalEvent) },
  { label: 'Reports', command: () => router.push('/admin-reports') },
]);

const toggleProfileMenu = (event) => {
  profileOverlay.value.toggle(event);
};

const toggleNotifications = (event) => {
  notificationOverlay.value.toggle(event);
};

const navigateTo = (path) => {
  router.push(path);
};

const logout = async () => {
  await signOut(auth);
  user.value = null;
  router.push('/');
};

// ✨ Fetching more detailed notifications (like in adminips)
const fetchNotifications = async () => {
  const submissionsCollection = collection(db, 'submissions');
  const competitionsCollection = collection(db, 'competitions');

  // Listen to submissions collection
  onSnapshot(submissionsCollection, async (submissionSnapshot) => {
    const submissionNotifs = await Promise.all(
      submissionSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Untitled Submission', // Use title from submission
          uploadedAt: data.uploadedAt,
          uploaderName: data.fullName || 'Unknown', // Directly fetch fullName from submission
          read: data.read || false,
          type: 'IP Protection', // Automatically set type to 'IP Protection' for submissions
        };
      })
    );

    // Listen to competitions collection
    onSnapshot(competitionsCollection, async (competitionSnapshot) => {
      const competitionNotifs = await Promise.all(
        competitionSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Competition', // title for competitions
            uploadedAt: data.createdAt, // Assuming competitions use createdAt
            uploaderName: data.fullName || 'Unknown', // Directly fetch fullName from competition
            read: data.read || false,
            type: 'Competition', // Set type as 'Competition' for competitions
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

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
  fetchNotifications();
});
</script>


<style scoped>
.menubar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.custom-menubar {
  background-color: #f47b91;
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
}

.icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
  position: relative;
}

.notification-badge {
  background-color: red;
  color: white;
  font-size: 12px;
  border-radius: 999px;
  padding: 2px 6px;
  position: absolute;
  top: -5px;
  right: -10px;
}

.profile-icon {
  width: 30px;
  height: 30px;
  background-color: #d3d3d3;
  border-radius: 50%;
  cursor: pointer;
}

.notif-dropdown {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.notif-header {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-empty {
  text-align: center;
  color: #aaa;
  font-size: 14px;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.notif-item.unread {
  background-color: #e6f0ff;
  font-weight: bold;
  transform: scale(1.02);
}

.notif-item:hover {
  background-color: #ebebeb;
}

.notif-avatar {
  width: 35px;
  height: 35px;
  background: #d3d3d3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.notif-content {
  flex: 1;
}

.notif-title {
  font-size: 14px;
  color: #333;
}

.notif-meta {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.meta-tag {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.notif-time {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
</style>
