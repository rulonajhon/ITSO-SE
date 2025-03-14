import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('form', () => {
  // Step 1: Applicant Information
  const applicantInfo = ref({
    fullName: '',
    position: '',
    email: '',
    contactNumber: '',
    department: '',
  });

  // Step 1: Event/Public Details
  const eventDetails = ref({
    activityType: 'research',
    eventName: '',
    eventDate: '',
    eventLocation: '',
    organizer: '',
  });

  // Step 1: Project Information
  const projectInfo = ref({
    projectTitle: '',
    projectDescription: '',
    ipProtection: 'with',
  });

  // Step 2: Document Information
  const documents = ref({
    guidelines: null,
    documents: null,
    request: null,
    additional: null,
  });

  // Current step tracking
  const currentStep = ref(1);

  // Update functions for each section
  const updateApplicantInfo = (data) => {
    applicantInfo.value = { ...applicantInfo.value, ...data };
  };

  const updateEventDetails = (data) => {
    eventDetails.value = { ...eventDetails.value, ...data };
  };

  const updateProjectInfo = (data) => {
    projectInfo.value = { ...projectInfo.value, ...data };
  };

  const updateDocument = (type, file) => {
    documents.value[type] = file;
  };

  const setCurrentStep = (step) => {
    currentStep.value = step;
  };

  // Reset the entire form
  const resetForm = () => {
    applicantInfo.value = {
      fullName: '',
      position: '',
      email: '',
      contactNumber: '',
      department: '',
    };
    
    eventDetails.value = {
      activityType: 'research',
      eventName: '',
      eventDate: '',
      eventLocation: '',
      organizer: '',
    };
    
    projectInfo.value = {
      projectTitle: '',
      projectDescription: '',
      ipProtection: 'with',
    };
    
    documents.value = {
      guidelines: null,
      documents: null,
      request: null,
      additional: null,
    };
    
    currentStep.value = 1;
  };

  // Helper function to get activity type label
  const getActivityTypeLabel = (type) => {
    const types = {
      'research': 'Research Presentation',
      'competition': 'Competition',
      'publication': 'Publication Submission'
    };
    return types[type] || type;
  };

  // Check if a step is complete
  const isStep1Complete = () => {
    return (
      applicantInfo.value.fullName &&
      applicantInfo.value.position &&
      applicantInfo.value.email &&
      applicantInfo.value.contactNumber &&
      applicantInfo.value.department &&
      eventDetails.value.eventName &&
      eventDetails.value.eventDate &&
      eventDetails.value.eventLocation &&
      eventDetails.value.organizer &&
      projectInfo.value.projectTitle &&
      projectInfo.value.projectDescription
    );
  };

  const isStep2Complete = () => {
    // Check if required documents are uploaded
    return (
      documents.value.guidelines &&
      documents.value.documents &&
      documents.value.request
      // additional is optional
    );
  };

  // Submit the form
  const submitForm = async () => {
    try {
      // Here you would typically make an API call to submit the form data
      console.log('Submitting form with data:', {
        applicantInfo: applicantInfo.value,
        eventDetails: eventDetails.value,
        projectInfo: projectInfo.value,
        documents: documents.value
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return success
      return { success: true, message: 'Form submitted successfully!' };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, message: 'Failed to submit form. Please try again.' };
    }
  };

  return {
    // State
    applicantInfo,
    eventDetails,
    projectInfo,
    documents,
    currentStep,
    
    // Actions
    updateApplicantInfo,
    updateEventDetails,
    updateProjectInfo,
    updateDocument,
    setCurrentStep,
    resetForm,
    submitForm,
    
    // Getters
    getActivityTypeLabel,
    isStep1Complete,
    isStep2Complete
  };
});