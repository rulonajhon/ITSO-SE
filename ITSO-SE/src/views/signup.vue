<template>
  <div class="signup-container">
    <div class="signup-box">
      <!-- University Logo -->
      <img src="../assets/logo.png" alt="University Logo" class="logo" />

      <!-- Title -->
      <div class="title-wrapper">
        <h1 class="university-title">University of Immaculate Conception</h1>
        <h2 class="itso-title">ITSO</h2>
      </div>

      <!-- Signup Form -->
      <div class="form-container">
        <form @submit.prevent="handleSignup">
          <div class="input-group">
            <label for="fullName">Full Name</label>
            <input 
              id="fullName"
              type="text" 
              v-model="formData.fullName" 
              placeholder="Please fill out this field."
              required 
            />
          </div>

          <div class="input-group">
            <label for="username">Username</label>
            <input 
              id="username"
              type="text" 
              v-model="formData.username" 
              placeholder="Please fill out this field."
              required 
            />
          </div>

          <div class="input-group">
            <label for="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              v-model="formData.email" 
              placeholder="Please fill out this field."
              required 
            />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input 
              id="password"
              type="password" 
              v-model="formData.password" 
              placeholder="Please fill out this field."
              required 
            />
          </div>

          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

          <div class="button-group">
            <button type="button" class="back-btn" @click="goBack">Back</button>
            <button type="submit" class="signup-btn" :disabled="loading">
              {{ loading ? "Signing Up..." : "Sign Up" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase'; // Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const router = useRouter();

const formData = ref({
  fullName: '',
  username: '',
  email: '',
  password: ''
});

const errorMessage = ref('');
const loading = ref(false);

const handleSignup = async () => {
  errorMessage.value = '';

  try {
    loading.value = true;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    );

    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      fullName: formData.value.fullName,
      username: formData.value.username,
      email: formData.value.email,
      createdAt: new Date()
    });

    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/login');
};
</script>

<style scoped>
/* Container styles */
.signup-container {
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

.signup-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.signup-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.75rem;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  position: relative;
  z-index: 2;
  max-height: 90vh;
  overflow-y: auto;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 0.5rem;
}

.title-wrapper {
  margin-bottom: 1rem;
}

.university-title {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.itso-title {
  font-size: 1.75rem;
  color: #ff4d7e;
  margin: 0;
  font-weight: bold;
}

.form-container {
  margin: 1rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group {
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  color: #333;
  font-size: 0.85rem;
}

input {
  padding: 0.75rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #ff4d7e;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
}

.back-btn, .signup-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
  transition: background-color 0.2s;
}

.back-btn {
  background: #e2e8f0;
  color: #333;
}

.back-btn:hover {
  background: #cbd5e1;
}

.signup-btn {
  background: #ff4d7e;
  color: white;
}

.signup-btn:hover {
  background: #ff3366;
}

/* Responsive Design */
@media (max-width: 480px) {
  .signup-box {
    margin: 1rem;
    padding: 1.25rem;
    max-height: 80vh;
  }

  .university-title {
    font-size: 1.1rem;
  }

  .itso-title {
    font-size: 1.5rem;
  }

  input, .back-btn, .signup-btn {
    padding: 0.65rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>

