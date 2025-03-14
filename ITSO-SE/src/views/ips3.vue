<template>
  <div class="page-container">
    <h1 class="form-title">Document Checklist</h1>
    
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
    <div class="form-buttons">
      <button class="btn btn-back" @click="goBack">Back</button>
      <button class="btn btn-next" @click="goNext">Next</button>
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

// Progress bar data
const steps = ref([
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Document" },
  { id: 3, label: "Documents Checklist" },
  { id: 4, label: "Review" }
]);

const currentStep = ref(3); // Set to current step (3)

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

// Navigation between steps
const goBack = () => {
  router.push('/ips2'); // Redirect to ips2.vue
};

const goNext = () => {
  router.push('/ips4'); // Redirect to ips4.vue
};

onMounted(loadPDF);
</script>

<style scoped>
/* Page Container */
.page-container {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Form Title */
.form-title {
  color: #ff6b8a;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/* Progress Bar Styles - Updated */
.progress-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 50px auto;
  padding: 20px;
  position: relative;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px; /* Space for the line */
}

/* Progress bar line - background */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 15px; /* Align with step circles */
  left: 0;
  right: 0;
  height: 2px; /* Thinner line */
  background-color: #ddd;
  z-index: 1;
}

/* Progress bar line - filled */
.progress-bar::after {
  content: '';
  position: absolute;
  top: 15px; /* Align with step circles */
  left: 0;
  width: 75%; /* Extends to step 3 */
  height: 2px; /* Thinner line */
  background-color: #ff6b8a;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-circle {
  width: 24px; /* Slightly smaller circles */
  height: 24px;
  border-radius: 50%;
  background-color: #ddd;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 8px;
}

.progress-step.active .step-circle {
  background-color: #ff6b8a;
  color: white;
}

.step-label {
  font-size: 11px; /* Smaller font */
  text-align: center;
  color: #999;
  font-weight: 400;
  max-width: 80px;
  line-height: 1.2;
}

.progress-step.active .step-label {
  color: #ff6b8a;
  font-weight: 700;
}

/* PDF Container Styles */
.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: calc(100vh - 280px); /* Adjusted for progress bar */
  margin-bottom: 80px; /* Space for fixed buttons */
}

/* PDF Viewer Styles */
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
  background-color: #ff6b8a; /* Changed to pink to match design */
  border-radius: 50%;
}

/* Navigation Buttons */
.form-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-back, .btn-next {
  background-color: #ff6b8a;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

/* Custom scrollbar */
.pdf-container::-webkit-scrollbar,
.form-section::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.pdf-container::-webkit-scrollbar-track,
.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.pdf-container::-webkit-scrollbar-thumb,
.form-section::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.pdf-container::-webkit-scrollbar-thumb:hover,
.form-section::-webkit-scrollbar-thumb:hover {
  background: #ff6b8a;
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

  .progress-container {
    padding: 0 10px;
  }

  .pdf-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .step-label {
    font-size: 10px;
  }
}
</style>