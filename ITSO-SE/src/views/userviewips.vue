<template>
  <div class="page-container">
    <h1 class="form-title">Submission Details</h1>

    <div class="main-content">
      <div class="two-column-layout">
        <div class="column">
          <!-- Basic Information -->
          <div class="section-container">
            <h2 class="section-title">Basic Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Title</div>
                <div class="review-value">{{ formData.title }}</div>
              </div>
              <div class="review-item" v-if="formData.applicationType">
                <div class="review-label">Application Type</div>
                <div class="review-value">{{ formData.applicationType }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Status</div>
                <div class="review-value" :class="statusClass">{{ formData.status || 'Pending' }}</div>
              </div>
            </div>
          </div>

          <!-- User Information -->
          <div class="section-container">
            <h2 class="section-title">User Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Full Name</div>
                <div class="review-value">{{ formData.fullName }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Email</div>
                <div class="review-value">{{ formData.email }}</div>
              </div>
              <div class="review-item" v-if="formData.contactNumber">
                <div class="review-label">Contact Number</div>
                <div class="review-value">{{ formData.contactNumber }}</div>
              </div>
              <div class="review-item" v-if="formData.department">
                <div class="review-label">Department</div>
                <div class="review-value">{{ formData.department }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <!-- Uploaded Documents -->
          <div class="section-container">
            <h2 class="section-title">Uploaded Documents</h2>
            <div class="documents-list">
              <div v-if="formData.fileURLs" class="document-list">
                <div v-for="(url, docType) in formData.fileURLs" :key="docType" class="document-item" v-show="url">
                  <div class="document-icon">
                    <i class="document-status-icon icon-check"></i>
                  </div>
                  <div class="document-details">
                    <div class="document-name">{{ formatDocumentName(docType) }}</div>
                    <div class="document-filename">
                      <button class="view-btn" @click="viewDocument(url)">View</button>
                      <a :href="url" class="download-btn" download>Download</a>
                      <button v-if="formData.status.toLowerCase() === 'revision'" class="change-btn" @click="changeDocument(docType)">Change</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="documents-list">
                <div v-for="(document, index) in formData.uploadedDocuments" :key="index" class="document-item">
                  <div class="document-icon">
                    <i class="document-status-icon" :class="document.url ? 'icon-check' : 'icon-missing'"></i>
                  </div>
                  <div class="document-details">
                    <div class="document-name">{{ document.name }}</div>
                    <div v-if="document.url" class="document-filename">
                      <button class="view-btn" @click="viewDocument(document.url)">View</button>
                      <a :href="document.url" class="download-btn" download>Download</a>
                      <button v-if="formData.status.toLowerCase() === 'revision'" class="change-btn" @click="changeDocument(index)">Change</button>
                    </div>
                    <div v-else class="document-missing-text">Document not uploaded</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!hasDocuments" class="no-documents-text">
              No documents available.
            </div>
          </div>

          <!-- Admin Feedback Section -->
          <div class="section-container" v-if="formData.reason">
            <h2 class="section-title">Admin Feedback</h2>
            <div class="feedback-box">
              <p class="feedback-text">{{ formData.reason }}</p>
              <div class="feedback-date" v-if="formData.reviewedAt">
                Last updated: {{ formatDate(formData.reviewedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversation Section (Facebook-style) -->
      <div class="section-container conversation-section">
        <h2 class="section-title">Comments</h2>
        
        <!-- Comment Input -->
        <div class="comment-input-container">
          <div class="comment-user-avatar">
            <div class="avatar">{{ getUserInitials() }}</div>
          </div>
          <div class="comment-input-wrapper">
            <textarea 
              v-model="userComment" 
              rows="2" 
              placeholder="Write a comment..." 
              class="comment-textarea"
              @keydown.enter.prevent="submitComment"
            ></textarea>
            <button 
              class="comment-submit-btn" 
              :disabled="!userComment.trim()" 
              @click="submitComment"
            >
              <i class="comment-submit-icon">➤</i>
            </button>
          </div>
        </div>
        
        <!-- Comment Thread -->
        <div class="comment-thread" v-if="comments.length > 0">
          <div v-for="(comment, index) in comments" :key="index" class="comment-item">
            <div class="comment-avatar" :class="{'admin-avatar': comment.isAdmin}">
              <div class="avatar">{{ getCommentInitials(comment) }}</div>
            </div>
            <div class="comment-bubble" :class="{'admin-bubble': comment.isAdmin}">
              <div class="comment-header">
                <span class="comment-author">{{ comment.isAdmin ? 'Admin' : formData.fullName }}</span>
                <span class="comment-time">{{ formatDate(comment.timestamp) }}</span>
              </div>
              <div class="comment-text">{{ comment.text }}</div>
            </div>
          </div>
        </div>
        <div v-else class="no-comments-text">
          No comments yet. Start the conversation!
        </div>
      </div>
    </div>

    <div class="fixed-buttons">
      <button class="btn btn-back" @click="goBack">Back</button>
    </div>

    <!-- PDF Viewer Modal -->
    <div v-if="showViewer" class="modal-overlay" @click.self="closeViewer">
      <div class="modal-content">
        <iframe :src="selectedDocumentUrl" class="pdf-frame"></iframe>
        <button class="close-btn" @click="closeViewer">Close</button>
      </div>
    </div>

    <!-- Document Change Modal -->
    <div v-if="showChangeModal" class="modal-overlay" @click.self="closeChangeModal">
      <div class="modal-content change-document-modal">
        <h3>Upload Revised Document</h3>
        <div class="file-upload-container">
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelected" 
            class="file-input"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
          />
          <div class="file-upload-info">
            <p v-if="selectedFile">Selected file: {{ selectedFile.name }}</p>
            <p v-else>No file selected</p>
          </div>
        </div>
        <div class="change-modal-buttons">
          <button class="btn btn-cancel" @click="closeChangeModal">Cancel</button>
          <button 
            class="btn btn-upload" 
            :disabled="!selectedFile || isUploading" 
            @click="uploadRevisedDocument"
          >
            {{ isUploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const route = useRoute();
const router = useRouter();

const formData = ref({
  title: '',
  fullName: '',
  email: '',
  contactNumber: '',
  department: '',
  applicationType: '',
  uploadedDocuments: [],
  fileURLs: null,
  status: '',
  reason: '',
  reviewedAt: null
});

let submissionCollection = '';
let docRef = null;
const userComment = ref('');
const comments = ref([]);

const selectedDocumentUrl = ref(null);
const showViewer = ref(false);

// For document change functionality
const showChangeModal = ref(false);
const selectedFile = ref(null);
const selectedDocIndex = ref(null);
const selectedDocType = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);

const statusClass = computed(() => {
  const status = (formData.value.status || '').toLowerCase();
  if (status === 'approved') return 'status-approved';
  if (status === 'rejected') return 'status-rejected';
  if (status === 'revision') return 'status-revision';
  if (status === 'pending') return 'status-pending';
  return '';
});

const hasDocuments = computed(() => {
  if (formData.value.fileURLs) {
    return Object.values(formData.value.fileURLs).some(url => url);
  }
  return formData.value.uploadedDocuments && formData.value.uploadedDocuments.length > 0;
});

const formatDocumentName = (docType) => {
  const nameMap = {
    'guidelines': 'Guidelines',
    'documents': 'Documents',
    'request': 'Request Letter',
    'additional': 'Additional Files'
  };
  return nameMap[docType] || docType;
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  let date;
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'N/A';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getUserInitials = () => {
  const name = formData.value.fullName || auth.currentUser?.displayName || 'User';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getCommentInitials = (comment) => {
  if (comment.isAdmin) {
    return 'AD';
  } else {
    return getUserInitials();
  }
};

const viewDocument = (url) => {
  if (url) {
    selectedDocumentUrl.value = url;
    showViewer.value = true;
  } else {
    alert('Document not available.');
  }
};

const closeViewer = () => {
  selectedDocumentUrl.value = null;
  showViewer.value = false;
};

// Document change functionality
const changeDocument = (docIdentifier) => {
  // Reset file input
  selectedFile.value = null;
  
  if (typeof docIdentifier === 'string') {
    // Handling fileURLs case
    selectedDocType.value = docIdentifier;
    selectedDocIndex.value = null;
  } else {
    // Handling uploadedDocuments case
    selectedDocIndex.value = docIdentifier;
    selectedDocType.value = null;
  }
  
  showChangeModal.value = true;
};

const handleFileSelected = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

const closeChangeModal = () => {
  showChangeModal.value = false;
  selectedFile.value = null;
  selectedDocIndex.value = null;
  selectedDocType.value = null;
  
  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadRevisedDocument = async () => {
  if (!selectedFile.value) return;
  
  const storage = getStorage();
  const submissionId = route.params.id;
  const userId = auth.currentUser?.uid || submissionId;
  let folderPath = '';
  let fileName = '';
  
  isUploading.value = true;
  
  try {
    // Determine storage path based on collection
    if (submissionCollection === 'submissions') {
      folderPath = `submissions/ipapplication/${userId}/`;
    } else if (submissionCollection === 'competitions' || submissionCollection === 'submission_competition') {
      folderPath = `competitions/${userId}/`;
    }
    
    // Generate unique filename with timestamp
    const timestamp = new Date().getTime();
    const originalName = selectedFile.value.name;
    const extension = originalName.split('.').pop();
    fileName = `${originalName.split('.')[0]}_rev_${timestamp}.${extension}`;
    
    const fileRef = storageRef(storage, `${folderPath}${fileName}`);
    
    // Upload file
    const uploadTask = uploadBytesResumable(fileRef, selectedFile.value);
    
    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    // Update document reference in Firestore
    if (selectedDocType.value !== null) {
      // For fileURLs structure
      const updateData = {};
      updateData[`fileURLs.${selectedDocType.value}`] = downloadURL;
      
      await updateDoc(docRef, updateData);
    } else if (selectedDocIndex.value !== null) {
      // For uploadedDocuments array
      const updatedDocs = [...formData.value.uploadedDocuments];
      updatedDocs[selectedDocIndex.value] = {
        ...updatedDocs[selectedDocIndex.value],
        url: downloadURL,
        storedName: fileName,
        lastUpdated: new Date()
      };
      
      await updateDoc(docRef, { uploadedDocuments: updatedDocs });
    }
    
    // Update document status if needed
    await updateDoc(docRef, {
      lastUpdated: new Date(),
      hasNewDocuments: true
    });
    
    // Add a system comment about the document change
    await addDoc(collection(db, 'comments'), {
      submissionId: submissionId,
      collectionName: submissionCollection,
      text: `Document updated: ${selectedFile.value.name}`,
      userId: userId,
      userEmail: auth.currentUser?.email || formData.value.email,
      isAdmin: false,
      isSystem: true,
      timestamp: new Date()
    });
    
    // Update the local state
    if (selectedDocType.value !== null && formData.value.fileURLs) {
      formData.value.fileURLs[selectedDocType.value] = downloadURL;
    } else if (selectedDocIndex.value !== null && formData.value.uploadedDocuments) {
      formData.value.uploadedDocuments[selectedDocIndex.value].url = downloadURL;
      formData.value.uploadedDocuments[selectedDocIndex.value].storedName = fileName;
    }
    
    alert('Document successfully updated!');
    closeChangeModal();
    
  } catch (error) {
    console.error('Error uploading revised document:', error);
    alert('Failed to upload document: ' + error.message);
  } finally {
    isUploading.value = false;
  }
};

const submitComment = async () => {
  if (!userComment.value.trim()) return;
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('You must be logged in to comment.');
      return;
    }
    
    const commentData = {
      submissionId: route.params.id,
      collectionName: submissionCollection,
      text: userComment.value.trim(),
      userId: currentUser.uid,
      userEmail: currentUser.email,
      isAdmin: false,
      timestamp: new Date()
    };
    
    // Add comment to comments collection
    await addDoc(collection(db, 'comments'), commentData);
    
    // Update submission with new comment flag
    await updateDoc(docRef, {
      hasNewComment: true,
      lastCommentDate: new Date()
    });
    
    // ADD THIS: Create a notification for admin
    await addDoc(collection(db, 'notifications'), {
      type: 'comment',
      submissionId: route.params.id,
      collectionName: submissionCollection,
      commentText: userComment.value.trim().substring(0, 50) + (userComment.value.trim().length > 50 ? '...' : ''),
      uploaderName: formData.value.fullName || currentUser.displayName || currentUser.email,
      uploadedAt: new Date(),
      title: formData.value.title || 'Untitled Submission',
      read: false,
      createdAt: new Date()
    });
    
    userComment.value = '';
    
  } catch (e) {
    console.error('Error submitting comment:', e);
    alert('Failed to submit comment: ' + e.message);
  }
};

const loadComments = () => {
  const submissionId = route.params.id;
  const commentsQuery = query(
    collection(db, 'comments'),
    where('submissionId', '==', submissionId),
    orderBy('timestamp', 'asc')
  );
  
  onSnapshot(commentsQuery, (snapshot) => {
    comments.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
};

const goBack = () => {
  router.push('/home');
};

const loadSubmission = async () => {
  const id = route.params.id;
  const storage = getStorage();
  
  // Try loading from submissions first
  docRef = doc(db, 'submissions', id);
  let docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // If not in submissions, try competitions collection
    docRef = doc(db, 'competitions', id);
    docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // If not in competitions, try submission_competition collection
      docRef = doc(db, 'submission_competition', id);
      docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        alert('Submission not found in any collection.');
        return router.push('/home');
      } else {
        submissionCollection = 'submission_competition';
      }
    } else {
      submissionCollection = 'competitions';
    }
  } else {
    submissionCollection = 'submissions';
  }

  console.log(`Submission found in ${submissionCollection} collection`);
  
  const data = docSnap.data();
  
  // Handle different document structures based on collection
  if (submissionCollection === 'competitions' || submissionCollection === 'submission_competition') {
    // Competition document format (from formStore.js)
    formData.value = {
      title: data.title || '',
      fullName: data.fullName || '',
      email: data.userEmail || data.email || '',
      contactNumber: data.contactNumber || '',
      department: data.department || '',
      applicationType: data.applicationType || 'Competition',
      fileURLs: data.fileURLs || {},
      status: data.status || 'Pending',
      reason: data.reason || '',
      reviewedAt: data.reviewedAt || null
    };
  } else {
    // Regular submission document format
    formData.value = {
      title: data.title || data.fileName || '',
      fullName: data.fullName || '',
      email: data.email || data.uploaderEmail || '',
      contactNumber: data.contactNumber || '',
      department: data.department || '',
      applicationType: data.applicationType || 'IP Protection',
      status: data.status || 'Pending',
      reason: data.reason || '',
      reviewedAt: data.reviewedAt || null
    };
    
    // Handle uploaded documents
    const uploadedDocs = data.uploadedDocuments || [];
    if (uploadedDocs.length > 0) {
      const userId = data.userId || id;
      const folderPath = 'submissions/ipapplication/';
      
      formData.value.uploadedDocuments = await Promise.all(uploadedDocs.map(async (doc) => {
        if (doc.url) {
          return {
            name: doc.name,
            storedName: doc.storedName || doc.name,
            url: doc.url
          };
        }

        try {
          const storedFileName = doc.storedName || doc.name;
          const documentUrl = await getDownloadURL(storageRef(storage, `${folderPath}${userId}/${storedFileName}`));
          return {
            name: doc.name,
            storedName: storedFileName,
            url: documentUrl
          };
        } catch (e) {
          console.warn(`Could not fetch URL for ${doc.name}:`, e);
          return {
            name: doc.name,
            storedName: doc.storedName || doc.name,
            url: null
          };
        }
      }));
    }
  }
  
  // Mark notification as read if it exists
  if (data.read === false) {
    await updateDoc(docRef, { read: true });
  }
};

onMounted(() => {
  loadSubmission();
  loadComments();
});
</script>

<style scoped>
/* Add these new styles for the change button and modal */
.change-btn {
  background-color: #ffa500;
  color: white;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 5px;
}

.change-btn:hover {
  background-color: #ff8c00;
}

.change-document-modal {
  width: 500px;
  max-width: 90%;
  padding: 20px;
}

.change-document-modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.file-upload-container {
  margin-bottom: 20px;
  padding: 15px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  text-align: center;
}

.file-input {
  width: 100%;
  margin-bottom: 10px;
}

.file-upload-info {
  font-size: 0.9rem;
  color: #666;
}

.change-modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
}

.btn-upload {
  background-color: #4caf50;
  color: white;
}

.btn-upload:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}
</style>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  max-width: 90%;
  width: 1000px;
  max-height: 90vh;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(0,0,0,0.5);
}

.pdf-frame {
  width: 100%;
  height: 80vh;
  border: none;
}

.close-btn {
  display: block;
  margin: 1rem auto 0;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Comment section styles */
.conversation-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.comment-input-container {
  display: flex;
  margin-bottom: 1.5rem;
}

.comment-user-avatar {
  margin-right: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a86e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.admin-avatar .avatar {
  background-color: #e67e22;
}

.comment-input-wrapper {
  flex: 1;
  position: relative;
}

.comment-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 40px 10px 15px;
  resize: none;
  font-family: inherit;
}

.comment-submit-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: none;
  border: none;
  color: #4a86e8;
  cursor: pointer;
}

.comment-submit-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.comment-thread {
  margin-top: 1rem;
}

.comment-item {
  display: flex;
  margin-bottom: 1rem;
}

.comment-avatar {
  margin-right: 10px;
}

.comment-bubble {
  flex: 1;
  background-color: #f0f2f5;
  border-radius: 18px;
  padding: 12px 15px;
  position: relative;
  max-width: 80%;
}

.admin-bubble {
  background-color: #e3f2fd;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-author {
  font-weight: bold;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #666;
}

.comment-text {
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

.no-comments-text {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 1rem;
}

/* Page Container */
.page-container {
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 80px;
}

/* Form Title */
.form-title {
  color: #ff6b8a;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/* Progress Bar Styles */
.progress-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px auto;
  padding: 20px;
  position: relative;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px;
}

/* Progress bar line - background */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: 1;
}

/* Progress bar line - filled */
.progress-bar::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ff6b8a;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ddd;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 8px;
}

.progress-step.active .step-circle {
  background-color: #ff6b8a;
  color: white;
}

.step-label {
  font-size: 11px;
  text-align: center;
  color: #999;
  font-weight: 400;
  max-width: 80px;
  line-height: 1.2;
}

.progress-step.active .step-label {
  color: #ff6b8a;
  font-weight: 700;
}

/* Main Content Container */
.main-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Two Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (min-width: 768px) {
  .two-column-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-container {
  margin-bottom: 20px;
}

.section-title {
  color: #ff6b8a;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 500;
}

/* Review Grid */
.review-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.review-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.review-label {
  color: #ff6b8a;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: 500;
}

.review-value {
  font-size: 14px;
  color: #333;
}

/* Status Classes */
.status-approved {
  color: #4CAF50;
  font-weight: bold;
}

.status-rejected {
  color: #f44336;
  font-weight: bold;
}

.status-revision {
  color: #FF9800;
  font-weight: bold;
}

.status-pending {
  color: #2196F3;
  font-weight: bold;
}

/* Documents List */
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.document-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.document-item.document-missing {
  border-left-color: #f44336;
}

.document-item.document-optional {
  border-left-color: #FFC107;
}

.document-icon {
  margin-right: 15px;
}

.document-status-icon {
  font-size: 18px;
  font-style: normal;
}

.document-status-icon.icon-check::before {
  content: '✓';
  color: #4CAF50;
}

.document-status-icon.icon-missing::before {
  content: '✗';
  color: #f44336;
}

.document-status-icon.icon-optional::before {
  content: '!';
  color: #FFC107;
}

.document-details {
  flex: 1;
}

.document-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.document-filename {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-btn, .download-btn {
  padding: 2px 8px;
  background: #ff6b8a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  text-decoration: none;
}

.document-missing-text {
  font-size: 12px;
  color: #f44336;
  font-style: italic;
}

.document-optional-text {
  font-size: 12px;
  color: #FFC107;
  font-style: italic;
}

/* Feedback Box */
.feedback-box {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ff6b8a;
}

.feedback-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.feedback-date {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

/* Form Buttons */
.fixed-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #eee;
  z-index: 100;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.btn-back, .btn-next {
  background-color: #ff6b8a;
  color: white;
}

.btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  opacity: 0.9;
}

.no-documents-text {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 1rem;
}
</style>