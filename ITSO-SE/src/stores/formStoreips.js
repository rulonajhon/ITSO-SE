// stores/formStoreips.js
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
  const uploadedFiles = ref([]); // Array of { name, file }

  // Step 3: Checklist
  const checklist = ref({
    manuscript: false,
    plagiarismReport: false,
    copyrightForm: false,
  });

  // Step 4: Final Review
  const reviewed = ref(false);

  // Expose all properties
  return {
    fullName,
    position,
    email,
    contactNumber,
    department,
    uploadedFiles,
    checklist,
    reviewed,
  };
});
