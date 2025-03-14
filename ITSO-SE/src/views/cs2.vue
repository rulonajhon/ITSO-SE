<template>
  <div class="page-wrapper">
    <!-- Main Content -->
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Submission Progress</h1>
    
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step">
              <div class="step-circle">1</div>
              <div class="step-label">Application Information</div>
            </div>
            <div class="progress-step active">
              <div class="step-circle">2</div>
              <div class="step-label">Documents</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">3</div>
              <div class="step-label">Review</div>
            </div>
          </div>
        </div>
    
        <!-- Form Content -->
        <form @submit.prevent="submitForm">
          <!-- Section 5: Attachments -->
          <div class="form-section">
            <h2 class="section-title">5. Attachments</h2>
            
            <div class="document-section">
              <h3 class="document-title">Event/Publication Guidelines</h3>
              <div class="upload-box">
                <div class="upload-info">
                  <div class="upload-text">Upload Document</div>
                  <div class="file-type">Only PDF files are accepted</div>
                </div>
                <div class="upload-actions">
                  <button type="button" class="btn btn-check">Check Document</button>
                  <button type="button" class="btn btn-upload" @click="triggerFileUpload('guidelinesFile')">Upload</button>
                  <input 
                    type="file" 
                    ref="guidelinesFile" 
                    class="hidden-file-input" 
                    accept=".pdf" 
                    @change="handleFileUpload('guidelines')"
                  />
                </div>
              </div>
            </div>
            
            <div class="document-section">
              <h3 class="document-title">Documents</h3>
              <div class="upload-box">
                <div class="upload-info">
                  <div class="upload-text">Upload Document</div>
                  <div class="file-type">Only PDF files are accepted</div>
                </div>
                <div class="upload-actions">
                  <button type="button" class="btn btn-check">Check Document</button>
                  <button type="button" class="btn btn-upload" @click="triggerFileUpload('documentsFile')">Upload</button>
                  <input 
                    type="file" 
                    ref="documentsFile" 
                    class="hidden-file-input" 
                    accept=".pdf" 
                    @change="handleFileUpload('documents')"
                  />
                </div>
              </div>
            </div>
            
            <div class="document-section">
              <h3 class="document-title">Request Document</h3>
              <div class="upload-box">
                <div class="upload-info">
                  <div class="upload-text">Upload Document</div>
                  <div class="file-type">Only PDF files are accepted</div>
                </div>
                <div class="upload-actions">
                  <button type="button" class="btn btn-view">View Sample Format</button>
                  <button type="button" class="btn btn-upload" @click="triggerFileUpload('requestFile')">Upload</button>
                  <input 
                    type="file" 
                    ref="requestFile" 
                    class="hidden-file-input" 
                    accept=".pdf" 
                    @change="handleFileUpload('request')"
                  />
                </div>
              </div>
            </div>
            
            <div class="document-section">
              <h3 class="document-title">Additional Document (If necessary)</h3>
              <div class="upload-box">
                <div class="upload-info">
                  <div class="upload-text">Upload Document</div>
                  <div class="file-type">Only PDF files are accepted</div>
                </div>
                <div class="upload-actions">
                  <button type="button" class="btn btn-view">View Document</button>
                  <button type="button" class="btn btn-upload" @click="triggerFileUpload('additionalFile')">Upload</button>
                  <input 
                    type="file" 
                    ref="additionalFile" 
                    class="hidden-file-input" 
                    accept=".pdf" 
                    @change="handleFileUpload('additional')"
                  />
                </div>
              </div>
            </div>
            
            <div class="below-buttons">
              <button type="button" class="btn btn-back" @click="goBack">Back</button>
              <button type="button" class="btn btn-next" @click="goNext">Next</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// File upload references
const guidelinesFile = ref(null);
const documentsFile = ref(null);
const requestFile = ref(null);
const additionalFile = ref(null);

// Form data
const formData = ref({
  guidelines: null,
  documents: null,
  request: null,
  additional: null
});

// Trigger file input click
const triggerFileUpload = (refName) => {
  if (refName && refs[refName]) {
    refs[refName].value.click();
  }
};

// Handle file upload
const handleFileUpload = (type) => {
  const fileInputRef = {
    'guidelines': guidelinesFile,
    'documents': documentsFile,
    'request': requestFile,
    'additional': additionalFile
  }[type];
  
  if (fileInputRef.value && fileInputRef.value.files.length > 0) {
    const file = fileInputRef.value.files[0];
    if (file.type === 'application/pdf') {
      formData.value[type] = file;
      console.log(`${type} file uploaded:`, file.name);
    } else {
      alert('Only PDF files are accepted');
      fileInputRef.value.value = ''; // Clear the input
    }
  }
};

// Navigation functions
const goNext = () => {
  // Save form data and navigate to next step
  console.log('Form data:', formData.value);
  router.push('/cs3'); // Assuming cs3 is the review page
};

const goBack = () => {
  // Navigate back to previous step
  router.push('/cs1'); // Assuming cs1 is the application information page
};
</script>

<style>
/* Reset and Global Styles */
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: white;
}

/* Page Wrapper */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Content Container */
.content-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
  margin-top: 2rem;
  padding-bottom: 100px;
}

/* Form Container */
.form-container {
  max-width: 600px;
  width: 100%;
  padding: 20px;
}

.form-title {
  color: #ff6b8a;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/* Progress bar container */
.progress-container {
  margin-bottom: 30px;
  position: relative;
}

/* Progress bar - controls the horizontal line */
.progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px; /* Space for the line */
}

/* Progress bar line - Extends to Documents (step 2) */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 65%; /* Adjusted to match Documents step */
  height: 10px;
  background-color: #ff6b8a;
  border-radius: 4px;
  z-index: 1;
}

/* Inactive part of the line */
.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 65%; /* Start after the highlighted part */
  width: 35%; /* Remaining part stays gray */
  height: 10px;
  background-color: #ddd;
  border-radius: 4px;
  z-index: 0;
}

/* Step container */
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

/* Default inactive step */
.progress-step .step-circle {
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

/* Active step styling */
.progress-step.active .step-circle {
  background-color: #ff6b8a;
  color: white;
}

/* Step labels */
.progress-step .step-label {
  color: #999;
  font-size: 11px;
  text-align: center;
  font-weight: 400;
  max-width: 80px;
  line-height: 1.2;
}

/* Active step label */
.progress-step.active .step-label {
  color: #ff6b8a;
  font-weight: 700;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 20px;
}

.section-title {
  color: #ff6b8a;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 500;
}

/* Document Section Styles */
.document-section {
  margin-bottom: 20px;
}

.document-title {
  color: #ff6b8a;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 500;
}

/* Upload Box Styles */
.upload-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
}

.upload-info {
  flex: 1;
}

.upload-text {
  color: #ff6b8a;
  font-weight: 500;
  margin-bottom: 5px;
}

.file-type {
  color: #999;
  font-size: 12px;
}

.upload-actions {
  display: flex;
  gap: 10px;
}

/* Button Styles */
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.btn-check {
  background-color: #ff6b8a;
  color: white;
}

.btn-upload {
  background-color: #ff6b8a;
  color: white;
}

.btn-view {
  background-color: #ff6b8a;
  color: white;
}

.btn-back {
  background-color: #ff6b8a;
  color: white;
  padding: 10px 30px;
  font-size: 16px;
}

.btn-next {
  background-color: #ff6b8a;
  color: white;
  padding: 10px 30px;
  font-size: 16px;
}

.btn:hover {
  opacity: 0.9;
}

/* Hidden file input */
.hidden-file-input {
  display: none;
}

/* Navigation buttons container */
.below-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
}
</style>