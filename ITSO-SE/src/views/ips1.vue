<template>
  <div class="page-wrapper">
    <div class="content-container">
      <div class="form-container">
        <h1 class="form-title">Publication Participation Form</h1>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="ips1-progress-bar">
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
        <form @submit.prevent="goNext">
          <div class="form-section">
            <h2 class="section-title">1. Applicant Information</h2>

            <div class="form-group">
              <label>Title of Research</label> <!-- ✅ NEW FIELD -->
              <input type="text" v-model="form.title" required />
            </div>

            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="form.fullName" required />
            </div>

            <div class="form-group">
              <label>Position</label> <!-- ✅ CHANGED -->
              <input type="text" v-model="form.position" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="form.email" required />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Contact Number</label>
                <input type="tel" v-model="form.contactNumber" required />
              </div>

              <div class="form-group half">
                <label>Department</label>
                <div class="select-wrapper">
                  <select v-model="form.department" required>
                    <option value="" disabled>Select Department</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Junior Highschool">Junior Highschool</option>
                    <option value="Senior Highschool">Senior Highschool</option>
                    <option value="College of Accounting and Business Education">College of Accounting and Business Education</option>
                    <option value="College of Arts and Humanities">College of Arts and Humanities</option>
                    <option value="College of Computer Studies">College of Computer Studies</option>
                    <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
                    <option value="College of Human Environment Science and Food Studies">College of Human Environment Science and Food Studies</option>
                    <option value="College of Medical and Biological Sciences">College of Medical and Biological Sciences</option>
                    <option value="College of Music">College of Music</option>
                    <option value="College of Nursing">College of Nursing</option>
                    <option value="College of Pharmacy and Chemistry">College of Pharmacy and Chemistry</option>
                    <option value="College of Teacher Education">College of Teacher Education</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed buttons -->
          <div class="form-buttons">
            <button type="button" class="btn btn-back" @click="goBack">Back</button>
            <button type="submit" class="btn btn-next">Next</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useFormStore } from '@/stores/formStoreips';

const router = useRouter();
const form = useFormStore();

const goNext = () => {
  router.push('/ips2');
};

const goBack = () => {
  router.push('/disclaimer');
};

const saveDraft = () => {
  console.log('Saving draft...');
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

/* Progress Bar */
.progress-container {
  margin-bottom: 30px;
  position: relative;
}

/* Progress bar - controls the horizontal line */
.ips1-progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px;
}

/* Progress bar line - Only extends to Basic Information */
.ips1-progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 10px;
  background-color: #ff6b8a;
  border-radius: 4px;
  z-index: 1;
}

/* Inactive part of the line */
.ips1-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 30%;
  width: 70%;
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

/* Form Buttons */
.form-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
  z-index: 100;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-save {
  background-color: #ff6b8a;
  color: white;
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

.add-author {
  background-color: #FF8BA7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>