<template>
  <div class="page-wrapper">
    <!-- Main Content -->
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
    
        <!-- Review Content -->
        <div class="review-container">
          <!-- Section 1: Applicant Information -->
          <div class="review-section">
            <h2 class="section-title">1. Applicant Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Full Name</div>
                <div class="review-value">{{ formStore.applicantInfo.fullName }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Position/Title</div>
                <div class="review-value">{{ formStore.applicantInfo.position }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Email</div>
                <div class="review-value">{{ formStore.applicantInfo.email }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Contact Number</div>
                <div class="review-value">{{ formStore.applicantInfo.contactNumber }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Department</div>
                <div class="review-value">{{ formStore.applicantInfo.department }}</div>
              </div>
            </div>
          </div>
          
          <!-- Section 2: Event/Public Details -->
          <div class="review-section">
            <h2 class="section-title">2. Event/Public Details</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Type of Activity</div>
                <div class="review-value">{{ formStore.getActivityTypeLabel(formStore.eventDetails.activityType) }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Name of Event/Journal</div>
                <div class="review-value">{{ formStore.eventDetails.eventName }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Date(s) of Event/Submission Deadline</div>
                <div class="review-value">{{ formStore.eventDetails.eventDate }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Location (Venue/Online Platform)</div>
                <div class="review-value">{{ formStore.eventDetails.eventLocation }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">Organizer/Publisher</div>
                <div class="review-value">{{ formStore.eventDetails.organizer }}</div>
              </div>
            </div>
          </div>
          
          <!-- Section 3: Project/Research/Publication Information -->
          <div class="review-section">
            <h2 class="section-title">3. Project/Research/Publication Information</h2>
            <div class="review-grid">
              <div class="review-item">
                <div class="review-label">Title of Project/Research/Paper</div>
                <div class="review-value">{{ formStore.projectInfo.projectTitle }}</div>
              </div>
              <div class="review-item full-width">
                <div class="review-label">Brief Description of Project/Research/Paper</div>
                <div class="review-value description">{{ formStore.projectInfo.projectDescription }}</div>
              </div>
              <div class="review-item">
                <div class="review-label">IP Protection</div>
                <div class="review-value">{{ formStore.projectInfo.ipProtection === 'with' ? 'With IP protection' : 'Without IP protection' }}</div>
              </div>
            </div>
          </div>
          
          <!-- Section 4: Uploaded Documents -->
          <div class="review-section">
            <h2 class="section-title">4. Uploaded Documents</h2>
            <div class="documents-list">
              <div class="document-item" :class="{ 'document-missing': !formStore.documents.guidelines }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formStore.documents.guidelines ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Event/Publication Guidelines</div>
                  <div class="document-filename" v-if="formStore.documents.guidelines">{{ formStore.documents.guidelines.name }}</div>
                  <div class="document-missing-text" v-else>Document not uploaded</div>
                </div>
              </div>
              
              <div class="document-item" :class="{ 'document-missing': !formStore.documents.documents }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formStore.documents.documents ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Documents</div>
                  <div class="document-filename" v-if="formStore.documents.documents">{{ formStore.documents.documents.name }}</div>
                  <div class="document-missing-text" v-else>Document not uploaded</div>
                </div>
              </div>
              
              <div class="document-item" :class="{ 'document-missing': !formStore.documents.request }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formStore.documents.request ? 'icon-check' : 'icon-missing'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Request Document</div>
                  <div class="document-filename" v-if="formStore.documents.request">{{ formStore.documents.request.name }}</div>
                  <div class="document-missing-text" v-else>Document not uploaded</div>
                </div>
              </div>
              
              <div class="document-item" :class="{ 'document-optional': !formStore.documents.additional }">
                <div class="document-icon">
                  <i class="document-status-icon" :class="formStore.documents.additional ? 'icon-check' : 'icon-optional'"></i>
                </div>
                <div class="document-details">
                  <div class="document-name">Additional Document</div>
                  <div class="document-filename" v-if="formStore.documents.additional">{{ formStore.documents.additional.name }}</div>
                  <div class="document-optional-text" v-else>Optional document</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Confirmation Section -->
          <div class="confirmation-section">
            <label class="checkbox-label">
              <input type="checkbox" v-model="confirmSubmission">
              <span class="checkbox-custom"></span>
              I confirm that all the information provided is accurate and complete
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFormStore } from '../stores/formStore';

const router = useRouter();
const formStore = useFormStore();
const confirmSubmission = ref(false);
const isSubmitting = ref(false);

// Navigation functions
const goBack = () => {
  // Go back to documents page (cs2)
  router.push('/cs2');
};

const submitForm = async () => {
  if (!confirmSubmission.value) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Submit the form using the store method
    const result = await formStore.submitForm();
    
    if (result.success) {
      // Show success message
      alert(result.message);
      
      // Reset the form
      formStore.resetForm();
      
      // Redirect to confirmation page or home
      router.push('/submission-confirmation');
    } else {
      // Show error message
      alert(result.message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An unexpected error occurred. Please try again.');
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