import { defineStore } from 'pinia';
import { ref } from 'vue';
import { storage } from '@/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useFormStore = defineStore('formStoreips', () => {
  // Step 1: Applicant Info
  const fullName = ref('');
  const title = ref(''); // Title of the research
  const position = ref('');
  const email = ref('');
  const contactNumber = ref('');
  const department = ref('');
  const applicationType = ref('IP Protection'); // Default value set to "IP Protection"

  // Step 2: Uploaded Documents
  const uploadedFiles = ref([]); // Array of uploaded files
  const mainDocument = ref(null); // Main document for annotation
  const additionalDocument = ref(null); // Additional document

  // Step 3: File URLs
  const fileURLs = ref({
    main: '',
    additional: '',
  });

  // Loading state
  const isLoading = ref(false);

  // Reset function
  function resetForm() {
    fullName.value = '';
    title.value = '';
    position.value = '';
    email.value = '';
    contactNumber.value = '';
    department.value = '';
    applicationType.value = 'IP Protection';
    uploadedFiles.value = [];
    mainDocument.value = null;
    additionalDocument.value = null;
    fileURLs.value = {
      main: '',
      additional: '',
    };
    isLoading.value = false;
  }

  // Function to upload a file to Firebase Storage
  const uploadFile = async (file, userId, submissionId, type) => {
    const filePath = `submissions/ipapplication/${userId}/${submissionId}/${type}${getFileExtension(file.name)}`;
    const fileRef = storageRef(storage, filePath);

    try {
      // Start uploading
      const uploadTask = await uploadBytes(fileRef, file);
      console.log(`${type} file uploaded successfully`);

      // After uploading, get the download URL
      const url = await getDownloadURL(fileRef);
      console.log(`Download URL for ${type}:`, url);
      
      // Store the URL for further usage
      fileURLs.value[type] = url;
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Helper function to get file extension
  const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase() || '';
  };

  // Function to handle file upload for main and additional documents
  const uploadDocuments = async (files, userId, submissionId) => {
    isLoading.value = true;

    try {
      // Upload main document
      if (files.mainDocument) {
        await uploadFile(files.mainDocument, userId, submissionId, 'main');
      }

      // Upload additional document
      if (files.additionalDocument) {
        await uploadFile(files.additionalDocument, userId, submissionId, 'additional');
      }

      console.log('Files uploaded successfully:', fileURLs.value);

    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Function to submit the form with file URLs
  const submitForm = async (userId, submissionId, files) => {
    await uploadDocuments(files, userId, submissionId);
    
    // Save the submission data here (can be saved to Firestore as needed)
    // You can now use `fileURLs.main` and `fileURLs.additional` to display and allow users to download files.
    console.log('Form submitted with file URLs:', fileURLs.value);
  };

  return {
    fullName,
    title,
    position,
    email,
    contactNumber,
    department,
    applicationType,
    uploadedFiles,
    mainDocument,
    additionalDocument,
    fileURLs,
    isLoading,
    resetForm,
    uploadFile,
    uploadDocuments,
    submitForm,
  };
});
