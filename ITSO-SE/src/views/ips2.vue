<template>
    <div class="page-wrapper">
  
      <div class="content-container">
        <div class="form-container">
          <h1 class="form-title">Submission Progress</h1>
  
          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar">
              <div v-for="step in steps" :key="step.id" class="progress-step" :class="{ active: step.id <= currentStep }">
                <div class="step-circle">{{ step.id }}</div>
                <div class="step-label">{{ step.label }}</div>
              </div>
            </div>
          </div>
  
          <!-- Upload Sections -->
          <div class="upload-section">
            <div class="upload-box">
              <p class="upload-title">Upload Documents</p>
              <p class="upload-info">Only PDF files are accepted</p>
              <p class="upload-info">Combine all drawing page(s) into one (1) PDF file</p>
              <input type="file" accept=".pdf" @change="handleFileUpload($event, 'main')" hidden ref="mainFileInput" />
              <button class="upload-btn" @click="triggerFileInput('main')">Upload</button>
            </div>
  
            <div class="upload-box">
              <p class="upload-title">Upload Additional Documents (if necessary)</p>
              <p class="upload-info">Only PDF files are accepted</p>
              <input type="file" accept=".pdf" @change="handleFileUpload($event, 'additional')" hidden ref="additionalFileInput" />
              <button class="upload-btn" @click="triggerFileInput('additional')">Upload</button>
            </div>
          </div>
  
          <!-- Navigation Buttons -->
          <div class="form-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button type="button" class="btn btn-next" @click="goNext">Next</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const steps = ref([
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Document" },
    { id: 3, label: "Documents Checklist" },
    { id: 4, label: "Review" },
  ]);
  
  const currentStep = ref(2);
  const mainFile = ref(null);
  const additionalFile = ref(null);
  const mainFileInput = ref(null);
  const additionalFileInput = ref(null);
  
  const triggerFileInput = (type) => {
    if (type === "main") mainFileInput.value.click();
    else additionalFileInput.value.click();
  };
  
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      if (type === "main") mainFile.value = file;
      else additionalFile.value = file;
      console.log(`Uploaded ${type} file:`, file.name);
    } else {
      alert("Only PDF files are accepted.");
    }
  };

  const goBack = () => {
    router.push('/ips1'); // Redirect to ips1.vue
  };

  const goNext = () => {
    router.push('/ips3'); // Redirect to ips3.vue
  };
  
  const prevStep = () => {
    currentStep.value = 1;
  };
  
  const nextStep = () => {
    currentStep.value = 3;
  };
  </script>
  
  <style>
  /* Basic styling */
  .page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
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
    margin-bottom: 100px;
  }
  
  .progress-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 30px;
  }
  
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  
  .step-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ddd;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .progress-step.active .step-circle {
    background-color: #ff6b8a;
    color: white;
  }
  
  .step-label {
    font-size: 12px;
    text-align: center;
    color: #999;
  }
  
  .progress-step.active .step-label {
    color: #ff6b8a;
    font-weight: bold;
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
    border: 2px solid #ff6b8a;
    border-radius: 8px;
    background-color: #fff;
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
  
  /* Buttons */
  .form-buttons {
    display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  }
  
  .btn {
    padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  }
  
  .btn:disabled {
    background-color: #ddd;
  }
  .btn-back {
  background-color: #ff6b8a;
  color: white;
}

.btn-next {
  background-color: #ff6b8a;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
  </style>
  