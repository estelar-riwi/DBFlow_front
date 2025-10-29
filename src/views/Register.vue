<template>
<div class="auth-page-wrap">
    <div class="auth-card">
    
    <div class="logo">
        <div class="logo-icon"></div>
        <strong>DFlow Register</strong>
    </div>

    <h2 class="auth-title">Create Account</h2>
    <p class="auth-subtitle">Start managing your databases now.</p>

    <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" v-model="name" required placeholder="John Doe">
        </div>

        <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required placeholder="name@example.com">
        </div>
        
        <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn-primary btn-full-width">Register</button>
    </form>
    
    <p class="auth-footer-text">
        Already have an account? 
        <a href="/login" class="link-secondary">Sign In</a>
    </p>


    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = () => {
// Lógica de registro: Enviar name.value, email.value, password.value al servidor
console.log('Attempting registration for:', name.value);
alert(`Registration: ${email.value}`);
};
</script>

<style scoped src="../assets/Auth.css"></style>