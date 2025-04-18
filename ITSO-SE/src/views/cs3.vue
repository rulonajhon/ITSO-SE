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
              <div class="step-label">Application Information</div>
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
          <!-- Section 1: Applicant Information -->
          <div class="review-section">
            <h2 class="section-title">1. Applicant Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Full Name</div>
                <div class="review-value">{{ applicantInfo.fullName }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Position/Title</div>
                <div class="review-value">{{ applicantInfo.position }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Email</div>
                <div class="review-value">{{ applicantInfo.email }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Contact Number</div>
                <div class="review-value">{{ applicantInfo.contactNumber }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Department</div>
                <div class="review-value">{{ applicantInfo.department }}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Event/Public Details -->
          <div class="review-section">
            <h2 class="section-title">2. Event/Public Details</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Type of Activity</div>
                <div class="review-value">{{ getActivityLabel(eventDetails.activityType) }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Name of Event/Journal</div>
                <div class="review-value">{{ eventDetails.eventName }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Date(s) of Event/Submission Deadline</div>
                <div class="review-value">{{ eventDetails.eventDate }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Location (Venue/Online)</div>
                <div class="review-value">{{ eventDetails.eventLocation }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Organizer/Publisher</div>
                <div class="review-value">{{ eventDetails.organizer }}</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Project/Research/Publication Information -->
          <div class="review-section">
            <h2 class="section-title">3. Project/Research/Publication Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Title</div>
                <div class="review-value">{{ projectInfo.projectTitle }}</div>
              </div>
              <div class="review-item full-width">
                <div class="review-label">Description</div>
                <div class="review-value">{{ projectInfo.projectDescription }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">IP Protection</div>
                <div class="review-value">
                  {{ projectInfo.ipProtection === 'with' ? 'With IP Protection' : 'Without IP Protection' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Uploaded Documents -->
          <div class="review-section">
            <h2 class="section-title">4. Uploaded Documents</h2>
            <div class="documents-list">
              <div class="document-item" v-for="(file, key) in documents" :key="key">
                <div class="document-icon">
                  <span v-if="file" class="checkmark">✔️</span>
                  <span v-else class="missing">❌</span>
                </div>
                <div class="document-details">
                  <div class="document-name">{{ getFileLabel(key) }}</div>
                  <div v-if="file">{{ file.name }}</div>
                  <div v-else class="document-missing-text">Document not uploaded</div>
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

          <!-- Navigation Buttons -->
          <div class="below-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button 
              type="button" 
              class="btn btn-submit" 
              :disabled="!confirmSubmission || isSubmitting" 
              @click="submitForm"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useFormStore } from '../stores/formStore';

const router = useRouter();
const formStore = useFormStore();
const confirmSubmission = ref(false);
const isSubmitting = ref(false);
const user = ref(null);

// Track authenticated user
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

// Retrieve data from formStore
const applicantInfo = computed(() => formStore.applicantInfo);
const eventDetails = computed(() => formStore.eventDetails);
const projectInfo = computed(() => formStore.projectInfo);
const documents = computed(() => formStore.documents);

// Check if all required documents are uploaded
const isReadyToSubmit = computed(() => {
  return (
    documents.value.guidelines &&
    documents.value.documents &&
    documents.value.request
  );
});

// Get activity label
const getActivityLabel = (type) => {
  const labels = {
    conference: 'Conference',
    journal: 'Journal Publication',
    seminar: 'Seminar',
  };
  return labels[type] || 'Other';
};

// Get document label
const getFileLabel = (key) => {
  const labels = {
    guidelines: 'Event/Publication Guidelines',
    documents: 'Documents',
    request: 'Request Document',
    additional: 'Additional Document',
  };
  return labels[key] || 'Unknown Document';
};

// Go back to previous step
const goBack = () => router.push('/cs2');

// Submit Form
const submitForm = async () => {
  if (!user.value) {
    alert('You must be logged in to submit.');
    return;
  }

  if (!isReadyToSubmit.value) {
    alert('Please upload all required documents before submitting.');
    return;
  }

  if (!confirmSubmission.value) {
    alert('Please confirm your submission.');
    return;
  }

  isSubmitting.value = true;
  try {
    await formStore.submitForm();
    alert('Submission successful!');
    formStore.resetForm();
    router.push('/submission-confirmation');
  } catch (error) {
    alert('Submission failed, please try again.');
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
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