<template>
  <div class="page-wrapper">

    <!-- Main Content -->
    <div class="content-container">
      <div class="submission-form">
        <!-- Progress Section -->
        <div class="progress-section">
          <h2 class="section-title">Submission Progress</h2>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="progress-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-label">Basic Information</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-label">Documents</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-label">Review</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attachments Section -->
        <div class="attachments-section">
          <h3 class="section-title">5. Attachments</h3>
          
          <div class="document-upload">
            <h4 class="document-title">Event/Publication Guidelines</h4>
            <div class="document-container">
              <div class="document-info">
                <p class="upload-text">Upload Document</p>
                <p class="file-info">Only PDF files are accepted</p>
              </div>
              <div class="document-actions">
                <button class="btn btn-check">Check Document</button>
                <button class="btn btn-upload">Upload</button>
              </div>
            </div>
          </div>

          <div class="document-upload">
            <h4 class="document-title">Request Document</h4>
            <div class="document-container">
              <div class="document-info">
                <p class="upload-text">Upload Document</p>
                <p class="file-info">Only PDF files are accepted</p>
              </div>
              <div class="document-actions">
                <button class="btn btn-view">View Sample Format</button>
                <button class="btn btn-upload">Upload</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation">
          <button class="btn btn-nav" @click="goBack">Back</button>
          <button class="btn btn-nav" @click="goNext">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/navigationbar.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const goNext = () => {
  router.push("/cs3");
};
const goBack = () => {
  router.push("/cs1");
};
</script>

<style>
/* Reset and Global Styles */
body, html {
  background-color: white !important;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  margin-bottom: 2%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Page Layout */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
  margin-top: 2rem; /* Add margin between navbar and content */
}

.submission-form {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Progress Section */
.progress-section {
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
}

.section-title {
  color: #FF8BA7;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 24px;
}

.progress-container {
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  width: 33.33%; /* For first step */
  background-color: #FF8BA7;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-number {
  width: 32px;
  height: 32px;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: -16px;
  margin-bottom: 8px;
}

.step:first-child .step-number {
  background-color: #FF8BA7;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.step:first-child .step-label {
  color: #FF8BA7;
  font-weight: 700;
}

/* Attachments Section */
.attachments-section {
  margin-bottom: 32px;
  width: 100%;
}

.document-upload {
  margin-bottom: 24px;
}

.document-title {
  color: #FF8BA7;
  font-size: 14px;
  margin-bottom: 8px;
}

.document-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.document-info {
  display: flex;
  flex-direction: column;
}

.upload-text {
  color: #FF8BA7;
  font-weight: 500;
  font-size: 16px;
}

.file-info {
  color: #FF8BA7;
  font-size: 12px;
}

.document-actions {
  display: flex;
  gap: 8px;
}

/* Button Styles */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-check, .btn-view, .btn-upload {
  background-color: #FF8BA7;
  color: white;
}

.btn-check:hover:not(:disabled), 
.btn-view:hover:not(:disabled), 
.btn-upload:hover:not(:disabled) {
  background-color: #ff7a9a;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
}

.btn-nav {
  background-color: #FF8BA7;
  color: white;
  padding: 8px 32px;
  border-radius: 20px;
}

.btn-nav:hover:not(:disabled) {
  background-color: #ff7a9a;
}

.hidden-input {
  display: none;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .document-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .document-actions {
    margin-top: 16px;
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .progress-steps {
    position: relative;
    margin-top: 24px;
  }

  .document-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .navigation {
    flex-direction: column;
  }
}
</style>