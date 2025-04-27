import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('formStoreips', () => {
  // Step 1: Applicant Info
  const fullName = ref('');
  const title = ref(''); // <-- ✅ Added "Title of Research"
  const position = ref('');
  const email = ref('');
  const contactNumber = ref('');
  const department = ref('');
  const applicationType = ref('IP Protection'); // Default value set to "IP Protection"

  // Step 2: Uploaded Documents
  const uploadedFiles = ref([]); // Array of additional files
  const mainDocument = ref(null); // Main document for annotation
  const additionalDocument = ref(null); // Additional document

  // Step 3: PDF Annotations
  const annotations = ref({}); // Store annotations by page number

  // Step 4: Final Review & Submission
  const reviewed = ref(false);
  const submissionId = ref(null); // Track submission ID after submission

  // Status: Pending, Accepted, Rejected, For Revision
  const status = ref('Pending'); // Default to "Pending"

  // Reset function
  function resetForm() {
    fullName.value = '';
    title.value = ''; // <-- ✅ Reset the title too
    position.value = '';
    email.value = '';
    contactNumber.value = '';
    department.value = '';
    applicationType.value = 'IP Protection'; // Reset to default
    uploadedFiles.value = [];
    mainDocument.value = null;
    additionalDocument.value = null;
    annotations.value = {};
    reviewed.value = false;
    submissionId.value = null;
    status.value = 'Pending'; // Reset status back to "Pending"
  }

  // Add a file to uploadedFiles if it's not already there
  function addUploadedFile(file) {
    const exists = uploadedFiles.value.some(f => f.name === file.name);
    if (!exists) {
      uploadedFiles.value.push(file);
    }
  }

  // Update the status manually
  function updateStatus(newStatus) {
    const allowedStatuses = ['Pending', 'Accepted', 'Rejected', 'For Revision'];
    if (allowedStatuses.includes(newStatus)) {
      status.value = newStatus;
    } else {
      console.error(`Invalid status: ${newStatus}`);
    }
  }

  return {
    // Form fields
    fullName,
    title, // <-- ✅ Include title here
    position,
    email,
    contactNumber,
    department,
    applicationType,

    // Files
    uploadedFiles,
    mainDocument,
    additionalDocument,

    // Annotations
    annotations,

    // Status and Submission
    reviewed,
    submissionId,
    status,

    // Methods
    resetForm,
    addUploadedFile,
    updateStatus,
  };
});
