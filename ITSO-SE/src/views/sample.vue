<template>
    <div class="page-wrapper">
      <!-- Navbar Component -->
      <Navbar />
  
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
            <button class="btn btn-nav">Back</button>
            <button class="btn btn-nav">Next</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Navbar from "../components/navigationbar.vue";
  </script>
  
  <style>
  body,
html {
  background-color: white !important;
  margin-bottom: 2%;
}* 
{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.submission-form {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin-top: 2px; /* Move down */
  margin-left: 300px; /* Move right */
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 40px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Progress Section */
.progress-section {
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
  max-width: 800px;
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
  background-color: #FF8BA7;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 92%;
  top: -4px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 18px;
  margin-bottom: 8px;
}

.step.active .step-number {
  background-color: #FF8BA7;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* Attachments Section */
.attachments-section {
  margin-bottom: 32px;
  width: 120%;
  max-width: 800px;
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
  max-width: 800px;
}

.btn-nav {
  background-color: #FF8BA7;
  color: white;
  padding: 8px 32px;
}

.btn-nav:hover:not(:disabled) {
  background-color: #ff7a9a;
}

.hidden-input {
  display: none;
}

/* Responsive Adjustments */
@media (max-width: 840px) {
  .main-content {
    padding: 20px;
  }
  
  .progress-section,
  .attachments-section,
  .navigation {
    max-width: 100%;
  }
}

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
  .main-content {
    padding: 16px;
  }
  
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
