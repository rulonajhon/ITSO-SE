<template>
  <div class="page-wrapper">
    <!-- Main Content -->
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Submission Progress</h1>
    
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step active">
              <div class="step-circle">1</div>
              <div class="step-label">Basic Information</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">2</div>
              <div class="step-label">Documents</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">3</div>
              <div class="step-label">Review</div>
            </div>
            <div class="progress-step">
              <div class="step-circle">4</div>
              <div class="step-label">Complete</div>
            </div>
          </div>
        </div>
    
        <!-- Form Content -->
        <form @submit.prevent="submitForm">
          <div class="form-section">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="formData.title" required />
            </div>

            <div class="form-group">
              <label>Category</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="formData.category" value="research" />
                  <span class="radio-custom"></span>
                  Research
                </label>

                <label class="radio-label">
                  <input type="radio" v-model="formData.category" value="testing" />
                  <span class="radio-custom"></span>
                  Testing
                </label>

                <label class="radio-label">
                  <input type="radio" v-model="formData.category" value="others" />
                  <span class="radio-custom"></span>
                  Others
                </label>

                <label class="radio-label">
                  <input type="radio" v-model="formData.category" value="software" />
                  <span class="radio-custom"></span>
                  All Software
                </label>
              </div>
            </div>

            <div class="form-section">
              <h2 class="section-title">Inmate Information</h2>

              <div class="form-group">
                <label>Full Name</label>
                <input type="text" v-model="formData.fullName" required />
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

            <div class="below-buttons">
              <button type="button" class="btn btn-back" @click="goBack">Back</button>
              <button type="submit" class="btn btn-next">Next</button>
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

const formData = ref({
  title: '',
  category: 'research',
  fullName: '',
  email: '',
  contactNumber: '',
  department: '',
});

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', formData.value);
  router.push('/cs2');
};

const goBack = () => {
  // Handle back navigation
  router.go(-1);
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
  padding-top: 15px;
}

/* Progress bar line - Only extends to Basic Information */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
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
  left: 25%;
  width: 75%;
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
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

/* Buttons */
.below-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
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