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
            <i class="pi pi-bell notification-icon" @click="toggleNotifications" />
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            
            <!-- Enhanced Notification Overlay -->
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
                    :class="{ unread: !notif.read || notif.unreadAdminComment || notif.hasUnreadNotifications }"
                    @click="goToDetail(notif.id, notif.type, notif.submissionId)"
                  >
                    <div class="notif-avatar">
                      <!-- Show different icon based on notification type -->
                      <i :class="notif.lastNotificationType === 'comment' || notif.type === 'Comment' ? 'pi pi-comments' : 'pi pi-user'"></i>
                    </div>
                    <div class="notif-content">
                      <div class="notif-title">
                        <!-- Comment Notification -->
                        <template v-if="notif.type === 'Comment'">
                          <strong>{{ notif.uploaderName }}</strong> commented on <strong>"{{ notif.title }}"</strong>: "{{ notif.commentText }}"
                        </template>
                        <!-- Status Update -->
                        <template v-else-if="notif.lastNotificationType !== 'comment'">
                          <strong>"{{ notif.title }}"</strong> 
                          <span>
                            has been <span :class="['status-text', notif.status.toLowerCase()]">{{ notif.status }}</span>
                          </span>
                        </template>
                        <!-- Comment on Submission Notification -->
                        <template v-else>
                          <strong>"{{ notif.title }}"</strong> 
                          <span>
                            has a new comment
                          </span>
                        </template>
                      </div>
                      <div v-if="(notif.lastNotificationType === 'comment' && notif.lastCommentText) || (notif.type === 'Comment' && notif.commentText)" class="notif-comment-preview">
                        "{{ notif.commentText || notif.lastCommentText }}"
                      </div>
                      <div class="notif-meta">
                        <span class="meta-tag">{{ notif.type }}</span>
                      </div>
                      <div class="notif-time">
                        {{ relativeTime(notif.uploadedAt, notif.lastNotificationTime || notif.lastStatusUpdate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
const notificationOverlay = ref(null);
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
  notificationOverlay.value.toggle(event);
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
  if (!user.value) return; // Exit if no user is logged in
  
  const submissionsCollection = collection(db, 'submissions');
  const competitionsCollection = collection(db, 'competitions');
  const submission_competitionCollection = collection(db, 'submission_competition');
  const notificationsCollection = collection(db, 'notifications'); // Add this line for comments

  // Listen to submissions collection filtered by userId
  onSnapshot(query(submissionsCollection, where('userId', '==', user.value.uid)), async (submissionSnapshot) => {
    const submissionNotifs = await Promise.all(
      submissionSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        // Ensure timestamp is properly captured
        const timestamp = data.uploadedAt || data.createdAt || data.submittedAt || new Date();
        return {
          id: docSnap.id,
          title: data.title || 'Untitled Submission',
          uploadedAt: timestamp,
          uploaderName: data.fullName || 'Unknown',
          read: data.read || false,
          userId: data.userId,
          type: 'IP Protection',
          status: data.status || 'For Revision',
          applicationType: data.applicationType || 'General',
          lastStatusUpdate: data.lastStatusUpdate || null,
          // New comment notification fields
          lastNotificationType: data.lastNotificationType || 'status',
          lastNotificationTime: data.lastNotificationTime || data.lastStatusUpdate || null,
          lastCommentText: data.lastCommentText || '',
          unreadAdminComment: data.unreadAdminComment || false,
          hasNewComment: data.hasNewComment || false,
          lastCommentBy: data.lastCommentBy || null,
          lastCommentDate: data.lastCommentDate || null,
          hasUnreadNotifications: data.unreadAdminComment || !data.read
        };
      })
    );

    // Listen to competitions collection filtered by userId
    onSnapshot(query(competitionsCollection, where('userId', '==', user.value.uid)), async (competitionSnapshot) => {
      const competitionNotifs = await Promise.all(
        competitionSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          // Ensure timestamp is properly captured
          const timestamp = data.createdAt || data.uploadedAt || data.submittedAt || new Date();
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Competition',
            uploadedAt: timestamp,
            uploaderName: data.fullName || 'Unknown',
            read: data.read || false,
            userId: data.userId,
            type: 'Competition',
            status: data.status || 'For Revision',
            applicationType: data.applicationType || 'General',
            lastStatusUpdate: data.lastStatusUpdate || null,
            // New comment notification fields
            lastNotificationType: data.lastNotificationType || 'status',
            lastNotificationTime: data.lastNotificationTime || data.lastStatusUpdate || null,
            lastCommentText: data.lastCommentText || '',
            unreadAdminComment: data.unreadAdminComment || false,
            hasNewComment: data.hasNewComment || false,
            lastCommentBy: data.lastCommentBy || null,
            lastCommentDate: data.lastCommentDate || null,
            hasUnreadNotifications: data.unreadAdminComment || !data.read
          };
        })
      );

      // Listen to submission_competition collection filtered by userId if it exists
      onSnapshot(query(submission_competitionCollection, where('userId', '==', user.value.uid)), async (submissionCompetitionSnapshot) => {
        const submissionCompetitionNotifs = await Promise.all(
          submissionCompetitionSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            // Ensure timestamp is properly captured
            const timestamp = data.createdAt || data.uploadedAt || data.submittedAt || new Date();
            return {
              id: docSnap.id,
              title: data.title || 'Untitled Competition Submission',
              uploadedAt: timestamp,
              uploaderName: data.fullName || 'Unknown',
              read: data.read || false,
              userId: data.userId,
              type: 'Competition Submission',
              status: data.status || 'For Revision',
              applicationType: data.applicationType || 'General',
              lastStatusUpdate: data.lastStatusUpdate || null,
              // New comment notification fields
              lastNotificationType: data.lastNotificationType || 'status',
              lastNotificationTime: data.lastNotificationTime || data.lastStatusUpdate || null,
              lastCommentText: data.lastCommentText || '',
              unreadAdminComment: data.unreadAdminComment || false,
              hasNewComment: data.hasNewComment || false,
              lastCommentBy: data.lastCommentBy || null,
              lastCommentDate: data.lastCommentDate || null,
              hasUnreadNotifications: data.unreadAdminComment || !data.read
            };
          })
        );

        // ADD THIS: Listen for comment notifications
        onSnapshot(query(notificationsCollection, where('userId', '==', user.value.uid)), async (notificationSnapshot) => {
          const commentNotifs = await Promise.all(
            notificationSnapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();
              if (data.type === 'comment') {
                return {
                  id: docSnap.id,
                  title: data.title || 'Untitled Submission',
                  uploadedAt: data.uploadedAt || data.createdAt || new Date(),
                  uploaderName: data.uploaderName || 'Unknown',
                  read: data.read || false,
                  userId: data.userId,
                  type: 'Comment',
                  submissionId: data.submissionId,
                  collectionName: data.collectionName,
                  commentText: data.commentText || '',
                  hasUnreadNotifications: !data.read
                };
              }
              return null;
            })
          );

          // Filter out null values
          const filteredCommentNotifs = commentNotifs.filter(notif => notif !== null);

          // Combine all notifications
          const allNotifs = [...submissionNotifs, ...competitionNotifs, ...submissionCompetitionNotifs, ...filteredCommentNotifs];
          
          // Sort notifications: prioritize notifications by type, then recency
          notifications.value = allNotifs.sort((a, b) => {
            // First prioritize unread items
            if ((a.unreadAdminComment || !a.read) && !(b.unreadAdminComment || !b.read)) return -1;
            if (!(a.unreadAdminComment || !a.read) && (b.unreadAdminComment || !b.read)) return 1;
            
            // Next, prioritize by notification time
            const aTime = getTimeValue(a.lastNotificationTime || a.lastStatusUpdate || a.uploadedAt);
            const bTime = getTimeValue(b.lastNotificationTime || b.lastStatusUpdate || b.uploadedAt);
            return bTime - aTime; // Most recent notifications first
          });
        });
      });
    });
  });
};

// Helper function to get timestamp value consistently
const getTimeValue = (timestamp) => {
  if (!timestamp) return 0;
  
  if (timestamp.seconds) {
    return timestamp.seconds;
  } else if (typeof timestamp.toMillis === 'function') {
    return timestamp.toMillis() / 1000;
  } else if (timestamp instanceof Date) {
    return timestamp.getTime() / 1000;
  } else if (typeof timestamp === 'number') {
    return timestamp / 1000;
  }
  
  return 0;
};

const unreadCount = computed(() => {
  return notifications.value.filter((notif) => {
    // Count as unread if:
    // 1. The notification is unread AND the status is not pending, OR
    // 2. There is an unread admin comment, OR
    // 3. It's a direct comment notification that's unread
    return ((!notif.read && notif.status?.toLowerCase() !== 'pending') || 
           notif.unreadAdminComment || 
           (notif.type === 'Comment' && !notif.read));
  }).length;
});

const limitedNotifications = computed(() => {
  // Filter out pending notifications and take only up to 10
  return notifications.value
    .filter(notif => (notif.status?.toLowerCase() !== 'pending') || 
                      notif.unreadAdminComment || 
                      notif.type === 'Comment')
    .slice(0, 10);
});

const goToDetail = async (id, type, submissionId) => {
  try {
    if (type === 'Comment') {
      // Update the notification read status for comment notifications
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
      
      // Navigate to the user view page with the related submission ID
      router.push(`/userviewips/${submissionId || id}`);
    } else {
      // Find the notification object
      const notification = notifications.value.find(n => n.id === id);
      if (!notification) return;
      
      // Determine the collection based on the notification type
      let collectionName = 'submissions'; // default
      if (notification.type === 'Competition') {
        collectionName = 'competitions';
      } else if (notification.type === 'Competition Submission') {
        collectionName = 'submission_competition';
      }
      
      // Update the notification to be read
      const notifRef = doc(db, collectionName, id);
      await updateDoc(notifRef, { 
        read: true,
        unreadAdminComment: false, // Mark admin comments as read
        lastReadTime: new Date() // Add timestamp when user reads the notification
      });
      
      // Navigate to the user view page
      router.push(`/userviewips/${id}`);
    }
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};

// Fixed relativeTime function to properly handle Firebase timestamps and respect status updates
const relativeTime = (timestamp, lastNotificationTime) => {  
  // If we have a lastNotificationTime, use that instead to show the most recent activity
  const targetTimestamp = lastNotificationTime || timestamp;
  
  // Handle case when timestamp is undefined or null
  if (!targetTimestamp) {
    return 'Just now';
  }
  
  let timeMillis;

  try {
    // Check if it's a Firestore timestamp (has seconds and nanoseconds)
    if (targetTimestamp.seconds !== undefined && targetTimestamp.nanoseconds !== undefined) {
      timeMillis = targetTimestamp.seconds * 1000;
    } 
    // Check if it has a toDate method (Firebase Timestamp object)
    else if (typeof targetTimestamp.toDate === 'function') {
      timeMillis = targetTimestamp.toDate().getTime();
    } 
    // Check if it's a Date object
    else if (targetTimestamp instanceof Date) {
      timeMillis = targetTimestamp.getTime();
    } 
    // If it's a number (timestamp in milliseconds)
    else if (typeof targetTimestamp === 'number') {
      timeMillis = targetTimestamp;
    } 
    // For any other timestamp format we can't recognize
    else {
      return 'Just now';
    }
  } catch (error) {
    console.error("Error processing timestamp:", error);
    return 'Just now';
  }

  // If the notification was recently updated (in last 5 minutes), always show "Just now"
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  if (timeMillis > fiveMinutesAgo) {
    return 'Just now';
  }

  const now = Date.now();
  const diffInSeconds = (now - timeMillis) / 1000;

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? 's' : ''} ago`;
  
  return new Date(timeMillis).toLocaleDateString(); // fallback to date if older than 1 month
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
  position: relative;
}

/* Notification Badge */
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

/* Profile Icon */
.profile-icon {
  width: 30px;
  height: 30px;
  background-color: #d3d3d3;
  border-radius: 50%;
  cursor: pointer;
}

/* Services Icon */
.services-icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
}

/* Enhanced Notification Dropdown */
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
  display: flex;
  gap: 6px;
}

.meta-tag {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

/* Status text styling */
.status-text {
  font-weight: 600;
}

.status-text.approved {
  color: green;
}

.status-text.rejected {
  color: red;
}

.status-text.for.revision,
.status-text.forrevision,
.status-text.revision {
  color: orange;
}

/* Status tag styling (for backwards compatibility) */
.status-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.status-tag.approved {
  background-color: rgba(0, 128, 0, 0.1);
  color: green;
}

.status-tag.rejected {
  background-color: rgba(255, 0, 0, 0.1);
  color: red;
}

.status-tag.for.revision {
  background-color: rgba(255, 165, 0, 0.1);
  color: orange;
}

.notif-time {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* Regular dropdown menu */
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