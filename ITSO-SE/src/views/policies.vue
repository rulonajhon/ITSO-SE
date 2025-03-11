<template>
    <div class="page-wrapper">
      <Navbar />
      
      <!-- Banner Image -->
      <div class="banner-wrapper">
        <img src="../assets/banner.png" alt="ITSO Banner" class="banner-image" />
        <div class="banner-overlay">Policies</div>
      </div>
  
      <!-- Content -->
      <div class="container">
        <div class="content-placeholder">
          <p>
            Universities and research institutions have a vital role in driving socio-economic development by fostering innovation and scientific progress. Intellectual property (IP) systems serve as the primary means of capturing the value of innovations, allowing universities and society to commercialize their knowledge assets. This facilitates additional funding opportunities for further research and collaborations with the private sector, ultimately ensuring that research remains relevant and impactful in society.
          </p>
          
          <p>
            The University of the Immaculate Conception (The University) shares this belief and emphasizes the protection of faculty and students' creative works, inventions, and research, along with all other forms of intellectual property (IPs). In July 2015, the University took a significant step by signing a Memorandum of Agreement (MOA) with the Intellectual Property Office of the Philippines (IPOPHL) to establish an Innovation and Technology Support Office (ITSO), also known as the patent library. The UIC IP Office serves as the ITSO and adheres to the ITSO Franchise Operations Manual, which is exclusively accessible to ITSO Network members.
          </p>
        </div>
        
        <p class="policy-intro">The following are the policies of ITSO:</p>
        
        <ol class="policy-list">
          <li>Preface</li>
          <li>Definitions</li>
          <li>Scope of the Policies</li>
          <li>Governance and Operation</li>
          <li>Pre-requisite in Engaging Projects with the University</li>
          <li>General Principles</li>
          <li>Copyright</li>
          <li>Patent</li>
          <li>Trademark</li>
          <li>Research Contracts</li>
          <li>Confidentiality</li>
          <li>Waiver</li>
          <li>Potential Protectable IP</li>
          <li>Commercialization of IP</li>
          <li>Incentives and Distribution of Revenues</li>
          <li>Conflict of Interest and Conflict of Commitment</li>
          <li>Legal Management</li>
          <li>Disputed Resolution</li>
          <li>Breach</li>
          <li>Miscellaneous</li>
          <li>Effectivity</li>
        </ol>
      </div>
    </div>
  </template>

<script setup>
import Navbar from "../components/navigationbar.vue";
</script>

<style>
/* Global reset */
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
}

/* Page wrapper */
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Banner styles */
.banner-wrapper {
  width: 100%;
  height: 50vh; /* Reduced height for smaller screens */
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* Ensure image is centered */
  display: block;
}

/* Container for content */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* Section styling - Now centered */
.section {
  text-align: center; /* Changed from left to center */
  margin-bottom: 40px;
  padding: 0 20px;
}

.section:last-child {
  margin-bottom: 0;
}

/* Typography */
h2 {
  color: #f47b91;
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center; /* Ensure headings are centered */
}

p {
  color: #000000;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  text-align: center; /* Ensure paragraphs are centered */
}

/* Media Queries for different screen sizes */
/* For 1024x600 and similar resolutions */
@media (max-width: 1024px) and (max-height: 768px) {
  .banner-wrapper {
    height: 40vh; /* Smaller banner for smaller screens */
  }
  
  .container {
    padding: 30px 15px;
  }
  
  .section {
    margin-bottom: 30px;
  }
  
  h2 {
    font-size: 28px;
  }
  
  p {
    font-size: 15px;
  }
}

/* For mobile devices */
@media (max-width: 768px) {
  .banner-wrapper {
    height: 30vh;
  }
  
  .container {
    padding: 20px 15px;
  }
  
  .section {
    margin-bottom: 25px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
  }
}

/* For very small screens */
@media (max-width: 480px) {
  .banner-wrapper {
    height: 25vh;
  }
  
  h2 {
    font-size: 22px;
  }
  
  p {
    font-size: 13px;
  }
}
</style>