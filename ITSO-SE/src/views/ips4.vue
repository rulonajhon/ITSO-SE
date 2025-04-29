<template>
  <div class="page-container">
    <h1 class="form-title">Review Submission</h1>

    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div v-for="step in steps" :key="step.id" class="progress-step" :class="{ active: step.id <= currentStep }">
          <div class="step-circle">{{ step.id }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-content">
      <div class="two-column-layout">
        <!-- Left Column -->
        <div class="column">
          <div class="section-container">
            <h2 class="section-title">Applicant Information</h2>
            <div class="review-grid">
              <div class="review-item" v-for="(value, label) in {
                'Title of Research': formData.title,
                'Full Name': formData.fullName,
                'Position': formData.position,
                'Email': formData.email,
                'Contact Number': formData.contactNumber,
                'Department': formData.department
              }" :key="label">
                <div class="review-label">{{ label }}</div>
                <div class="review-value">{{ value || 'Not provided' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column">
          <div class="section-container">
            <h2 class="section-title">Uploaded Documents</h2>
            <div class="documents-list">
              <div class="document-item" :class="{ 'document-missing': !formData.uploadedFiles.length }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formData.uploadedFiles.length > 0 ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Uploaded Documents</div>
                  <div v-if="formData.uploadedFiles.length > 0" v-for="(file, index) in formData.uploadedFiles" :key="index">
                    <div class="document-filename">
                      {{ getFileName(file) }}
                      <button class="view-btn" @click="viewDocument(file)">View</button>
                    </div>
                  </div>
                  <div v-else class="document-missing-text">No documents uploaded</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation Section -->
          <div class="confirmation-section">
            <label class="checkbox-label">
              <input type="checkbox" v-model="confirmSubmission" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">I confirm that all the information provided is accurate and complete</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-spinner-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Uploading Files... {{ uploadProgress }}%</div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="error-alert">
      <div class="error-message">
        <strong>Error:</strong> {{ errorMessage }}
        <button class="close-error" @click="errorMessage = ''">×</button>
      </div>
    </div>

    <!-- Fixed Bottom Buttons -->
    <div class="fixed-buttons">
      <button class="btn btn-back" @click="goBack">Back</button>
      <button class="btn btn-next" :disabled="!confirmSubmission || isLoading" @click="goNext">Submit</button>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">Submission Successful!</h2>
        <p>Your submission has been successfully completed. You will be redirected to the home page shortly.</p>
        <button class="btn btn-close" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFormStore } from '@/stores/formStoreips';
import { db, storage, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const formStore = useFormStore();
const confirmSubmission = ref(false);
const currentUser = ref(null);
const isLoading = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref('');
const uploadProgress = ref(0);

const steps = ref([
  { id: 1, label: "Applicant Information" },
  { id: 2, label: "Document Upload" },
  { id: 3, label: "Checklist" },
  { id: 4, label: "Review" }
]);

const currentStep = ref(4);

const formData = ref({
  title: formStore.title,
  fullName: formStore.fullName,
  position: formStore.position,
  email: formStore.email,
  contactNumber: formStore.contactNumber,
  department: formStore.department,
  applicationType: formStore.applicationType,
  uploadedFiles: formStore.uploadedFiles || []
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user;
    } else {
      router.push('/login');
    }
  });
});

const goBack = () => {
  router.push('/ips3');
};

const closeModal = () => {
  showSuccessModal.value = false;
  router.push('/');
};

// Helper function to get file name regardless of file object type
const getFileName = (file) => {
  if (file instanceof File) {
    return file.name;
  } else if (file && typeof file === 'object') {
    // Handle nested file objects
    if (file.file instanceof File) {
      return file.file.name;
    } else if (file.name) {
      return file.name;
    }
  }
  return 'Unknown file';
};

// Function to read file as ArrayBuffer - this is crucial for binary files like PDFs
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error(`Not a valid file object: ${getFileName(file)}`));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const goNext = async () => {
  if (!confirmSubmission.value || isLoading.value) return;
  
  if (!currentUser.value) {
    errorMessage.value = 'Authentication required. Please log in.';
    return;
  }

  try {
    isLoading.value = true;
    uploadProgress.value = 0;
    const pdfUrls = [];

    const maxFileSizeMB = 5;

    if (!formData.value.uploadedFiles || formData.value.uploadedFiles.length === 0) {
      errorMessage.value = 'No files uploaded. Please upload a PDF file.';
      isLoading.value = false;
      return;
    }

    // Generate a submission ID for organization in storage
    const submissionId = `sub_${Date.now()}`;

    for (const file of formData.value.uploadedFiles) {
      // Get the actual file object which might be nested
      let actualFile = file;
      
      // Handle the case where file is wrapped in a Proxy object with a file property
      if (file && typeof file === 'object' && file.file instanceof File) {
        actualFile = file.file;
        console.log(`Found nested file object: ${actualFile.name}`);
      } 
      // If file itself isn't a Blob but has a URL (already uploaded)
      else if (!(file instanceof Blob) && file && typeof file === 'object' && file.url) {
        pdfUrls.push({ name: file.name, url: file.url });
        continue;
      }
      // If we still don't have a valid file object
      else if (!(actualFile instanceof Blob)) {
        console.warn(`Skipping invalid file object:`, file);
        continue;
      }

      // Validate the file using the actual file object
      const fileExtension = actualFile.name.split('.').pop().toLowerCase();
      
      if (fileExtension !== 'pdf') {
        errorMessage.value = `The file "${actualFile.name}" is not a valid PDF.`;
        isLoading.value = false;
        return;
      }
      
      if (actualFile.size > maxFileSizeMB * 1024 * 1024) {
        errorMessage.value = `The file "${actualFile.name}" exceeds the ${maxFileSizeMB}MB size limit.`;
        isLoading.value = false;
        return;
      }

      try {
        // Read file as ArrayBuffer - this is critical for binary files like PDFs
        const fileBuffer = await readFileAsArrayBuffer(actualFile);

        // Prepare sanitized file name and path
        const sanitizedFileName = actualFile.name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
        const filePath = `submissions/ipapplication/${currentUser.value.uid}/${submissionId}/${Date.now()}_${sanitizedFileName}`;
        const fileRef = storageRef(storage, filePath);

        // Set proper PDF metadata - explicitly for PDF
        const metadata = {
          contentType: 'application/pdf',
        };

        // Upload the file buffer directly
        const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              uploadProgress.value = progress;
              console.log(`Upload is ${progress}% done for ${actualFile.name}`);
            },
            (error) => {
              console.error('Error during upload:', error);
              errorMessage.value = `Error uploading file "${actualFile.name}": ${error.message}`;
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                pdfUrls.push({ name: actualFile.name, url: downloadURL });
                console.log(`File uploaded successfully: ${actualFile.name} with URL: ${downloadURL}`);
                resolve();
              } catch (error) {
                console.error('Error getting download URL:', error);
                errorMessage.value = `Error retrieving URL for file "${actualFile.name}": ${error.message}`;
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        console.error('Error reading file:', error);
        errorMessage.value = `Error reading file "${getFileName(file)}": ${error.message}`;
        isLoading.value = false;
        return;
      }
    }

    // If no files were successfully processed
    if (pdfUrls.length === 0) {
      errorMessage.value = 'No valid files to upload. Please add PDF files.';
      isLoading.value = false;
      return;
    }

    // Create the submission data object with all necessary information
    const submissionData = {
      userId: currentUser.value.uid,
      submissionId: submissionId,
      title: formData.value.title,
      fullName: formData.value.fullName,
      position: formData.value.position,
      email: formData.value.email,
      contactNumber: formData.value.contactNumber,
      department: formData.value.department,
      applicationType: formData.value.applicationType || 'IP Protection',
      uploadedDocuments: pdfUrls,
      createdAt: serverTimestamp(),
      status: 'Pending'
    };

    // Add the document to Firestore
    await addDoc(collection(db, 'submissions'), submissionData);
    console.log('Submission added to Firestore successfully with documents:', pdfUrls);
    
    // Reset the form and show success modal
    formStore.resetForm();
    showSuccessModal.value = true;

  } catch (error) {
    console.error('Submission error:', error);
    errorMessage.value = `Submission error: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const viewDocument = (file) => {
  try {
    if (file instanceof File) {
      // For locally stored files that haven't been uploaded yet
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } else if (file.url) {
      // For files that have already been uploaded and have a URL
      window.open(file.url, '_blank');
    } else {
      errorMessage.value = 'Unable to preview this file.';
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    errorMessage.value = `Error viewing file: ${error.message}`;
  }
};
</script>


<style scoped>
/* Add these styles for error message and progress display */
.error-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-error {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  color: #721c24;
}

/* Your existing styles here... */
</style>

<style scoped>
/* Add your spinner style */
.loading-spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 100;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
}

/* Success Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.btn-close {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #5cb85c;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;}
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
</style>