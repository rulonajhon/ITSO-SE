<template>
  <div class="min-h-screen bg-pink-50 p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-pink-700">Submitted Applications</h1>

    <!-- Updated Table -->
    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse bg-white shadow rounded-xl overflow-hidden">
        <thead class="bg-pink-100 text-pink-800">
          <tr>
            <!-- Type of Application -->
            <th class="p-3 text-left">
              Type of Application
              <div class="mt-2">
                <select
                  v-model="filters.typeOfApplication"
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">All</option>
                  <option value="IP Protection Application">IP Protection Application</option>
                  <option value="Request for Joining Competition">Request for Joining Competition</option>
                </select>
              </div>
            </th>

            <!-- Title of Research -->
            <th class="p-3 text-left">
              Title of Research
              <div class="flex items-center space-x-2 mt-2">
                <input
                  v-model="filters.fileName"
                  type="text"
                  placeholder="Search Title"
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  @click="sortBy('fileName')"
                  class="text-pink-500 hover:text-pink-700"
                  title="Sort by Title"
                >
                  <i class="fas fa-sort"></i>
                </button>
              </div>
            </th>

            <!-- Department -->
            <th class="p-3 text-left">
              Department
              <div class="mt-2">
                <select
                  v-model="filters.department"
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">All</option>
                  <option value="College of Computer Studies">College of Computer Studies</option>
                  <option value="College of Pharmacy">College of Pharmacy</option>
                  <option value="College of Accounting and Business Education">College of Accounting and Business Education</option>
                </select>
              </div>
            </th>

            <!-- Date -->
            <th class="p-3 text-left">
              Date
              <div class="flex items-center space-x-2 mt-2">
                <input
                  v-model="filters.date"
                  type="date"
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  @click="sortBy('uploadedAt')"
                  class="text-pink-500 hover:text-pink-700"
                  title="Sort by Date"
                >
                  <i class="fas fa-sort"></i>
                </button>
              </div>
            </th>

            <!-- Status -->
            <th class="p-3 text-left">
              Status
              <div class="mt-2">
                <select
                  v-model="filters.status"
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </th>

            <!-- Actions -->
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(project, index) in paginatedProjects"
            :key="project.id"
            class="border-b hover:bg-pink-50"
          >
            <td class="p-3 capitalize">{{ project.typeOfApplication || 'N/A' }}</td>
            <td class="p-3">{{ project.fileName }}</td>
            <td class="p-3">{{ project.department || 'N/A' }}</td>
            <td class="p-3">{{ formatDate(project.uploadedAt) }}</td>
            <td class="p-3">
              <span :class="getStatusClass(project.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ project.status }}
              </span>
            </td>
            <td class="p-3 text-center">
                <router-link
                :to="`/adminviewips/${project.id}`"
                class="inline-block bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded transition"
              >
                View
              </router-link>
              
            </td>
          </tr>
          <tr v-if="paginatedProjects.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">No results found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Centered Pagination Controls -->
    <div class="pagination">
        <div class="pagination-controls flex items-center gap-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded"
          >
            Previous
          </button>
          <span class="font-medium text-pink-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

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

const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'IP_Protection'));
    projects.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const filteredProjects = computed(() => {
  return projects.value
    .filter(project => {
      const matchesFileName = !filters.value.fileName || project.fileName?.toLowerCase().includes(filters.value.fileName.toLowerCase());
      const matchesType = !filters.value.typeOfApplication || project.typeOfApplication === filters.value.typeOfApplication;
      const matchesDepartment = !filters.value.department || project.department === filters.value.department;
      const matchesDate = !filters.value.date || new Date(project.uploadedAt.seconds * 1000).toISOString().split('T')[0] === filters.value.date;
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

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage));

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return filteredProjects.value.slice(start, end);
});

const sortKey = ref('');
const sortOrder = ref('asc');

const sortBy = key => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatDate = timestamp => {
  if (!timestamp || !timestamp.seconds) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

const getStatusClass = status => {
  const statusLower = (status || '').toLowerCase();
  if (statusLower === 'approved') return 'bg-green-100 text-green-700';
  if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (statusLower === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(() => {
  fetchProjects();
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