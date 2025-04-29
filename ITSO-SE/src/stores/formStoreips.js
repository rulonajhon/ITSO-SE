import { defineStore } from 'pinia';
import { ref } from 'vue';
import { storage } from '@/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
  const uploadProgress = ref(0);

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
    uploadProgress.value = 0;
  }

  // Function to read file as ArrayBuffer - crucial for binary files like PDFs
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to upload a file to Firebase Storage
  const uploadFile = async (file, userId, submissionId, type) => {
    // Validate file
    if (!file || !file.name) {
      throw new Error('Invalid file provided');
    }

    try {
      // Read file as ArrayBuffer first
      const fileBuffer = await readFileAsArrayBuffer(file);
      
      // Ensure correct content type is set for PDF
      const fileType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') 
        ? 'application/pdf' 
        : file.type || 'application/octet-stream';
      
      const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
      const filePath = `submissions/ipapplication/${userId}/${submissionId}/${Date.now()}_${sanitizedFileName}`;
      const fileRef = storageRef(storage, filePath);

      // Set proper metadata
      const metadata = {
        contentType: fileType,
      };

      console.log(`Uploading file: ${file.name} with content type: ${fileType}`);

      // Use uploadBytesResumable with the file buffer
      const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);
      
      // Return a promise to wait for the upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            uploadProgress.value = progress;
            console.log(`Upload is ${progress}% done for ${file.name}`);
          },
          (error) => {
            console.error('Error uploading file:', error);
            reject(error);
          },
          async () => {
            try {
              // After upload completes successfully
              console.log(`${type} file uploaded successfully: ${file.name}`);
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`Download URL for ${type}: ${url}`);
              
              // Store the URL for further usage
              fileURLs.value[type] = url;
              resolve({ name: file.name, url });
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error preparing file for upload:', error);
      throw error;
    }
  };

  // Function to handle file upload for main and additional documents
  const uploadDocuments = async (files, userId, submissionId) => {
    isLoading.value = true;
    uploadProgress.value = 0;
    
    try {
      const uploads = [];
      
      // Upload main document
      if (files.mainDocument) {
        const mainUpload = uploadFile(files.mainDocument, userId, submissionId, 'main');
        uploads.push(mainUpload);
      }

      // Upload additional document
      if (files.additionalDocument) {
        const additionalUpload = uploadFile(files.additionalDocument, userId, submissionId, 'additional');
        uploads.push(additionalUpload);
      }

      // Wait for all uploads to complete
      const results = await Promise.all(uploads);
      console.log('Files uploaded successfully:', results);
      return results;

    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to add uploaded file to the list
  const addUploadedFile = (file) => {
    if (file && file instanceof File) {
      // Check if file already exists in the array
      const exists = uploadedFiles.value.some(f => 
        f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
      );
      
      if (!exists) {
        uploadedFiles.value.push(file);
      }
    }
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
    uploadProgress,
    resetForm,
    uploadFile,
    uploadDocuments,
    addUploadedFile,
    readFileAsArrayBuffer
  };
});