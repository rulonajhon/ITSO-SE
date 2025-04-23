<template>
    <div class="page-wrapper">
      <div class="content-container">
        <div class="confirmation-container">
          <div class="confirmation-card">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h1 class="confirmation-title">Submission Successful!</h1>
            
            <p class="confirmation-message">
              Your competition entry has been successfully submitted.
              Please keep your submission ID for future reference.
            </p>
            
            <div class="submission-details">
              <div class="submission-id">
                <span class="label">Submission ID:</span>
                <span class="id-value">{{ submissionId }}</span>
                <button @click="copySubmissionId" class="copy-button">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
              <div class="submission-date">
                <span class="label">Submitted on:</span>
                <span>{{ formattedDate }}</span>
              </div>
            </div>
            
            <div class="what-next">
              <h2>What happens next?</h2>
              <ul>
                <li>Our team will review your submission</li>
                <li>You will receive an email confirmation at {{ userEmail }}</li>
                <li>Check the status of your submission on your dashboard</li>
              </ul>
            </div>
            
            <div class="action-buttons">
              <button @click="goToDashboard" class="btn btn-primary">Go to Dashboard</button>
              <button @click="submitAnother" class="btn btn-secondary">Submit Another Entry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { auth } from '@/firebase';
  import { onAuthStateChanged } from 'firebase/auth';
  
  const route = useRoute();
  const router = useRouter();
  const submissionId = ref(route.query.id || 'Unknown');
  const copied = ref(false);
  const userEmail = ref('');
  const formattedDate = ref(new Date().toLocaleString());
  
  // Get current user's email
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userEmail.value = user.email;
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    });
  });
  
  // Copy submission ID to clipboard
  const copySubmissionId = () => {
    navigator.clipboard.writeText(submissionId.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  };
  
  // Navigate to dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Submit another entry
  const submitAnother = () => {
    router.push('/cs1'); // Navigate to the first step of your submission form
  };
  </script>
  
  <style scoped>
  .page-wrapper {
    min-height: 100vh;
    background-color: #f9fafb;
    padding: 2rem 1rem;
  }
  
  .content-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .confirmation-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .confirmation-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    text-align: center;
  }
  
  .success-icon {
    color: #10b981;
    margin-bottom: 1.5rem;
  }
  
  .confirmation-title {
    color: #10b981;
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .confirmation-message {
    color: #4b5563;
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
  
  .submission-details {
    background-color: #f3f4f6;
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .submission-id {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .label {
    font-weight: 600;
    color: #374151;
    margin-right: 0.5rem;
  }
  
  .id-value {
    font-family: monospace;
    background-color: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .copy-button {
    background-color: #e5e7eb;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  
  .copy-button:hover {
    background-color: #d1d5db;
  }
  
  .what-next {
    text-align: left;
    margin-bottom: 2rem;
  }
  
  .what-next h2 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .what-next ul {
    padding-left: 1.5rem;
    color: #4b5563;
  }
  
  .what-next li {
    margin-bottom: 0.5rem;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #2563eb;
  }
  
  .btn-secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;
  }
  
  .btn-secondary:hover {
    background-color: #f3f4f6;
  }
  
  @media (max-width: 640px) {
    .confirmation-card {
      padding: 1.5rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>