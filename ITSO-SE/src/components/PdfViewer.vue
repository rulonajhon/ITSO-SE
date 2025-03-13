<template>
  <div class="pdf-container">
    <div class="controls">
      <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
      <button @click="zoomOut">-</button>
      <span>Zoom: {{ (scale * 100).toFixed(0) }}%</span>
      <button @click="zoomIn">+</button>
    </div>
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const pdfCanvas = ref(null);
const pdfUrl = "/examplepdf.pdf";
const pdfDoc = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1.5);

const renderPage = async (pageNumber) => {
  if (!pdfDoc.value) {
    console.error("PDF document is not loaded yet.");
    return;
  }

  try {
    const rawPdfDoc = toRaw(pdfDoc.value); // Unwrap the proxy
    const page = await rawPdfDoc.getPage(pageNumber);

    if (!page) {
      console.error("Page not found:", pageNumber);
      return;
    }

    console.log(`Rendering page ${pageNumber}`); // Debugging log

    const canvas = pdfCanvas.value;
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: scale.value });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: context, viewport };
    await page.render(renderContext).promise;
  } catch (error) {
    console.error("Error rendering page:", error);
  }
};


const loadPDF = async () => {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    pdfDoc.value = await loadingTask.promise;

    if (!pdfDoc.value) {
      console.error("PDF document failed to load.");
      return;
    }

    console.log("PDF Loaded, total pages:", pdfDoc.value.numPages); // Debugging Log

    totalPages.value = pdfDoc.value.numPages;

    // Delay to ensure pdfDoc.value is fully loaded
    setTimeout(() => {
      renderPage(currentPage.value);
    }, 500);
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
};



// Pagination functions
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

onMounted(loadPDF);
</script>

<style>
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: auto;
}

canvas {
  border: 1px solid #ccc;
  max-width: 100%;
}

.controls {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
