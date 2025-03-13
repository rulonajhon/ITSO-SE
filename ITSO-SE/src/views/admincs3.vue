<template>
    <div class="page-wrapper">
  
      <!-- Main Content -->
      <div class="content-container">
        <div class="submission-container">
          <h2 class="title">Submission Progress</h2>
          
          <!-- Redesigned Progress Steps - Numbers below the line with labels underneath -->
          <div class="progress-container">
            <div class="progress-bar">
              <!-- Horizontal line -->
              <div class="progress-line"></div>
              
              <!-- Step indicators below the line -->
              <div class="progress-steps">
                <div class="progress-step active">
                  <div class="step-number">1</div>
                  <div class="step-label">Basic Information</div>
                </div>
                <div class="progress-step active">
                  <div class="step-number">2</div>
                  <div class="step-label">Documents</div>
                </div>
                <div class="progress-step active">
                  <div class="step-number">3</div>
                  <div class="step-label">Review</div>
                </div>
              </div>
            </div>
          </div>
          
          <form>
            <!-- Section 1: Applicant Information -->
            <div class="form-section">
              <h3 class="section-title">1. Applicant Information</h3>
              
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="position">Position/Title</label>
                <input 
                  type="text" 
                  id="position" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <!-- Contact Number and Department side by side -->
              <div class="form-row">
                <div class="form-group half">
                  <label for="contactNumber">Contact Number</label>
                  <input 
                    type="tel" 
                    id="contactNumber" 
                    value=""
                    class="form-control"
                    readonly
                  />
                </div>
                
                <div class="form-group half">
                  <label for="department">Department</label>
                  <input 
                    type="text" 
                    id="department" 
                    value=""
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
            </div>
            
            <!-- Section 2: Event/Public Details -->
            <div class="form-section">
              <h3 class="section-title">2. Event/Public Details</h3>
              
              <div class="form-group">
                <label>Type of Activity</label>
                <input 
                  type="text" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="eventName">Name of Event/Journal</label>
                <input 
                  type="text" 
                  id="eventName" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="eventDetails">Date(s) of Event/Submission Deadline</label>
                <input 
                  type="text" 
                  id="eventDetails" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="location">Location(Venue/Online Platform)</label>
                <input 
                  type="text" 
                  id="location" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="organizer">Organizer/Publisher</label>
                <input 
                  type="text" 
                  id="organizer" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            
            <!-- Section 3: Project/Research/Publication Information -->
            <div class="form-section">
              <h3 class="section-title">3. Project/Research/Publication Information</h3>
              
              <div class="form-group">
                <label for="projectTitle">Title of Project/Research/Paper</label>
                <input 
                  type="text" 
                  id="projectTitle" 
                  value=""
                  class="form-control"
                  readonly
                />
              </div>
              
              <div class="form-group">
                <label for="projectDescription">Brief Description of Project/Research/Paper</label>
                <textarea 
                  id="projectDescription" 
                  class="form-control textarea"
                  rows="4"
                  readonly
                ></textarea>
              </div>
            </div>
            
            <!-- Section 4: Attachments -->
            <div class="form-section">
              <h3 class="section-title">4. Attachments</h3>
              <p class="attachment-note">Event/Publication Guidelines</p>
              
              <div class="attachment-container">
                <div class="file-info">
                  <span></span>
                </div>
                <div class="file-actions">
                  <button type="button" class="btn btn-select">View Document</button>
                </div>
              </div>
            </div>
            
            <!-- Section 6: Review -->
            <div class="form-section">
              <h3 class="section-title">6. Review</h3>
              
              <div class="form-group">
                <div class="radio-group">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="endorsement" 
                      value="endorsed" 
                      checked
                    />
                    <span class="radio-custom"></span>
                    Endorsed
                  </label>
                  
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      name="endorsement" 
                      value="not-endorsed"
                    />
                    <span class="radio-custom"></span>
                    Not Endorsed
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label>Remarks (if not endorsed)</label>
                <textarea 
                  class="form-control textarea"
                  rows="3"
                  readonly
                ></textarea>
              </div>
            </div>
            
            <!-- Form Navigation -->
            <div class="form-navigation">
              <button type="button" class="btn btn-back">Back</button>
              <button type="button" class="btn btn-submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style>
  /* Reset and Global Styles */
  body, html { 
    background-color: #fff;
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
  
  .submission-container {
    max-width: 600px;
    width: 100%;
  }
  
  .title {
    text-align: center;
    color: #FF7892;
    margin-bottom: 20px;
  }
  
  /* Redesigned Progress Bar */
  .progress-container {
    margin-bottom: 30px;
    padding: 0 20px;
  }
  
  .progress-bar {
    position: relative;
    padding-top: 20px; /* Space for the line */
    margin-bottom: 40px;
  }
  
  /* Horizontal line */
  .progress-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #FF7892;
  }
  
  /* Steps container */
  .progress-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  
  /* Individual step */
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 33.33%;
  }
  
  /* Number indicator */
  .step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #FF7892;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  /* Step label */
  .step-label {
    font-size: 12px;
    color: #FF7892;
    max-width: 100px;
    text-align: center;
  }
  
  /* Form Sections */
  .form-section {
    margin-bottom: 30px;
  }
  
  .section-title {
    color: #FF7892;
    margin-bottom: 15px;
    font-weight: 500;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  /* Added for side-by-side layout */
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
    color: #FF7892;
    font-size: 14px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ffccd5;
    border-radius: 4px;
    font-size: 14px;
    background-color: #f9f9f9; /* Light background for readonly fields */
  }
  
  .textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  /* Radio Buttons */
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-left: 25px;
    margin-right: 15px;
    font-size: 14px;
    color: #333;
  }
  
  .radio-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .radio-custom {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #ffccd5;
    border-radius: 50%;
  }
  
  .radio-label input:checked ~ .radio-custom::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FF7892;
  }
  
  /* Attachment Section */
  .attachment-note {
    font-size: 14px;
    color: #FF7892;
    margin-bottom: 10px;
  }
  
  .attachment-container {
    border: 1px solid #ffccd5;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .file-info {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  /* Buttons */
  .btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
  
  .btn-select {
    background-color: #fff;
    color: #FF7892;
    border: 1px solid #FF7892;
  }
  
  .btn-upload {
    background-color: #FF7892;
    color: white;
  }
  
  /* Updated to center buttons */
  .form-navigation {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }
  
  .btn-back {
    background-color: #FF7892;
    color: white;
    border-radius: 20px;
    padding: 8px 32px;
  }
  
  .btn-submit {
    background-color: #FF7892;
    color: white;
    border-radius: 20px;
    padding: 8px 32px;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 10px;
    }
    
    .form-group.half {
      width: 100%;
    }
    
    .attachment-container {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .file-actions {
      margin-top: 10px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  
  @media (max-width: 480px) {
    .form-navigation {
      flex-direction: column;
      gap: 10px;
    }
    
    .btn-back, .btn-submit {
      width: 100%;
    }
  }
  </style>