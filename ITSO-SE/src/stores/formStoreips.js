import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('formStoreips', () => {
  // Step 1: Applicant Info
  const fullName = ref('');
  const position = ref('');
  const email = ref('');
  const contactNumber = ref('');
  const department = ref('');

  // Step 2: Uploaded Documents
  const uploadedFiles = ref([]); // Array of additional files
  const mainDocument = ref(null); // Main document for annotation
  const additionalDocument = ref(null); // Additional document

  // Step 3: PDF Annotations
  const annotations = ref({}); // Store annotations by page number

  // Step 4: Final Review & Submission
  const reviewed = ref(false);
  const submissionId = ref(null); // Track submission ID after submission

  // Reset function
  function resetForm() {
    fullName.value = '';
    position.value = '';
    email.value = '';
    contactNumber.value = '';
    department.value = '';
    uploadedFiles.value = [];
    mainDocument.value = null;
    additionalDocument.value = null;
    annotations.value = {};
    reviewed.value = false;
    submissionId.value = null;
  }

  // Add a file to uploadedFiles if it's not already there
  function addUploadedFile(file) {
    const exists = uploadedFiles.value.some(f => f.name === file.name);
    if (!exists) {
      uploadedFiles.value.push(file);
    }
  }

  return {
    // Form fields
    fullName,
    position,
    email,
    contactNumber,
    department,
    
    // Files
    uploadedFiles,
    mainDocument,
    additionalDocument,
    
    // Annotations
    annotations,
    
    // Status
    reviewed,
    submissionId,
    
    // Methods
    resetForm,
    addUploadedFile
  };
});