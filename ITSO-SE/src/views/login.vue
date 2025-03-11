<template>
  <div class="container">
    <div class="login-box">
      <!-- University Logo -->
      <img src="../assets/logo.png" alt="University Logo" class="logo" />

      <!-- Title -->
      <div class="title-wrapper">
        <h1 class="university-title">University of The Immaculate Conception</h1>
        <h2 class="itso-title">ITSO</h2>
      </div>

      <!-- Login Form -->
      <div class="form-container">
        <form @submit.prevent="handleLogin">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password" 
            required 
          />
          <button class="login-btn" type="submit">LOGIN</button>
        </form>
      </div>

      <!-- Links -->
      <div class="links">
        <router-link to="/forgot-password" class="forgot">Forgot Password</router-link>
        <span class="separator">•</span>
        <router-link to="/signup" class="support">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
  console.log('Login attempt:', { email: email.value, password: password.value });

  // Redirect to the dashboard or another page after login
  router.push('/');
};
</script>

  
  <style>
  /* Reset default margins and padding */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Container styles */
  .container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../assets/background.png');
    background-size: cover;
    position: relative;
  }
  
  .container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  .login-box {
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  
  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }
  
  .title-wrapper {
    margin-bottom: 2rem;
  }
  
  .university-title {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  
  .itso-title {
    font-size: 2rem;
    color: #ff4d7e;
    margin: 0;
    font-weight: bold;
  }
  
  .form-container {
    margin: 2rem 0;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input {
    padding: 0.875rem 1rem;
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    outline: none;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  
  input:focus {
    border-color: #ff4d7e;
  }
  
  .login-btn {
    padding: 0.875rem 2rem;
    background: #ff4d7e;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    width: 100%;
    transition: background-color 0.2s;
  }
  
  .login-btn:hover {
    background: #ff3366;
  }
  
  .links {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  
  .links a {
    text-decoration: none;
    color: #666;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .links a:hover {
    color: #ff4d7e;
  }
  
  .separator {
    color: #666;
    font-size: 0.875rem;
  }
  
  /* Responsive Design */
  @media (max-width: 480px) {
    .login-box {
      margin: 1rem;
      padding: 1.5rem;
    }
  
    .university-title {
      font-size: 1.25rem;
    }
  
    .itso-title {
      font-size: 1.75rem;
    }
  
    input, .login-btn {
      padding: 0.75rem;
    }
  }
  </style>