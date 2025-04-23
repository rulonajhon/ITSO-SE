<template>
  <div class="page-wrapper">
    <div class="page-container">
    <h1 class="form-title">Document Checklist</h1>
    
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="ips3-progress-bar">
        <div :class="['progress-step', currentStep >= 1 ? 'active' : '']">
          <div class="step-circle">1</div>
          <div class="step-label">Basic Information</div>
        </div>
        <div :class="['progress-step', currentStep >= 2 ? 'active' : '']">
          <div class="step-circle">2</div>
          <div class="step-label">Documents</div>
        </div>
        <div :class="['progress-step', currentStep >= 3 ? 'active' : '']">
          <div class="step-circle">3</div>
          <div class="step-label">Checklist</div>
        </div>
        <div :class="['progress-step', currentStep >= 4 ? 'active' : '']">
          <div class="step-circle">4</div>
          <div class="step-label">Review</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <!-- Left Column - PDF Viewer -->
      <div class="pdf-section">
        <!-- Sticky Toolbar Header -->
        <div class="pdf-toolbar-header">
          <div class="toolbar-row">
            <!-- Tools on the left -->
            <div class="annotation-toolbar">
              <button :class="{active: tool==='highlight'}" @click="selectTool('highlight')" title="Highlight">
                <span class="icon">&#128396;</span>
              </button>
              <button :class="{active: tool==='text'}" @click="selectTool('text')" title="Text">
                <span class="icon">&#128221;</span>
              </button>
              <button :class="{active: tool==='draw'}" @click="selectTool('draw')" title="Draw">
                <span class="icon">&#9998;</span>
              </button>
              <button :class="{active: tool==='eraser'}" @click="selectTool('eraser')" title="Eraser">
                <span class="icon">&#9003;</span>
              </button>
              <button :class="{active: tool==='image'}" @click="selectTool('image')" title="Add/Edit Image">
                <span class="icon">&#128247;</span>
              </button>
              <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="onImageSelected" />
              <button @click="saveAnnotations" title="Save">
                <span class="icon">&#128190;</span>
              </button>
            </div>
            <!-- Zoom in the center -->
            <div class="zoom-controls">
              <button @click="zoomOut">-</button>
              <span>{{ (scale * 100).toFixed(0) }}%</span>
              <button @click="zoomIn">+</button>
            </div>
            <!-- Pagination on the right -->
            <div class="page-controls">
              <button @click="prevPage" :disabled="currentPage <= 1">&#8592;</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage >= totalPages">&#8594;</button>
            </div>
          </div>
          <!-- Tool Options -->
          <div v-if="tool === 'highlight'" class="tool-options">
            <label>
              Color:
              <input type="color" v-model="highlightColor" />
            </label>
            <label>
              Contrast:
              <input type="range" min="0.1" max="1" step="0.05" v-model.number="highlightAlpha" />
              {{ highlightAlpha }}
            </label>
          </div>
          <div v-if="tool === 'draw'" class="tool-options">
            <label>
              Color:
              <input type="color" v-model="drawColor" />
            </label>
            <label>
              Thickness:
              <input type="range" min="1" max="20" v-model.number="drawThickness" />
              {{ drawThickness }}
            </label>
          </div>
          <div v-if="tool === 'eraser'" class="tool-options">
            <label>
              Eraser Thickness:
              <input type="range" min="10" max="40" v-model.number="eraserThickness" />
              {{ eraserThickness }}
            </label>
          </div>
          <div v-if="tool === 'text'" class="tool-options">
            <label>
              Color:
              <input type="color" v-model="textColor" />
            </label>
            <label>
              Size:
              <input type="number" min="8" max="72" v-model.number="textSize" style="width:50px" />
            </label>
            <label>
              Font:
              <select v-model="textFont">
                <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
              </select>
            </label>
          </div>
        </div>
        <div class="pdf-viewer">
          <div class="pdf-container">
            <div class="canvas-stack">
              <div class="canvas-scroll">
                <canvas ref="pdfCanvas"></canvas>
                <canvas ref="annotationCanvas"
                  class="annotation-canvas"
                  @mousedown="onCanvasMouseDown"
                  @mousemove="onCanvasMouseMove"
                  @mouseup="onCanvasMouseUp"
                  @mouseleave="onCanvasMouseUp"
                  @click="handleCanvasClick"
                ></canvas>
                <!-- Render text and image controls -->
                <template v-for="(a, idx) in annotations[currentPage] || []">
                  <span
                    v-if="a.type === 'text'"
                    :key="'del-text-'+idx"
                    class="text-delete"
                    :style="{ left: (a.x+60)+'px', top: (a.y-20)+'px' }"
                    @click="deleteAnnotation(idx)"
                    title="Delete text"
                  >&#128465;</span>
                  <template v-if="a.type === 'image'">
                    <span
                      :key="'resize-'+idx"
                      class="image-resize"
                      :style="{ left: (a.x + a.width - 10) + 'px', top: (a.y + a.height - 10) + 'px' }"
                      @mousedown.prevent="startResizeImage(idx, $event)"
                      title="Resize">&#8690;</span>
                    <span
                      :key="'rotate-'+idx"
                      class="image-rotate"
                      :style="{ left: (a.x + a.width/2 - 10) + 'px', top: (a.y - 30) + 'px' }"
                      @mousedown.prevent="startRotateImage(idx, $event)"
                      title="Rotate">&#8635;</span>
                    <span
                      :key="'del-image-'+idx"
                      class="image-delete"
                      :style="{ left: (a.x + a.width - 10) + 'px', top: (a.y - 20) + 'px' }"
                      @click="deleteAnnotation(idx)"
                      title="Delete image"
                    >&#128465;</span>
                  </template>
                </template>
              </div>
            </div>
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
</div>
</template>

<script setup>
import { ref, onMounted, toRaw, watch, nextTick } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useRouter } from 'vue-router';
import { useFormStore } from '@/stores/formStoreips';

const router = useRouter();
const form = useFormStore(); // Access the form store

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// PDF Viewer state
const pdfCanvas = ref(null);
const annotationCanvas = ref(null);
const pdfUrl = ref(null);
const pdfDoc = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1.5);

// Annotation state
const tool = ref(null); // highlight, text, draw, image, eraser
const drawing = ref(false);
const lastPoint = ref({ x: 0, y: 0 });
const annotations = ref({}); // { pageNum: [ {type, ...} ] }
const imageInput = ref(null);
const erasing = ref(false);

// Progress bar data
const steps = ref([
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Document" },
  { id: 3, label: "Documents Checklist" },
  { id: 4, label: "Review" }
]);

const currentStep = ref(3); // Set to current step (3)

// Load PDF from form store (integrated from second document)
const loadPDF = async () => {
  if (!form.mainDocument) {
    console.warn("No PDF file found in form store.");
    return;
  }

  try {
    if (form.uploadedFiles.length === 0) {
      form.uploadedFiles.push({ name: form.mainDocument.name, file: form.mainDocument });
    }
    const blobUrl = URL.createObjectURL(form.mainDocument);
    pdfUrl.value = blobUrl;

    const loadingTask = pdfjsLib.getDocument(blobUrl);
    pdfDoc.value = await loadingTask.promise;
    totalPages.value = pdfDoc.value.numPages;
    await renderPage(currentPage.value);
  } catch (error) {
    console.error("Error loading local PDF:", error);
  }
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

    // Resize annotation canvas to match PDF canvas
    await nextTick();
    const annCanvas = annotationCanvas.value;
    annCanvas.width = viewport.width;
    annCanvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    drawAnnotations();
  } catch (error) {
    console.error("Error rendering page:", error);
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

// Annotation tools logic
const highlightColor = ref('#ffe066');
const highlightAlpha = ref(0.3);
const drawColor = ref('#ff6b8a');
const drawThickness = ref(2);
const eraserThickness = ref(20);
const textColor = ref('#ff6b8a');
const textSize = ref(16);
const textFont = ref('Arial');
const fonts = [
  'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT',
  'Comic Sans MS', 'Impact', 'Lucida Console', 'Palatino Linotype', 'Segoe UI', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald'
];

function selectTool(t) {
  tool.value = t;
  if (t === 'image') {
    imageInput.value.click();
  }
}

// Drag and drop functionality
let draggingItem = null;
let dragOffset = { x: 0, y: 0 };

function onCanvasMouseDown(e) {
  const rect = annotationCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const annots = annotations.value[currentPage.value] || [];

  if (tool.value === 'eraser') {
    erasing.value = true;
    eraseAt(x, y);
  } else if (tool.value === 'text' || tool.value === 'image') {
    // Only allow moving text/image (not draw/highlight)
    draggingItem = annots.find((a, idx) => {
      if (a.type === 'text') {
        const textWidth = 100, textHeight = 20;
        return x >= a.x && x <= a.x + textWidth && y >= a.y - textHeight && y <= a.y;
      } else if (a.type === 'image') {
        return x >= a.x && x <= a.x + a.width && y >= a.y && y <= a.y + a.height;
      }
      return false;
    });
    if (draggingItem) {
      dragOffset.x = x - draggingItem.x;
      dragOffset.y = y - draggingItem.y;
    }
  } else if (tool.value === 'draw' || tool.value === 'highlight') {
    drawing.value = true;
    lastPoint.value = { x, y };
  }
}

function onCanvasMouseMove(e) {
  const rect = annotationCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (drawing.value && (tool.value === 'draw' || tool.value === 'highlight')) {
    const ctx = annotationCanvas.value.getContext('2d');
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = tool.value === 'highlight' ? highlightAlpha.value : 1.0;
    ctx.strokeStyle = tool.value === 'highlight' ? highlightColor.value : drawColor.value;
    ctx.lineWidth = tool.value === 'highlight' ? 20 : drawThickness.value;

    ctx.beginPath();
    ctx.moveTo(lastPoint.value.x, lastPoint.value.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (!annotations.value[currentPage.value]) annotations.value[currentPage.value] = [];
    annotations.value[currentPage.value].push({
      type: tool.value,
      from: { ...lastPoint.value },
      to: { x, y },
      color: tool.value === 'highlight' ? highlightColor.value : drawColor.value,
      alpha: tool.value === 'highlight' ? highlightAlpha.value : 1.0,
      thickness: tool.value === 'highlight' ? 20 : drawThickness.value
    });

    lastPoint.value = { x, y };
  } else if (tool.value === 'eraser' && erasing.value) {
    eraseAt(x, y);
  } else if (draggingItem && (tool.value === 'text' || tool.value === 'image')) {
    draggingItem.x = x - dragOffset.x;
    draggingItem.y = y - dragOffset.y;
    drawAnnotations();
  }
}

function onCanvasMouseUp() {
  drawing.value = false;
  erasing.value = false;
  draggingItem = null;
}

function eraseAt(x, y) {
  const annots = annotations.value[currentPage.value] || [];
  // Only erase draw/highlight lines near the cursor
  for (let i = annots.length - 1; i >= 0; i--) {
    const a = annots[i];
    if ((a.type === 'draw' || a.type === 'highlight')) {
      // Check if cursor is near the line segment
      const dist = pointToSegmentDistance(x, y, a.from, a.to);
      if (dist < eraserThickness.value / 2) {
        annots.splice(i, 1);
      }
    }
  }
  drawAnnotations();
}

function pointToSegmentDistance(px, py, p1, p2) {
  // Standard point-to-segment distance formula
  const x = px, y = py;
  const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function handleCanvasClick(e) {
  if (tool.value === 'text') {
    const rect = annotationCanvas.value.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    const text = prompt("Enter text:");
    if (text) {
      if (!annotations.value[currentPage.value]) annotations.value[currentPage.value] = [];
      annotations.value[currentPage.value].push({
        type: 'text',
        x, y, text,
        color: textColor.value,
        size: textSize.value,
        font: textFont.value
      });
      drawAnnotations();
    }
  }
}

// Delete annotation by index
function deleteAnnotation(idx) {
  if (annotations.value[currentPage.value]) {
    annotations.value[currentPage.value].splice(idx, 1);
    drawAnnotations();
  }
}

// Image handling variables
let resizingImageIdx = ref(null);
let rotatingImageIdx = ref(null);
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
let rotateStart = { x: 0, y: 0, angle: 0 };

function startResizeImage(idx, e) {
  resizingImageIdx.value = idx;
  const img = annotations.value[currentPage.value][idx];
  resizeStart = {
    x: e.clientX,
    y: e.clientY,
    width: img.width,
    height: img.height
  };
  window.addEventListener('mousemove', doResizeImage);
  window.addEventListener('mouseup', stopResizeImage);
}

function doResizeImage(e) {
  if (resizingImageIdx.value === null) return;
  const img = annotations.value[currentPage.value][resizingImageIdx.value];
  const dx = e.clientX - resizeStart.x;
  const dy = e.clientY - resizeStart.y;
  img.width = Math.max(20, resizeStart.width + dx);
  img.height = Math.max(20, resizeStart.height + dy);
  drawAnnotations();
}

function stopResizeImage() {
  resizingImageIdx.value = null;
  window.removeEventListener('mousemove', doResizeImage);
  window.removeEventListener('mouseup', stopResizeImage);
}

function startRotateImage(idx, e) {
  rotatingImageIdx.value = idx;
  const img = annotations.value[currentPage.value][idx];
  const centerX = img.x + img.width / 2;
  const centerY = img.y + img.height / 2;
  rotateStart = {
    x: e.clientX,
    y: e.clientY,
    angle: img.angle || 0,
    centerX,
    centerY
  };
  window.addEventListener('mousemove', doRotateImage);
  window.addEventListener('mouseup', stopRotateImage);
}

function doRotateImage(e) {
  if (rotatingImageIdx.value === null) return;
  const img = annotations.value[currentPage.value][rotatingImageIdx.value];
  const dx = e.clientX - rotateStart.centerX;
  const dy = e.clientY - rotateStart.centerY;
  img.angle = Math.atan2(dy, dx);
  drawAnnotations();
}

function stopRotateImage() {
  rotatingImageIdx.value = null;
  window.removeEventListener('mousemove', doRotateImage);
  window.removeEventListener('mouseup', stopRotateImage);
}

function drawAnnotations() {
  const ctx = annotationCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, annotationCanvas.value.width, annotationCanvas.value.height);
  const annots = annotations.value[currentPage.value] || [];
  annots.forEach((a) => {
    if (a.type === 'draw') {
      ctx.globalAlpha = a.alpha ?? 1.0;
      ctx.strokeStyle = a.color ?? drawColor.value;
      ctx.lineWidth = a.thickness ?? drawThickness.value;
      ctx.beginPath();
      ctx.moveTo(a.from.x, a.from.y);
      ctx.lineTo(a.to.x, a.to.y);
      ctx.stroke();
    } else if (a.type === 'highlight') {
      ctx.globalAlpha = a.alpha ?? highlightAlpha.value;
      ctx.strokeStyle = a.color ?? highlightColor.value;
      ctx.lineWidth = a.thickness ?? 20;
      ctx.beginPath();
      ctx.moveTo(a.from.x, a.from.y);
      ctx.lineTo(a.to.x, a.to.y);
      ctx.stroke();
    } else if (a.type === 'text') {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = a.color ?? textColor.value;
      ctx.font = `${a.size ?? textSize.value}px ${a.font ?? textFont.value}`;
      ctx.fillText(a.text, a.x, a.y);
    } else if (a.type === 'image') {
      const img = new window.Image();
      img.onload = function () {
        ctx.save();
        ctx.globalAlpha = 1.0;
        const cx = a.x + a.width / 2;
        const cy = a.y + a.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate(a.angle || 0);
        ctx.drawImage(img, -a.width / 2, -a.height / 2, a.width, a.height);
        ctx.restore();
      };
      img.src = a.src;
    }
  });
}

function saveAnnotations() {
  // Merge PDF and annotation canvas as image and download
  const pdfC = pdfCanvas.value;
  const annC = annotationCanvas.value;
  const merged = document.createElement('canvas');
  merged.width = pdfC.width;
  merged.height = pdfC.height;
  const ctx = merged.getContext('2d');
  ctx.drawImage(pdfC, 0, 0);
  ctx.drawImage(annC, 0, 0);
  const link = document.createElement('a');
  link.download = `annotated_page${currentPage.value}.png`;
  link.href = merged.toDataURL();
  link.click();
}

function onImageSelected(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new window.Image();
    img.onload = function() {
      // Place image at center of visible canvas
      const canvas = annotationCanvas.value;
      const x = canvas.width / 2 - img.width / 4;
      const y = canvas.height / 2 - img.height / 4;
      if (!annotations.value[currentPage.value]) annotations.value[currentPage.value] = [];
      annotations.value[currentPage.value].push({
        type: 'image',
        x, y, width: img.width/2, height: img.height/2, src: ev.target.result
      });
      drawAnnotations();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Redraw annotations when page or scale changes
watch([currentPage, scale], () => {
  nextTick(drawAnnotations);
});

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
  padding: 5rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Make sure html and body allow scrolling */
:global(html), :global(body) {
  height: auto !important;
  min-height: 100vh !important;
  overflow-y: auto !important;
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
  margin-bottom: 30px;
  position: relative;
}

/* Progress bar - controls the horizontal line */
.ips3-progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
  padding-top: 15px;
}

/* Progress bar line - Only extends to Basic Information */
.ips3-progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  width: 56%;
  height: 10px;
  background-color: #ff6b8a;
  border-radius: 4px;
  z-index: 1;
}

/* Inactive part of the line */
.ips3-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 30%;
  width: 61%;
  height: 10px;
  background-color: #ddd;
  border-radius: 4px;
  z-index: 0;
}

/* Step container */
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

/* Default inactive step */
.progress-step .step-circle {
  width: 24px;
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

/* Active step styling */
.progress-step.active .step-circle {
  background-color: #ff6b8a;
  color: white;
}

/* Step labels */
.progress-step .step-label {
  color: #999;
  font-size: 11px;
  text-align: center;
  font-weight: 400;
  max-width: 80px;
  line-height: 1.2;
}

/* Active step label */
.progress-step.active .step-label {
  color: #ff6b8a;
  font-weight: 700;
}

/* PDF Container Styles */
.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  /* Remove fixed height so it can grow with content */
  /* height: calc(100vh - 280px); */
  margin-bottom: 80px; /* Space for fixed buttons */
  min-height: 0; /* Allow children to shrink/grow */
  flex: 1 1 auto;
  /* Add overflow for scrolling if needed */
  overflow: unset;
  height: unset; /* Let content grow naturally */
}

.pdf-section {
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  /* Remove fixed height/max-height */
  /* height: 100%; */
  /* max-height: 100%; */
  min-height: 0;
  flex: unset;
  overflow: unset;
  height: unset; /* Let section grow with content */
}

/* Sticky Toolbar Header */
.pdf-toolbar-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
  padding: 8px 0;
  width: 100%;
}

.toolbar-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* Distribute tools, zoom, and pagination */
  gap: 24px;
  width: 100%;
}

.annotation-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  background: #fff0f5;
  border-radius: 8px;
  padding: 0 8px;
  border: none;
  font-size: 20px;
  box-shadow: none;
  margin: 0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
}

.zoom-controls button, .page-controls button {
  min-width: 32px;
  min-height: 32px;
}

.tool-options {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  margin: 8px 0 0 0;
  font-size: 15px;
}

.text-delete {
  position: absolute;
  font-size: 18px;
  color: #ff6b8a;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #ff6b8a;
  padding: 2px 4px;
  z-index: 10;
  box-shadow: 0 2px 6px #ff6b8a22;
}

.text-delete:hover {
  background: #ff6b8a;
  color: #fff;
}

.pdf-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem 0 0.5rem;
  border-bottom: none;
  background: transparent;
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

.pdf-viewer {
  position: relative;
  flex: 1 1 auto;
  overflow: visible;
  height: unset;
  max-height: none;
  min-height: 0;
}

.pdf-container {
  position: relative;
  width: 100%;
  min-height: 0;
  /* Remove height: 100% to allow canvas to grow */
  overflow: visible;
  height: fit-content;
}

.canvas-stack {
  position: relative;
  width: fit-content;
  height: fit-content;
  min-height: 0;
}

.canvas-scroll {
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

canvas {
  display: block;
  margin: 0 auto;
  background: transparent;
}

.annotation-canvas {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  z-index: 2;
  /* Make annotation-canvas scrollable vertically */
}

/* Horizontal Annotation Toolbar */
.annotation-toolbar {
  display: flex;
  flex-direction: row; /* horizontal */
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  background: transparent;
  border-radius: 6px;
  padding: 8px 0;
  
}

.annotation-toolbar button {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  font-size: 18px;
  color: #ff6b8a;
  transition: background 0.2s;
}

.annotation-toolbar button.active,
.annotation-toolbar button:hover {
  background: #ff6b8a;
  color: #fff;
}

.annotation-toolbar input[type="file"] {
  display: none;
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #eee;
  z-index: 100;
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
    /* Remove fixed height for mobile too */
    /* height: auto; */
    min-height: 0;
    height: unset;
  }

  .pdf-section, .form-section {
    /* Remove fixed height for mobile */
    /* height: 500px; */
    min-height: 0;
    height: unset;
  }
}

@media (max-width: 640px) {
 
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

.image-resize {
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #ff6b8a;
  border-radius: 50%;
  color: #ff6b8a;
  font-size: 16px;
  cursor: nwse-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
  user-select: none;
}
.image-resize:hover {
  background: #ff6b8a;
  color: #fff;
}
.image-rotate {
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #ff6b8a;
  border-radius: 50%;
  color: #ff6b8a;
  font-size: 16px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
  user-select: none;
}
.image-rotate:hover {
  background: #ff6b8a;
  color: #fff;
}
.image-delete {
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #ff6b8a;
  border-radius: 50%;
  color: #ff6b8a;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
  user-select: none;
}
.image-delete:hover {
  background: #ff6b8a;
  color: #fff;
}
</style>