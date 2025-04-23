<template>
  <div class="page-wrapper">
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Submission Progress</h1>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="ips2-progress-bar">
            <div v-for="step in steps" :key="step.id" 
                 :class="['progress-step', step.id <= currentStep ? 'active' : '']">
              <div class="step-circle">{{ step.id }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
        </div>

        <!-- Upload Sections -->
        <div class="upload-section">
          <div class="upload-box">
            <div class="upload-content">
              <p v-if="mainFile" class="upload-title">{{ mainFile.name }}</p>
              <template v-else>
                <p class="upload-title">Upload Main Document</p>
                <p class="upload-info">Only PDF files are accepted</p>
                <p class="upload-info">Combine all drawing page(s) into one (1) PDF file</p>
              </template>
            </div>
            <button class="upload-btn" @click="triggerFileInput('main')">Upload</button>
          </div>
          <input type="file" accept=".pdf" @change="handleFileUpload($event, 'main')" hidden ref="mainFileInput" />

          <div class="upload-box">
            <div class="upload-content">
              <p v-if="additionalFile" class="upload-title">{{ additionalFile.name }}</p>
              <template v-else>
                <p class="upload-title">Upload Additional Documents (if necessary)</p>
                <p class="upload-info">Only PDF files are accepted</p>
              </template>
            </div>
            <button class="upload-btn" @click="triggerFileInput('additional')">Upload</button>
          </div>
          <input type="file" accept=".pdf" @change="handleFileUpload($event, 'additional')" hidden ref="additionalFileInput" />

          <button class="add-file-btn" @click="addAdditionalUpload">+ Add Another File</button>
          
          <!-- Buttons -->
          <div class="form-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button type="button" class="btn btn-next" @click="goNext">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFormStore } from '@/stores/formStoreips';

const router = useRouter();
const form = useFormStore();

// Define steps using array for dynamic rendering
const steps = ref([
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Documents" },
  { id: 3, label: "Review" },
  { id: 4, label: "Complete" }
]);

const currentStep = ref(2);

// Bind files to Pinia store
const mainFile = computed({
  get: () => form.mainDocument,
  set: (val) => form.mainDocument = val,
});

const additionalFile = computed({
  get: () => form.additionalDocument,
  set: (val) => form.additionalDocument = val,
});

// Refs for file inputs
const mainFileInput = ref(null);
const additionalFileInput = ref(null);

const triggerFileInput = (type) => {
  if (type === "main") mainFileInput.value.click();
  else if (type === "additional") additionalFileInput.value.click();
};

const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    if (type === "main") {
      mainFile.value = file;
    } else {
      additionalFile.value = file;
    }
  } else {
    alert("Only PDF files are accepted.");
  }
};

// Add functionality for adding additional upload
const addAdditionalUpload = () => {
  // Implementation for adding another file input
  console.log("Adding another file upload");
  // This would typically add another file input to the DOM or track an array of files
};

const goBack = () => router.push('/ips1');
const goNext = () => router.push('/ips3');
</script>

<style>
/* Basic styling */
.page-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  --current-step: 2;
}

.content-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.form-container {
  max-width: 600px;
  width: 100%;
  padding: 20px;
}

.form-title {
  color: #ff6b8a;
  text-align: left;
  font-size: 24px;
  font-weight: bold;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 30px;
  position: relative;
}

/* Progress bar - controls the horizontal line */
.ips2-progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px;
}

/* Progress bar line - Extends to Documents (step 2) */
.ips2-progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12%;
  width: 26%;
  height: 10px;
  background-color: #ff6b8a;
  border-radius: 4px;
  z-index: 1;
}

/* Inactive part of the line */
.ips2-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 25%;
  width: 65%;
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

/* Upload Section */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.upload-box {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.upload-actions {
  display: flex;
  gap: 10px;
}

.upload-title {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b8a;
}

.upload-info {
  font-size: 12px;
  color: #666;
}

.upload-btn {
  background-color: #FF8BA7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.add-file-btn {
  background-color: #FF8BA7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

/* Buttons */
.form-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  position: relative; /* Change from fixed to relative */
  width: 100%;
  padding-bottom: 20px; /* Ensure some spacing at the bottom */
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-back {
  background-color: #ff6b8a;
  color: white;
}

.btn-next {
  background-color: #ff6b8a !important;
  color: white !important;
  padding: 10px 30px !important;
  border-radius: 20px !important;
}

.btn:hover {
  opacity: 0.9;
}
</style>