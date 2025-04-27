<template>
  <div class="page-wrapper">
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Review Submission</h1>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step">
              <div class="step-circle">1</div>
              <div class="step-label">Basic Information</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">2</div>
              <div class="step-label">Documents</div>
            </div>
            <div class="progress-step active">
              <div class="step-circle">3</div>
              <div class="step-label">Review</div>
            </div>
          </div>
        </div>

        <!-- Review Section -->
        <div class="review-container">

          <!-- Section 1: Basic Information -->
          <div class="review-section">
            <h2 class="section-title">1. Basic Information</h2>
            <div class="review-grid">
              <div class="review-item" v-for="(value, label) in basicInfoFields" :key="label">
                <div class="review-label">{{ label }}</div>
                <div class="review-value">{{ value }}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Applicant Information -->
          <div class="review-section">
            <h2 class="section-title">2. Applicant Information</h2>
            <div class="review-grid">
              <div class="review-item" v-for="(value, label) in applicantInfoFields" :key="label">
                <div class="review-label">{{ label }}</div>
                <div class="review-value">{{ value }}</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Uploaded Documents -->
          <div class="review-section">
            <h2 class="section-title">3. Uploaded Documents</h2>
            <div class="documents-list">
              <div class="document-item" v-for="(file, key) in formStore.documents" :key="key">
                <div class="document-icon">
                  <span v-if="file" class="checkmark">✔️</span>
                  <span v-else class="missing">❌</span>
                </div>
                <div class="document-details">
                  <div class="document-name">{{ getFileLabel(key) }}</div>
                  <div v-if="file" class="document-filename">{{ file.name }}</div>
                  <div v-else class="document-missing-text">
                    {{ isRequired(key) ? 'Required document not uploaded' : 'Optional document not uploaded' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation Section -->
          <div class="confirmation-section">
            <label class="checkbox-label">
              <input type="checkbox" v-model="confirmSubmission">
              <span class="checkbox-custom"></span>
              I confirm that all the information provided is accurate and complete.
            </label>
          </div>

          <!-- Submission Status -->
          <div v-if="submissionStatus" class="submission-status" :class="submissionStatus.type">
            {{ submissionStatus.message }}
          </div>

          <!-- Navigation Buttons -->
          <div class="below-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button 
              type="button" 
              class="btn btn-submit" 
              :disabled="!confirmSubmission || formStore.isLoading || !isReadyToSubmit" 
              @click="submitForm"
            >
              <span v-if="formStore.isLoading">Submitting...</span>
              <span v-else>Submit</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useFormStore } from '@/stores/formStorecs';

const router = useRouter();
const formStore = useFormStore();
const confirmSubmission = ref(false);
const user = ref(null);
const submissionStatus = ref(null);

// Load saved form data on mount
onMounted(() => {
  formStore.loadSavedData();
});

// Authentication guard
onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
    user.value = currentUser;
    formStore.updateCurrentUser();
  } else {
    router.push('/login');
  }
});

// Computed: fields for Basic Info
const basicInfoFields = computed(() => ({
  'Title': formStore.basicInfo.title,
  'Category': getCategoryLabel(formStore.basicInfo.category)
}));

// Computed: fields for Applicant Info
const applicantInfoFields = computed(() => ({
  'Full Name': formStore.basicInfo.fullName,
  'Email': formStore.basicInfo.email,
  'Contact Number': formStore.basicInfo.contactNumber,
  'Department': getDepartmentLabel(formStore.basicInfo.department)
}));

// Helper: translate category
const getCategoryLabel = (category) => {
  const categories = {
    research: 'Research',
    testing: 'Testing',
    software: 'All Software',
    others: 'Others'
  };
  return categories[category] || 'Unknown Category';
};

// Helper: translate department
const getDepartmentLabel = (dept) => {
  const departments = {
    elementary: 'Elementary',
    juniorHighschool: 'Junior Highschool',
    seniorHighschool: 'Senior Highschool',
    engineering: 'College of Engineering and Architecture',
    science: 'College of Arts and Humanities',
    arts: 'College of Computer Studies',
    business: 'College of Accounting and Business Education',
    human_env: 'College of Human Environment Science and Food Studies',
    medical: 'College of Medical and Biological Sciences',
    music: 'College of Music',
    nursing: 'College of Nursing',
    pharmacy: 'College of Pharmacy and Chemistry',
    education: 'College of Teacher Education'
  };
  return departments[dept] || 'Unknown Department';
};

// Helper: get document label
const getFileLabel = (key) => {
  const labels = {
    guidelines: 'Event/Publication Guidelines',
    documents: 'Documents',
    request: 'Request Document',
    additional: 'Additional Document (Optional)'
  };
  return labels[key] || 'Unknown Document';
};

// Helper: check if document is required
const isRequired = (key) => key !== 'additional';

// Computed: ready to submit (required documents uploaded)
const isReadyToSubmit = computed(() => (
  formStore.documents.guidelines &&
  formStore.documents.documents &&
  formStore.documents.request
));

// Navigation: go back
const goBack = () => {
  router.push('/cs2');
};

// Form submission
const submitForm = async () => {
  if (!user.value) {
    submissionStatus.value = {
      type: 'error',
      message: 'You must be logged in to submit.'
    };
    return;
  }
  if (!isReadyToSubmit.value) {
    submissionStatus.value = {
      type: 'error',
      message: 'Please upload all required documents.'
    };
    return;
  }
  if (!confirmSubmission.value) {
    submissionStatus.value = {
      type: 'error',
      message: 'Please confirm your submission.'
    };
    return;
  }

  try {
    submissionStatus.value = { type: 'pending', message: 'Submitting your entry...' };
    const submissionId = await formStore.submitForm();
    submissionStatus.value = { type: 'success', message: 'Submission successful!' };

    formStore.resetForm();

    setTimeout(() => {
      router.push({ path: '/submission-confirmation', query: { id: submissionId } });
    }, 1500);

  } catch (error) {
    console.error('Error during submission:', error);
    submissionStatus.value = { type: 'error', message: `Submission failed: ${error.message}` };
  }
};
</script>



<style scoped>
.submission-status {
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.submission-status.error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #f87171;
}

.submission-status.success {
  background-color: #d1fae5;
  color: #047857;
  border: 1px solid #6ee7b7;
}

.submission-status.pending {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 1px solid #7dd3fc;
}
</style>


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

/* Progress bar line - Extends to Review (step 3) */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* Full width for step 3 */
  height: 10px;
  background-color: #ff6b8a;
  border-radius: 4px;
  z-index: 1;
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

/* Review Container */
.review-container {
  background-color: #fff;
  border-radius: 8px;
}

/* Review Section */
.review-section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.review-section:last-child {
  border-bottom: none;
}

.section-title {
  color: #ff6b8a;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 500;
}

/* Review Grid */
.review-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.review-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.review-item.full-width {
  grid-column: span 2;
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

.review-value.description {
  white-space: pre-line;
  line-height: 1.4;
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
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid #4CAF50; /* Green for uploaded */
}

.document-item.document-missing {
  border-left-color: #f44336; /* Red for missing */
}

.document-item.document-optional {
  border-left-color: #FFC107; /* Yellow for optional */
}

.document-icon {
  margin-right: 15px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 3px;
}

.document-filename {
  font-size: 12px;
  color: #666;
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
  margin: 25px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
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
  left: 5px;
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

/* Navigation Buttons */
.below-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #ff6b8a;
  color: white;
}

.btn-back {
  background-color: #ff6b8a;
  color: white;
}

.btn-submit {
  background-color: #ff6b8a;
  color: white;
}

.btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn:not(:disabled):hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>