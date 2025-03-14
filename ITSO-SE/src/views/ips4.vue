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
      <!-- Two Column Layout -->
      <div class="two-column-layout">
        <!-- Left Column -->
        <div class="column">
          <div class="section-container">
            <h2 class="section-title">Basic Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Title</div>
                <div class="review-value">{{ formData.title || 'Not provided' }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Category</div>
                <div class="review-value">{{ formData.category || 'Not selected' }}</div>
              </div>
            </div>
          </div>

          <div class="section-container">
            <h2 class="section-title">Inventor Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Full Name</div>
                <div class="review-value">{{ formData.fullName || 'Not provided' }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Email</div>
                <div class="review-value">{{ formData.email || 'Not provided' }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Contact Number</div>
                <div class="review-value">{{ formData.contactNumber || 'Not provided' }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Department</div>
                <div class="review-value">{{ formData.department || 'Not selected' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="column">
          <div class="section-container">
            <h2 class="section-title">Uploaded Documents</h2>
            <div class="documents-list">
              <div class="document-item" :class="{ 'document-missing': !formData.mainDocument }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formData.mainDocument ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Main Document</div>
                  <div v-if="formData.mainDocument" class="document-filename">
                    {{ formData.mainDocument.name }}
                    <button class="view-btn" @click="viewDocument('main')">View</button>
                  </div>
                  <div v-else class="document-missing-text">Document not uploaded</div>
                </div>
              </div>

              <div class="document-item" :class="{ 'document-optional': !formData.additionalDocument }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formData.additionalDocument ? 'icon-check' : 'icon-optional'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Additional Document</div>
                  <div v-if="formData.additionalDocument" class="document-filename">
                    {{ formData.additionalDocument.name }}
                    <button class="view-btn" @click="viewDocument('additional')">View</button>
                  </div>
                  <div v-else class="document-optional-text">Optional document</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation Section -->
          <div class="confirmation-section">
            <label class="checkbox-label">
              <input type="checkbox" v-model="confirmSubmission">
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">I confirm that all the information provided is accurate and complete</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons - Now inside main-content -->
      
    </div>
    <!-- Move the form-buttons div outside of main-content and make it fixed at bottom -->
    <div class="fixed-buttons">
      <button class="btn btn-back" @click="goBack">Back</button>
      <button 
        class="btn btn-next" 
        :disabled="!confirmSubmission"
        @click="goNext"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const confirmSubmission = ref(false);

// Progress bar data
const steps = ref([
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Document" },
  { id: 3, label: "Documents Checklist" },
  { id: 4, label: "Review" }
]);

const currentStep = ref(4);

// Mock form data - Replace with your actual form store data
const formData = ref({
  title: 'Example Project Title',
  category: 'Research',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  contactNumber: '+1234567890',
  department: 'Engineering',
  mainDocument: { name: 'document.pdf' },
  additionalDocument: null
});

const goBack = () => {
  router.push('/ips3');
};

const goNext = () => {
  router.push('/');
};

const viewDocument = (type) => {
  // Implement document viewing logic
  console.log(`Viewing ${type} document`);
};

const submitForm = async () => {
  if (!confirmSubmission.value) {
    return;
  }

  try {
    // Implement your form submission logic here
    console.log('Submitting form...');
    // On success, redirect to confirmation page
    router.push('/submission-success');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred while submitting the form. Please try again.');
  }
};
</script>

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
</style>