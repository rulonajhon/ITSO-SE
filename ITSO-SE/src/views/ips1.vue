<template>
  <div class="page-wrapper">
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Publication Participation Form</h1>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step active">
              <div class="step-circle">1</div>
              <div class="step-label">Application Information</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">2</div>
              <div class="step-label">Documents</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">3</div>
              <div class="step-label">Document Checklist</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">4</div>
              <div class="step-label">Review</div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="submitForm">
          <!-- Section 1: Applicant Information -->
          <div class="form-section">
            <h2 class="section-title">1. Applicant Information</h2>

            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="formData.fullName" required />
            </div>

            <div class="form-group">
              <label>Position/Title</label>
              <input type="text" v-model="formData.position" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="formData.email" required />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Contact Number</label>
                <input type="tel" v-model="formData.contactNumber" required />
              </div>

              <div class="form-group half">
                <label>Department</label>
                <div class="select-wrapper">
                  <select v-model="formData.department" required>
                    <option value="" disabled selected>Select Department</option>
                    <option value="engineering">Engineering</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                    <option value="business">Business</option>
                    <option value="medicine">Medicine</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed buttons at the bottom -->
          <div class="fixed-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button type="submit" class="btn btn-next">Next</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase'; // Ensure Firebase is configured
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const router = useRouter();

const formData = ref({
  fullName: '',
  position: '',
  email: '',
  contactNumber: '',
  department: '',
  activityType: 'research',
  eventName: '',
  eventDate: '',
  eventLocation: '',
  organizer: '',
  projectTitle: '',
  projectDescription: '',
  ipProtection: 'with',
});

const submitForm = async () => {
  try {
    await addDoc(collection(db, 'submissions'), {
      ...formData.value,
      createdAt: serverTimestamp(), // Add timestamp
    });
    alert('Submission Successful!');
    router.push('/ips2'); // Redirect to next step
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Submission failed. Please try again.');
  }
};

const goBack = () => {
  router.push('/disclaimer');
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
  padding-bottom: 80px; /* Add padding to prevent content from being hidden behind fixed buttons */
}

/* Update the content-container class to add margin-top */
.content-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
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

/* Progress bar line - Only extends to Basic Information */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 0; /* Align with step circles */
  left: 0;
  width: 30%; /* Adjusted to match Basic Information step */
  height: 10px; /* Thicker line */
  background-color: #ff6b8a; /* Highlighted color */
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
  background-color: #ddd; /* Gray for inactive */
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 8px;
}

/* Highlight only Basic Information step */
.progress-step.active .step-circle {
  background-color: #ff6b8a;
  color: white;
}

/* Inactive step labels should be gray */
.progress-step .step-label {
  color: #999;
  font-size: 11px;
  text-align: center;
  font-weight: 400;
  max-width: 80px;
  line-height: 1.2;
}

/* Highlight Basic Information label */
.progress-step.active .step-label {
  color: #ff6b8a;
  font-weight: 700;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 30px;
}

.section-title {
  color: #ff6b8a;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #ff6b8a;
  font-size: 14px;
}

input[type='text'],
input[type='email'],
input[type='tel'],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Select Dropdown Styling */
.select-wrapper {
  position: relative;
}

select {
  appearance: none;
  padding-right: 30px;
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6b8a;
  font-size: 10px;
  pointer-events: none;
}

/* Radio Button Styling */
.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
}

.radio-label input[type='radio'] {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ff6b8a;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.radio-custom::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff6b8a;
  opacity: 0;
  transition: opacity 0.2s;
}

.radio-label input[type='radio']:checked + .radio-custom::after {
  opacity: 1;
}

/* Fixed Buttons */
.fixed-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
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
  transition: background-color 0.3s;
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