<template>
    <div class="page-wrapper">
      <Navbar />
      
      <!-- Banner Image -->
      <div class="banner-wrapper">
        <img src="../assets/banner.png" alt="ITSO Banner" class="banner-image" />
      </div>
  
      <!-- Content -->
      <div class="container">
        <!-- Vision Section -->
        <div class="section">
          <h2>Vision</h2>
          <p>
            To simplify and secure IP management while fostering innovation and collaboration.
          </p>
        </div>
  
        <!-- Mission Section -->
        <div class="section">
          <h2>Mission</h2>
          <p>
            To provide an innovative and user-friendly IP management system that streamlines the submission and 
            protection process, ensuring data security and compliance while fostering a culture of innovation.
          </p>
        </div>
  
        <!-- Overview Section -->
        <div class="section">
          <h2>Overview</h2>
          <p>
            UIC's Innovation & Technology Support Office (ITSO) protects intellectual property, helps researchers manage 
            IP, supports technology transfer, and assists with commercialization and legal IP matters.
          </p>
        </div>
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