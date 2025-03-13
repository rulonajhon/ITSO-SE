<template>
    <div class="page-container">
      <!-- Progress Bar -->
         <!-- Progress Bar -->
         <div class="progress-container">
            <div class="progress-bar">
              <div v-for="step in steps" :key="step.id" class="progress-step" :class="{ active: step.id <= currentStep }">
                <div class="step-circle">{{ step.id }}</div>
                <div class="step-label">{{ step.label }}</div>
              </div>
            </div>
          </div>
  
      <div class="content-container">
        <!-- Left Column - PDF Viewer -->
        <div class="pdf-section">
          <div class="pdf-controls">
            <div class="zoom-controls">
              <button @click="zoomOut">-</button>
              <span>{{ (scale * 100).toFixed(0) }}%</span>
              <button @click="zoomIn">+</button>
            </div>
            <div class="page-controls">
              <button @click="prevPage" :disabled="currentPage <= 1">
                <i class="pi pi-chevron-left"></i>
              </button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage >= totalPages">
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="pdf-viewer">
            <div class="pdf-container">
              <canvas ref="pdfCanvas"></canvas>
            </div>
          </div>
        </div>
  
        <!-- Right Column - Assessment Form -->
        <div class="form-section">
          <h2>Initial Assessment</h2>
          
          <section class="form-group">
            <h3>Novel Ideas Assessment</h3>
            <div class="text-list">
              <p class="text-item">Does the project/research/publication contain any novel ideas, processes, or inventions?</p>
              <p class="text-item">Does the project involve a unique design, formula, or model?</p>
              <p class="text-item">Are there any software, databases, or code created as part of the work?</p>
              <p class="text-item">Does the project involve the creation of artistic, literary, or musical work?</p>
              <p class="text-item">Has the project been publicly disclosed (e.g., through presentations or publications)?</p>
            </div>
          </section>
  
          <section class="form-group">
            <h3>Type of Intellectual Property</h3>
            <div class="text-list">
              <p class="text-item">Patentable Inventions - Novel processes, machines, compositions, or improvements</p>
              <p class="text-item">Utility Models - Functional improvements to existing technology</p>
              <p class="text-item">Trademarks - Unique logos, names, or symbols used in commerce</p>
              <p class="text-item">Copyright - Protection for artistic, literary, or software works</p>
            </div>
          </section>
  
          <section class="form-group">
            <h3>IP Protection Needs</h3>
            <div class="text-list">
              <p class="text-item">Is there a need for provisional patent filing?</p>
              <p class="text-item">Does the project require copyright registration?</p>
              <p class="text-item">Should a trademark be registered for this project?</p>
              <p class="text-item">Is a formal IP agreement with external collaborators required?</p>
            </div>
          </section>
  
          <section class="form-group">
            <h3>Compliance and Next Steps</h3>
            <div class="text-list">
              <p class="text-item">Does the Project comply with University IP policies?</p>
              <p class="text-item">Are there any pending IP filings?</p>
              <p class="text-item">Is there a need for further IP evaluation?</p>
            </div>
          </section>
        </div>
      </div>
  
      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <button class="nav-btn back-btn" @click="goBack">Back</button>
        <button class="nav-btn next-btn" @click="goNext">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, toRaw } from "vue";
  import * as pdfjsLib from "pdfjs-dist";
  import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
  import { useRouter } from 'vue-router';

  const router = useRouter();
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  
  // PDF Viewer state
  const pdfCanvas = ref(null);
  const pdfUrl = "/examplepdf.pdf";
  const pdfDoc = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const scale = ref(1.5);

  const goBack = () => {
    router.push('/ips2'); // Redirect to ips1.vue
  };

  const goNext = () => {
    router.push('/ips4'); // Redirect to ips3.vue
  };
  
  // PDF rendering functions
  const renderPage = async (pageNumber) => {
    if (!pdfDoc.value) return;
  
    try {
      const rawPdfDoc = toRaw(pdfDoc.value);
      const page = await rawPdfDoc.getPage(pageNumber);
      const canvas = pdfCanvas.value;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: scale.value });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  };
  
  const loadPDF = async () => {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      pdfDoc.value = await loadingTask.promise;
      totalPages.value = pdfDoc.value.numPages;
      await renderPage(currentPage.value);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };
  
  // Navigation functions
  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      await renderPage(currentPage.value);
    }
  };
  
  const prevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      await renderPage(currentPage.value);
    }
  };
  
  // Zoom functions
  const zoomIn = async () => {
    scale.value *= 1.2;
    await renderPage(currentPage.value);
  };
  
  const zoomOut = async () => {
    scale.value /= 1.2;
    await renderPage(currentPage.value);
  };
  
  // Progress bar data
  const steps = ref([
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Document" },
    { id: 3, label: "Documents Checklist" },
    { id: 4, label: "Review" }
  ]);
  
  const currentStep = ref(2); // Set to current step
  
  onMounted(loadPDF);
  </script>
  
  <style scoped>
  /* Progress Bar Styles */
  .progress-container {
    margin-bottom: 100px;
  }
  
  .progress-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 30px;
  }
  
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  
  .step-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ddd;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .progress-step.active .step-circle {
    background-color: #ff6b8a;
    color: white;
  }
  
  .step-label {
    font-size: 12px;
    text-align: center;
    color: #999;
  }
  
  .progress-step.active .step-label {
    color: #ff6b8a;
    font-weight: bold;
  }
  
  .page-container {
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* PDF Container Fixes */
  .content-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: calc(100vh - 280px); /* Adjusted for progress bar */
  }
  
  /* PDF Viewer Fixes */
  .pdf-section {
    position: relative;
    background: white;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }
  
  .pdf-viewer {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  
  .pdf-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  
  canvas {
    display: block;
    margin: 0 auto;
  }
  
  .pdf-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .zoom-controls, .page-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .pdf-controls button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  /* Form Styles */
  .form-section {
    background: white;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    overflow-y: auto;
    height: 100%;
  }
  
  /* Form Section - maintain height */
  .form-section {
    height: 100%;
    overflow-y: auto;
  }
  
  .form-section h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2d3748;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #4a5568;
  }
  
  .text-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .text-item {
    font-size: 0.875rem;
    color: #4a5568;
    margin: 0;
    padding-left: 1.5rem;
    position: relative;
  }
  
  .text-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #e2e8f0;
    border-radius: 50%;
  }
  
  /* Navigation Buttons Update */
  .navigation-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
  
  .nav-btn {
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 20px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    background-color: #FF8BA7;
    color: white;
    min-width: 120px;
    transition: opacity 0.2s ease;
  }
  
  .nav-btn:hover {
    opacity: 0.9;
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-container {
      grid-template-columns: 1fr;
      height: auto;
    }
  
    .pdf-section, .form-section {
      height: 500px;
    }
  }
  
  @media (max-width: 640px) {
    .page-container {
      padding: 0.5rem;
    }
  
    .pdf-controls {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>
  
  