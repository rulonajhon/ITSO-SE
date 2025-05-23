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
              <label>Title of Research</label>
              <input type="text" v-model="form.title" required />
            </div>

            <div class="form-group">
              <label>Full Name</label>
              <input
                type="text"
                v-model="form.fullName"
                placeholder="First Name M.I. Last Name"
                required
              />
            </div>

            <div class="form-group">
              <label>Position</label>
              <div class="select-wrapper">
                <select v-model="form.position" required>
                  <option value="" disabled>Select Position</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Visitor">Visitor</option>
                </select>
                <div class="select-arrow">▼</div>
              </div>
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
                  <select
                    v-model="form.department"
                    :disabled="form.position === 'Visitor'"
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Junior Highschool">Junior Highschool</option>
                    <option value="Senior Highschool">Senior Highschool</option>
                    <option value="Colleges of Accounting and Business Education">
                      Colleges of Accounting and Business Education
                    </option>
                    <option value="Colleges of Arts and Humanities">
                      Colleges of Arts and Humanities
                    </option>
                    <option value="Colleges of Computer Studies">
                      Colleges of Computer Studies
                    </option>
                    <option value="Colleges of Engineering and Architecture">
                      Colleges of Engineering and Architecture
                    </option>
                    <option value="Colleges of Human Environment Science and Food Studies">
                      Colleges of Human Environment Science and Food Studies
                    </option>
                    <option value="Colleges of Medical and Biological Sciences">
                      Colleges of Medical and Biological Sciences
                    </option>
                    <option value="Colleges of Music">Colleges of Music</option>
                    <option value="Colleges of Nursing">Colleges of Nursing</option>
                    <option value="Colleges of Pharmacy and Chemistry">
                      Colleges of Pharmacy and Chemistry
                    </option>
                    <option value="Colleges of Teacher Education">
                      Colleges of Teacher Education
                    </option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
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
import { watch } from 'vue';
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

// Automatically sync position with department
watch(
  () => form.position,
  (position) => {
    if (position === 'Visitor') {
      form.department = 'Visitor';
    } else if (form.department === 'Visitor') {
      form.department = '';
    }
  }
);
</script>


<style scoped>
.hint-text {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
  display: block;
}

.visitor-checkbox {
  margin-bottom: 8px;
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