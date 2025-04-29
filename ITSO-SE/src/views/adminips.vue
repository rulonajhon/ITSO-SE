<template>
  <div class="min-h-screen bg-pink-50 p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-pink-700">Submitted Applications</h1>

    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse bg-white shadow rounded-xl overflow-hidden">
        <thead class="bg-pink-100 text-pink-800">
          <tr>
            <th class="p-3 text-left">Type of Application</th>
            <th class="p-3 text-left">Title of Research</th>
            <th class="p-3 text-left">Department</th>
            <th class="p-3 text-left">Date</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(project, index) in paginatedProjects" :key="project.id" class="border-b hover:bg-pink-50">
            <td class="p-3 capitalize">{{ project.typeOfApplication || 'N/A' }}</td>
            <td class="p-3">{{ project.fileName || 'N/A' }}</td>
            <td class="p-3">{{ project.department || 'N/A' }}</td>
            <td class="p-3">{{ formatDate(project.uploadedAt) }}</td>

            <td class="p-3">
              <!-- Status dropdown with colored backgrounds -->
              <select 
                v-model="project.status" 
                @change="updateStatus(project)" 
                class="p-1 border rounded focus:ring-2 focus:ring-pink-500 text-white font-medium"
                :class="getStatusBackgroundClass(project.status)"
              >
                <option value="Approved" class="bg-green-500 text-white">Approved</option>
                <option value="Pending" class="bg-yellow-500 text-white">Pending</option>
                <option value="Rejected" class="bg-red-500 text-white">Rejected</option>
                <option value="Revision" class="bg-orange-500 text-white">Revision</option>
              </select>
            </td>

            <td class="p-3 text-center space-y-2">
              <router-link :to="`/adminviewips/${project.id}`" class="inline-block bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded transition">
                View
              </router-link>

              <div v-if="project.fileUrl">
                <a :href="project.fileUrl" target="_blank" class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition">
                  Download
                </a>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedProjects.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">No results found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination flex items-center justify-center gap-4 mt-6">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-pink-300 hover:bg-pink-400">
        Previous
      </button>
      <span class="font-medium text-pink-700">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-pink-300 hover:bg-pink-400">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { getStorage, ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';

const projects = ref([]);
const filters = ref({
  fileName: '',
  typeOfApplication: '',
  department: '',
  date: '',
  status: '',
});

const currentPage = ref(1);
const rowsPerPage = 5;
const sortKey = ref('');
const sortOrder = ref('asc');

const storage = getStorage();

// Fetch projects from Firestore
const fetchProjects = async () => {
  try {
    const projectList = [];

    // Fetch from submissions collection
    const submissionSnapshot = await getDocs(collection(db, 'submissions'));
    submissionSnapshot.forEach(doc => {
      const data = doc.data();
      projectList.push({
        id: doc.id,
        source: 'submissions',
        typeOfApplication: data.applicationType || '',
        fileName: data.title || '',
        department: data.department || '',
        uploadedAt: data.createdAt || null,
        status: data.status || '',
      });
    });

    // Fetch from competitions collection
    const competitionSnapshot = await getDocs(collection(db, 'competitions'));
    competitionSnapshot.forEach(doc => {
      const data = doc.data();
      projectList.push({
        id: doc.id,
        source: 'competitions',
        typeOfApplication: data.applicationType || '',
        fileName: data.title || '',
        department: data.department || '',
        uploadedAt: data.submittedAt || null,
        status: data.status || '',
      });
    });

    projects.value = projectList;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

// Fetch files from Storage
const fetchStorageFiles = async () => {
  try {
    const allFiles = [];

    // Fetch files from the submissions folder (ipapplication)
    const submissionsFolder = storageRef(storage, 'submissions/ipapplication/');
    const submissionsList = await listAll(submissionsFolder);

    for (const item of submissionsList.items) {
      const url = await getDownloadURL(item);
      allFiles.push({ name: item.name, url, folder: 'submissions/ipapplication' });
    }

    // Fetch files from the competition folder
    const competitionFolder = storageRef(storage, 'submissions/competition/');
    const competitionList = await listAll(competitionFolder);

    for (const item of competitionList.items) {
      const url = await getDownloadURL(item);
      allFiles.push({ name: item.name, url, folder: 'submissions/competition' });
    }

    // Match file URLs to projects
    for (const project of projects.value) {
      const matchedFile = allFiles.find(file => file.name.includes(project.id));
      if (matchedFile) {
        project.fileUrl = matchedFile.url;
      }
    }
  } catch (error) {
    console.error('Error fetching storage files:', error);
  }
};

// Method to update status in Firestore
const updateStatus = async (project) => {
  try {
    let projectRef;

    // Determine which collection the project belongs to and update the status
    if (project.source === 'submissions') {
      projectRef = doc(db, 'submissions', project.id);
    } else if (project.source === 'competitions') {
      projectRef = doc(db, 'competitions', project.id);
    }

    // Update the status in Firestore
    await updateDoc(projectRef, {
      status: project.status
    });

    console.log('Status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

// Get status background color class
const getStatusBackgroundClass = status => {
  if (status === 'Approved') return 'bg-green-500';
  if (status === 'Pending') return 'bg-yellow-500';
  if (status === 'Rejected') return 'bg-red-500';
  if (status === 'Revision') return 'bg-orange-500';
  return 'bg-gray-500'; // Default gray if none matches
};

// Filtered Projects (with search and filtering)
const filteredProjects = computed(() => {
  return projects.value
    .filter(project => {
      const matchesFileName = !filters.value.fileName || project.fileName?.toLowerCase().includes(filters.value.fileName.toLowerCase());
      const matchesType = !filters.value.typeOfApplication || project.typeOfApplication === filters.value.typeOfApplication;
      const matchesDepartment = !filters.value.department || project.department === filters.value.department;
      const matchesDate = !filters.value.date || (project.uploadedAt && new Date(project.uploadedAt.seconds * 1000).toISOString().split('T')[0] === filters.value.date);
      const matchesStatus = !filters.value.status || project.status === filters.value.status;
      return matchesFileName && matchesType && matchesDepartment && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      if (sortKey.value) {
        const aValue = a[sortKey.value];
        const bValue = b[sortKey.value];
        if (typeof aValue === 'string') {
          return sortOrder.value === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number') {
          return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
        }
      }
      return 0;
    });
});

// Pagination Methods
const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage));

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return filteredProjects.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatDate = timestamp => {
  if (!timestamp || !timestamp.seconds) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

onMounted(async () => {
  await fetchProjects();
  await fetchStorageFiles();
});
</script>



<style scoped>
/* Prevent table cell wrap */
th, td {
  white-space: nowrap;
}

.pagination{
    display: flex;
    justify-content: center;
}

/* Base styles */
.app-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  position: relative;
  padding-top: 60px; /* Adjust for navbar height */
  background-color: #fff;
}

/* Header styles */
.header {
  background-color: #ff8a9e;
  padding: 1rem 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-link {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0 1rem;
  text-decoration: none;
}

.notification-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.profile-circle {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #e0e0e0;
  border-radius: 50%;
}

/* Page title */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ff4f79;
  text-align: center;
  margin: 2rem 0;
}

/* Search and filter bar */
.search-container {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
}

.search-input {
  padding: 0.5rem;
  border: none;
  outline: none;
  width: 250px;
  font-size: 0.9rem;
}

.search-button {
  background: transparent;
  border: none;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ff4f79;
}

.filter-button {
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* Table container */
.projects-table {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0 auto;
  width: 95%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Table layout */
.table-header,
.table-filters,
.table-row {
  display: grid;
  grid-template-columns: 1fr 2.2fr 1.4fr 0.9fr 0.9fr 0.5fr;
  align-items: center;
}

.table-header {
  background-color: #ff8a9e;
  color: white;
  font-weight: bold;
}

.header-cell,
.filter-cell,
.row-cell {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
}

.table-filters {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.filter-cell {
  position: relative;
}

.filter-input {
  width: 90%;
  padding: 0.4rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  font-size: 0.85rem;
}

.filter-icons {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
}

.table-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #fff3f5;
}

.row-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* View button */
.view-button {
  background: transparent;
  border: none;
  color: #ff4f79;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Status indicators */
.status-approved {
  color: green;
  font-weight: 600;
}

.status-pending {
  color: #f1c40f;
  font-weight: 600;
}

.status-rejected {
  color: #e74c3c;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .table-header,
  .table-filters,
  .table-row {
    grid-template-columns: 1fr 1.5fr 1.2fr 0.8fr 0.8fr 0.5fr;
  }
}

@media (max-width: 768px) {
  .nav-link {
    font-size: 1rem;
  }

  .main-nav ul {
    gap: 1rem;
  }

  .table-header,
  .table-filters,
  .table-row {
    font-size: 0.75rem;
  }
}

/* Main content spacing */
main {
  z-index: 1;
  position: relative;
  padding-bottom: 2rem;
}

/* General styles */
body {
  font-family: Arial, sans-serif;
  background-color: #fff;
}

/* Page container */
.min-h-screen {
  background-color: #fff;
  padding: 2rem;
}

/* Page title */
h1 {
  margin-top: 50px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff4f79;
  text-align: center;
  margin-bottom: 2rem;
}

/* Filters section */
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.sm\:grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.md\:grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.lg\:grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: #ff4f79;
  box-shadow: 0 0 0 3px rgba(255, 79, 121, 0.2);
}

input::placeholder {
  color: #aaa;
}

/* Table container */
.overflow-x-auto {
  overflow-x: auto;
  margin-top: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Table header */
thead {
  background-color: #ff8a9e;
  color: white;
  text-transform: uppercase;
  font-size: 0.9rem;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  white-space: nowrap;
}

/* Table rows */
tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #fff3f5;
}

td {
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

td.capitalize {
  text-transform: capitalize;
}

/* Status badges */
span {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

.bg-green-100 {
  background-color: #d4edda;
  color: #155724;
}

.bg-yellow-100 {
  background-color: #fff3cd;
  color: #856404;
}

.bg-red-100 {
  background-color: #f8d7da;
  color: #721c24;
}

.bg-gray-100 {
  background-color: #f1f1f1;
  color: #6c757d;
}

/* View button */
a {
  display: inline-block;
  background-color: #ff4f79;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

a:hover {
  background-color: #e63950;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  th, td {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  input {
    font-size: 0.8rem;
  }

  th, td {
    font-size: 0.75rem;
  }
}
</style>