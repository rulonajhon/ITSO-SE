// src/stores/formStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, storage, auth } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useFormStore = defineStore('form', () => {
  // Basic form data from step 1
  const basicInfo = ref({
    title: '',
    category: 'research',
    fullName: '',
    email: '',
    contactNumber: '',
    department: '',
  });

  // Document references from step 2
  const documents = ref({
    guidelines: null,
    documents: null,
    request: null,
    additional: null
  });

  // File URLs after upload
  const fileURLs = ref({
    guidelines: '',
    documents: '',
    request: '',
    additional: ''
  });

  // Loading state
  const isLoading = ref(false);
  
  // Current user state
  const currentUser = ref(null);

  // Update current user
  const updateCurrentUser = () => {
    currentUser.value = auth.currentUser;
    console.log('Current user in formStore:', currentUser.value ? {
      uid: currentUser.value.uid,
      email: currentUser.value.email,
      displayName: currentUser.value.displayName
    } : 'No user logged in');
    return currentUser.value;
  };

  // Save step 1 data
  const saveBasicInfo = (data) => {
    basicInfo.value = { ...data };
    // Save to localStorage as backup
    localStorage.setItem('submissionBasicInfo', JSON.stringify(data));
    console.log('Basic info saved:', basicInfo.value);
  };

  // Save step 2 document references
  const saveDocuments = (files) => {
    documents.value = { ...files };
    console.log('Documents saved:', {
      guidelines: files.guidelines?.name || 'None',
      documents: files.documents?.name || 'None',
      request: files.request?.name || 'None',
      additional: files.additional?.name || 'None'
    });
    // We don't save files to localStorage
  };

  // Upload files to Firebase Storage
  const uploadFiles = async () => {
    isLoading.value = true;
    const user = updateCurrentUser();
    
    if (!user) {
      console.error('Upload failed: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Starting file uploads for user:', user.uid);
      const uploads = [];
      const submissionId = `submission_${Date.now()}`;
      
      for (const type in documents.value) {
        if (documents.value[type]) {
          const file = documents.value[type];
          // Use the path structure that matches Firebase rules: submissions/competition/{userId}/{submissionId}/{fileName}
          const filePath = `submissions/competition/${user.uid}/${submissionId}/${type}${getFileExtension(file.name)}`;
          
          console.log(`Preparing to upload ${type} file:`, file.name, 'to path:', filePath);
          const fileRef = storageRef(storage, filePath);
          
          // Create promise for upload
          const uploadTask = uploadBytes(fileRef, file)
            .then(() => {
              console.log(`${type} file uploaded successfully`);
              return getDownloadURL(fileRef);
            })
            .then(url => {
              console.log(`Download URL for ${type}:`, url);
              fileURLs.value[type] = url;
              return { type, url };
            });
          
          uploads.push(uploadTask);
        }
      }
      
      // Wait for all uploads to complete
      console.log('Waiting for all uploads to complete...');
      const results = await Promise.all(uploads);
      console.log('All uploads completed:', results);
      
      return { fileURLs: fileURLs.value, submissionId };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Helper function to get file extension
  const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.')) || '';
  };

  // Submit the entire form
  const submitForm = async () => {
    isLoading.value = true;
    const user = updateCurrentUser();
    
    if (!user) {
      console.error('Form submission failed: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Starting form submission process for user:', user.uid);
      
      // First upload all files
      console.log('Uploading files...');
      const { fileURLs: uploadedFiles, submissionId } = await uploadFiles();
      console.log('Files uploaded successfully:', uploadedFiles);
      console.log('Using submission ID:', submissionId);

      // Create reference to user's competitions collection
      const userCompetitionRef = collection(db, "users", user.uid, "competitions");
      console.log('User competition collection path:', `users/${user.uid}/competitions/${submissionId}`);
      
      const submissionData = {
        ...basicInfo.value,
        fileURLs: uploadedFiles,
        status: 'submitted',
        submissionId,
        submittedAt: serverTimestamp(),
      };
      
      // Add the submission to the user's competitions collection
      console.log('Saving submission data to user collection:', submissionData);
      await setDoc(doc(userCompetitionRef, submissionId), submissionData);
      console.log('User-specific submission document created');
      
      // Also add to the main competitions collection with user reference
      const globalSubmissionData = {
        ...basicInfo.value,
        fileURLs: uploadedFiles,
        status: 'submitted',
        userId: user.uid,
        userEmail: user.email,
        submissionId,
        submittedAt: serverTimestamp(),
      };
      
      console.log('Saving submission data to global competitions collection:', globalSubmissionData);
      await setDoc(doc(db, "competitions", submissionId), globalSubmissionData);
      console.log('Global submission document created');
      
      console.log('Submission completed successfully with ID:', submissionId);
      return submissionId;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Load saved basic info from localStorage
  const loadSavedData = () => {
    updateCurrentUser(); // Update user reference when loading data
    const savedBasicInfo = localStorage.getItem('submissionBasicInfo');
    if (savedBasicInfo) {
      basicInfo.value = JSON.parse(savedBasicInfo);
      console.log('Loaded saved data from localStorage:', basicInfo.value);
    } else {
      console.log('No saved data found in localStorage');
    }
  };

  // Reset the entire form
  const resetForm = () => {
    basicInfo.value = {
      title: '',
      category: 'research',
      fullName: '',
      email: '',
      contactNumber: '',
      department: '',
    };
    
    documents.value = {
      guidelines: null,
      documents: null,
      request: null,
      additional: null
    };
    
    fileURLs.value = {
      guidelines: '',
      documents: '',
      request: '',
      additional: ''
    };
    
    // Clear localStorage
    localStorage.removeItem('submissionBasicInfo');
    console.log('Form data reset successfully');
  };

  return {
    basicInfo,
    documents,
    fileURLs,
    isLoading,
    currentUser,
    updateCurrentUser,
    saveBasicInfo,
    saveDocuments,
    uploadFiles,
    submitForm,
    loadSavedData,
    resetForm
  };
});