<template>
    <div class="page-wrapper">
      <Navbar />
      
      <!-- Banner Image - Keeping original style -->
      <div class="banner-wrapper">
        <img src="../assets/banner.png" alt="ITSO Banner" class="banner-image" />
      </div>
  
      <!-- Content -->
      <div class="container">
        <div class="contact-container">
          <!-- Contact Details -->
          <div class="contact-info">
            <div class="contact-message">
              <h2>Contact Details:</h2>
            </div>
            
            <div class="info-box">
              <i class="fas fa-envelope contact-icon"></i>
              <div class="info-value">
                <h3>Email</h3>
                <p>example@euic.edu.ph</p>
              </div>
            </div>
  
            <div class="info-box">
              <i class="fas fa-phone contact-icon"></i>
              <div class="info-value">
                <h3>Phone</h3>
                <p>561-456-2321</p>
                <p>561-456-2321</p>
              </div>
            </div>
  
            <div class="info-box">
              <i class="fas fa-map-marker-alt contact-icon"></i>
              <div class="info-value">
                <h3>Address</h3>
                <p>123 University Avenue Campus Building, Room 456 City, State 12345</p>
              </div>
            </div>
  
            <div class="info-box">
              <i class="fas fa-clock contact-icon"></i>
              <div class="info-value">
                <h3>Support Hours</h3>
                <p>When you can reach us</p>
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 12:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
  
            <div class="info-box social-box">
              <i class="fab fa-facebook-f contact-icon social"></i>
              <i class="fab fa-youtube contact-icon social"></i>
              <i class="fab fa-instagram contact-icon social"></i>
              <i class="fab fa-linkedin-in contact-icon social"></i>
            </div>
          </div>
  
          <!-- Contact Form -->
          <div class="contact-form">
            <h3>Send Message</h3>
            <form>
              <input type="text" placeholder="Full Name" required>
              <input type="email" placeholder="Email" required>
              <textarea placeholder="Type your message..." required></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
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
  
  /* Banner styles - Keeping original */
  .banner-wrapper {
    width: 100%;
    height: 50vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
    position: relative;
  }
  
  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
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
  
  /* Contact container */
  .contact-container {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: space-between;
  }
  
  /* Contact info section */
  .contact-info {
    flex: 1;
    min-width: 300px;
  }
  
  .contact-message h2 {
    color: #f47b91;
    font-size: 32px;
    margin-bottom: 30px;
    text-align: left;
  }
  
  .info-box {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    text-align: left;
  }
  
  .contact-icon {
    color: #f47b91;
    font-size: 24px;
    margin-right: 15px;
    min-width: 30px;
    text-align: center;
  }
  
  .info-value h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #333;
  }
  
  .info-value p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    text-align: left;
  }
  
  .social-box {
    display: flex;
    gap: 20px;
  }
  
  .social {
    margin-right: 0;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .social:hover {
    color: #d65d73;
  }
  
  /* Contact form */
  .contact-form {
    flex: 1;
    min-width: 300px;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }
  
  .contact-form h3 {
    color: #f47b91;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: left;
  }
  
  .contact-form form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .contact-form textarea {
    height: 150px;
    resize: vertical;
  }
  
  .contact-form button {
    background-color: #f47b91;
    color: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .contact-form button:hover {
    background-color: #d65d73;
  }
  
  /* Media Queries for different screen sizes */
  @media (max-width: 1024px) and (max-height: 768px) {
    .banner-wrapper {
      height: 40vh;
    }
    
    .container {
      padding: 30px 15px;
    }
    
    .contact-message h2 {
      font-size: 28px;
    }
    
    .info-value h3 {
      font-size: 17px;
    }
    
    .info-value p {
      font-size: 15px;
    }
  }
  
  @media (max-width: 768px) {
    .banner-wrapper {
      height: 30vh;
    }
    
    .container {
      padding: 20px 15px;
    }
    
    .contact-container {
      flex-direction: column;
    }
    
    .contact-message h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .contact-icon {
      font-size: 20px;
    }
    
    .info-value h3 {
      font-size: 16px;
    }
    
    .info-value p {
      font-size: 14px;
    }
    
    .contact-form h3 {
      font-size: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .banner-wrapper {
      height: 25vh;
    }
    
    .contact-message h2 {
      font-size: 22px;
    }
    
    .info-value h3 {
      font-size: 15px;
    }
    
    .info-value p {
      font-size: 13px;
    }
    
    .contact-form {
      padding: 20px;
    }
    
    .contact-form input,
    .contact-form textarea,
    .contact-form button {
      font-size: 14px;
      padding: 10px;
    }
  }
  </style>