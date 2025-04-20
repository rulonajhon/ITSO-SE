<template>
    <div class="app-container">
      <!-- Header Navigation -->
      <header class="header">
        <div class="container mx-auto flex items-center justify-between">
          <div class="flex items-center">
            <img src="C:\Users\user\Documents\ITSO-SE\ITSO-SE\ITSO-SE\src\assets\logo.png" alt="University Logo" class="w-10 h-10" />
          </div>
          <nav class="main-nav">
            <ul class="flex space-x-10">
              <li><a href="#" class="nav-link">Home</a></li>
              <li><a href="#" class="nav-link">Projects</a></li>
              <li><a href="#" class="nav-link">Policies</a></li>
              <li><a href="#" class="nav-link">Contact</a></li>
            </ul>
          </nav>
          <div class="flex items-center space-x-4">
            <button class="notification-btn">
              <BellIcon class="w-6 h-6 text-white" />
            </button>
            <div class="profile-circle"></div>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="container mx-auto py-8 px-4">
        <h1 class="page-title">Projects/Submissions</h1>
        
        <!-- Search and Filter Bar -->
        <div class="flex justify-end mb-4">
          <div class="search-container">
            <input 
              type="text" 
              placeholder="Search Project" 
              v-model="searchQuery"
              class="search-input"
            />
            <button class="search-button">
              <SearchIcon class="w-4 h-4" />
            </button>
          </div>
          <button class="filter-button ml-2">
            <ListFilterIcon class="w-5 h-5" />
          </button>
        </div>
  
        <!-- Projects Table -->
        <div class="projects-table">
          <!-- Table Header -->
          <div class="table-header">
            <div class="header-cell">Type of Application</div>
            <div class="header-cell">Title of the Research</div>
            <div class="header-cell">Department</div>
            <div class="header-cell">Date</div>
            <div class="header-cell">Status</div>
            <div class="header-cell">View</div>
          </div>
  
          <!-- Table Filters -->
          <div class="table-filters">
            <div class="filter-cell">
              <input 
                type="text" 
                placeholder="Search by Application" 
                v-model="filters.type"
                class="filter-input"
              />
              <div class="filter-icons">
                <SearchIcon class="w-3 h-3" />
                <FilterIcon class="w-3 h-3" />
              </div>
            </div>
            <div class="filter-cell">
              <input 
                type="text" 
                placeholder="Search by Title" 
                v-model="filters.title"
                class="filter-input"
              />
              <div class="filter-icons">
                <SearchIcon class="w-3 h-3" />
                <FilterIcon class="w-3 h-3" />
              </div>
            </div>
            <div class="filter-cell">
              <input 
                type="text" 
                placeholder="Search by Department" 
                v-model="filters.department"
                class="filter-input"
              />
              <div class="filter-icons">
                <SearchIcon class="w-3 h-3" />
                <FilterIcon class="w-3 h-3" />
              </div>
            </div>
            <div class="filter-cell">
              <input 
                type="text" 
                placeholder="Search by Date" 
                v-model="filters.date"
                class="filter-input"
              />
              <div class="filter-icons">
                <SearchIcon class="w-3 h-3" />
                <FilterIcon class="w-3 h-3" />
              </div>
            </div>
            <div class="filter-cell">
              <input 
                type="text" 
                placeholder="Search by Status" 
                v-model="filters.status"
                class="filter-input"
              />
              <div class="filter-icons">
                <SearchIcon class="w-3 h-3" />
                <FilterIcon class="w-3 h-3" />
              </div>
            </div>
            <div class="filter-cell"></div>
          </div>
  
          <!-- Table Rows -->
          <div v-for="(project, index) in filteredProjects" :key="index" class="table-row">
            <div class="row-cell">{{ project.type }}</div>
            <div class="row-cell">{{ project.title }}</div>
            <div class="row-cell">{{ project.department }}</div>
            <div class="row-cell">{{ project.date }}</div>
            <div class="row-cell" :class="getStatusClass(project.status)">{{ project.status }}</div>
            <div class="row-cell flex justify-center">
              <button class="view-button">
                <EyeIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { BellIcon, SearchIcon, ListFilterIcon, FilterIcon, EyeIcon } from 'lucide-vue-next'
  
  // Search and filters
  const searchQuery = ref('')
  const filters = ref({
    type: '',
    title: '',
    department: '',
    date: '',
    status: ''
  })
  
  // Project data
  const projects = ref([
    {
      type: 'IP Protection Application',
      title: 'Artificial Intelligence in Healthcare: Developing AI Algorithms for Early Disease Detection',
      department: 'College of Computer Studies',
      date: '03-22-25',
      status: 'Approved'
    },
    {
      type: 'Request for Joining Competition',
      title: 'The Role of AI in Enhancing Medical Diagnostics Accuracy',
      department: 'College of Pharmacy',
      date: '01-30-25',
      status: 'Pending'
    },
    {
      type: 'Request for Joining Competition',
      title: 'Machine Learning Techniques for Identifying Genetic Markers in Diseases',
      department: 'College of Pharmacy',
      date: '01-14-25',
      status: 'Pending'
    },
    {
      type: 'IP Protection Application',
      title: 'AI-Based Solutions for Optimizing Hospital Resource Allocation',
      department: 'College of Pharmacy',
      date: '03-22-25',
      status: 'Rejected'
    },
    {
      type: 'IP Protection Application',
      title: 'The Impact of AI on Business Management and Operational Efficiency',
      department: 'College of Accounting and Business Education',
      date: '02-03-25',
      status: 'Approved'
    }
  ])
  
  // Filter projects based on search query and column filters
  const filteredProjects = computed(() => {
    return projects.value.filter(project => {
      // Global search
      if (searchQuery.value && !Object.values(project).some(value => 
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )) {
        return false
      }
      
      // Column filters
      if (filters.value.type && !project.type.toLowerCase().includes(filters.value.type.toLowerCase())) {
        return false
      }
      if (filters.value.title && !project.title.toLowerCase().includes(filters.value.title.toLowerCase())) {
        return false
      }
      if (filters.value.department && !project.department.toLowerCase().includes(filters.value.department.toLowerCase())) {
        return false
      }
      if (filters.value.date && !project.date.includes(filters.value.date)) {
        return false
      }
      if (filters.value.status && !project.status.toLowerCase().includes(filters.value.status.toLowerCase())) {
        return false
      }
      
      return true
    })
  })
  
  // Get CSS class based on status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved'
      case 'pending':
        return 'status-pending'
      case 'rejected':
        return 'status-rejected'
      default:
        return ''
    }
  }
  </script>
  
  <style scoped>
  /* Base styles */
  .app-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
  }
  
  /* Header styles */
  .header {
    background-color: #ff8a9e;
    padding: 1rem;
    color: white;
  }
  
  .nav-link {
    color: white;
    font-weight: 600;
    font-size: 1.2rem;
  }
  
  .notification-btn {
    background: transparent;
    border: none;
  }
  
  .profile-circle {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #e0e0e0;
    border-radius: 50%;
  }
  
  /* Main content styles */
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    color: #ff8a9e;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  /* Search bar */
  .search-container {
    display: flex;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .search-input {
    padding: 0.5rem;
    border: none;
    outline: none;
    width: 250px;
  }
  
  .search-button {
    background: white;
    border: none;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
  }
  
  .filter-button {
    border: 1px solid #ddd;
    background: white;
    border-radius: 0.25rem;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
  }
  
  /* Table styles */
  .projects-table {
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 0.7fr 0.7fr 0.5fr;
    background-color: #ff8a9e;
    color: white;
    font-weight: 600;
  }
  
  .header-cell {
    padding: 0.75rem;
    text-align: center;
  }
  
  .table-filters {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 0.7fr 0.7fr 0.5fr;
    border-bottom: 1px solid #ddd;
  }
  
  .filter-cell {
    padding: 0.5rem;
    position: relative;
  }
  
  .filter-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: 0.75rem;
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
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 0.7fr 0.7fr 0.5fr;
    border-bottom: 1px solid #ddd;
  }
  
  .row-cell {
    padding: 0.75rem;
    display: flex;
    align-items: center;
  }
  
  .view-button {
    color: #ff8a9e;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
  /* Status colors */
  .status-approved {
    color: green;
    font-weight: 600;
  }
  
  .status-pending {
    color: orange;
    font-weight: 600;
  }
  
  .status-rejected {
    color: red;
    font-weight: 600;
  }
  
  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .table-header, .table-filters, .table-row {
      grid-template-columns: 1fr 1.5fr 1fr 0.7fr 0.7fr 0.5fr;
    }
  }
  
  @media (max-width: 768px) {
    .main-nav ul {
      gap: 1rem;
    }
    
    .nav-link {
      font-size: 1rem;
    }
    
    .table-header, .table-filters, .table-row {
      font-size: 0.8rem;
    }
  }
  </style>