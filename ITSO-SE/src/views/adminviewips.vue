<template>
  <div class="page-container">
    <h1 class="form-title">Review Submission</h1>

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
              <div class="review-item">
                <div class="review-label">Category</div>
                <div class="review-value">{{ formData.category }}</div>
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
              <div v-for="(document, index) in formData.uploadedDocuments" :key="index" class="document-item">
                <div class="document-icon">
                  <i class="document-status-icon" :class="document.url ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">{{ document.name }}</div>
                  <div v-if="document.url" class="document-filename">
                    <button class="view-btn" @click="viewDocument(document.url)">View</button>
                    <a :href="document.url" class="download-btn" download>Download</a>
                  </div>
                  <div v-else class="document-missing-text">Document not uploaded</div>
                </div>
              </div>
            </div>
            <div v-if="formData.uploadedDocuments.length === 0" class="no-documents-text">
              No documents available.
            </div>
          </div>

          <!-- Review Section -->
          <div class="section-container">
            <h2 class="section-title">Review</h2>
            <div class="review-options">
              <label><input type="radio" value="Endorsed" v-model="reviewStatus" /> Endorsed</label>
              <label><input type="radio" value="Not Endorsed" v-model="reviewStatus" /> Not Endorsed</label>
            </div>
            <div v-if="reviewStatus === 'Not Endorsed'" class="reason-box">
              <label class="review-label">Reason/s (if not endorsed):</label>
              <textarea v-model="reviewReason" rows="4" placeholder="Enter reason here..."></textarea>
            </div>
            <div class="confirmation-box">
              <label><input type="checkbox" v-model="confirmSubmission" /> I confirm this review is final and ready to submit.</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed-buttons">
      <button class="btn btn-back" @click="goBack">Back</button>
      <button class="btn btn-next" :disabled="!confirmSubmission || !reviewStatus" @click="submitForm">Submit</button>
    </div>

    <!-- PDF Viewer Modal -->
    <div v-if="showViewer" class="modal-overlay" @click.self="closeViewer">
      <div class="modal-content">
        <iframe :src="selectedDocumentUrl" class="pdf-frame"></iframe>
        <button class="close-btn" @click="closeViewer">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

const route = useRoute();
const router = useRouter();

const formData = ref({
  title: '',
  category: '',
  fullName: '',
  email: '',
  contactNumber: '',
  department: '',
  uploadedDocuments: []
});

const reviewStatus = ref('');
const reviewReason = ref('');
const confirmSubmission = ref(false);

let submissionCollection = 'submissions';
let docRef = null;

const selectedDocumentUrl = ref(null);
const showViewer = ref(false);

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

const submitForm = async () => {
  try {
    await updateDoc(docRef, {
      status: reviewStatus.value,
      reason: reviewStatus.value === 'Not Endorsed' ? reviewReason.value : '',
      reviewedAt: new Date()
    });
    router.push('/submission-confirmation');
  } catch (e) {
    console.error('Review submission failed:', e);
    alert('Failed to submit review.');
  }
};

const goBack = () => {
  router.push('/adminips');
};

const loadSubmission = async () => {
  const id = route.params.id;
  const storage = getStorage();
  let folderPath = '';
  let userId = id;

  docRef = doc(db, 'submissions', id);
  let docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    docRef = doc(db, 'competition', id);
    docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      alert('Submission not found.');
      return router.push('/adminips');
    } else {
      submissionCollection = 'competition';
      folderPath = 'submissions/competition/';
    }
  } else {
    folderPath = 'submissions/ipapplication/';
  }

  const data = docSnap.data();
  formData.value.title = data.title || data.fileName || '';
  formData.value.category = submissionCollection === 'competition' ? 'Competition & Publication' : 'IP Submission';
  formData.value.fullName = data.fullName || '';
  formData.value.email = submissionCollection === 'competition' ? data.userEmail || '' : data.email || data.uploaderEmail || '';
  formData.value.contactNumber = data.contactNumber || '';
  formData.value.department = data.department || '';
  userId = data.userId || id;

  const uploadedDocs = data.uploadedDocuments || [];
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
};

onMounted(loadSubmission);
</script>

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
</style>


  
  <style scoped>
  /* Add your styles here or import a CSS file */
  .confirmation-box {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  .fixed-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background: white;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  
  
  <style scoped>
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
  
  .view-btn {
    padding: 2px 8px;
    background: #ff6b8a;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 11px;
    cursor: pointer;
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
  
  /* Confirmation Section */
  .confirmation-section {
    margin-bottom: 20px;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #ff6b8a;
    border-radius: 4px;
    margin-right: 10px;
    position: relative;
  }
  
  .checkbox-label input[type="checkbox"] {
    display: none;
  }
  
  .checkbox-custom::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 6px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
    background-color: #ff6b8a;
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
    opacity: 1;
  }
  
  .checkbox-text {
    font-size: 14px;
    color: #333;
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
  .review-options {
    display: flex;
    justify-content: center; /* Center the radio buttons horizontally */
    gap: 20px;
    margin-bottom: 10px;
  }
  
  .review-options label {
    font-size: 16px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .review-options input[type="radio"] {
    transform: scale(1.2);
    accent-color: #ff6b8a;
  }
  
  </style>