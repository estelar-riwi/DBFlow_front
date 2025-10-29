<template>
<div class="auth-page-wrap">
    <div class="auth-card">
    
    <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow Login</strong>
    </div>

    <h2 class="auth-title">Welcome Back</h2>
    <p class="auth-subtitle">Sign in to manage your databases.</p>

    <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required placeholder="name@example.com">
        </div>
        
        <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn-primary btn-full-width">Sign In</button>
    </form>
    
    <p class="auth-footer-text">
        Don't have an account? 
        <a href="/register" class="link-secondary">Register here</a>
    </p>

    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
// Lógica de autenticación: Enviar email.value y password.value al servidor
console.log('Attempting login with:', email.value, password.value);
alert(`Login: ${email.value}`);
};
</script>

<style scoped src="../assets/Auth.css"></style>