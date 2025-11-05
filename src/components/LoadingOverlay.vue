<template>
  <div v-if="loading.value" class="global-loading-overlay" role="status" aria-live="polite">
    <div class="loader-card">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loader-text">{{ loading.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { loading } from '@/store/loading';
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  z-index: 999999;
  backdrop-filter: blur(2px);
}
.loader-card {
  background: rgba(20,20,20,0.95);
  color: #fff;
  padding: 20px 28px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 160px;
}
.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.12);
  border-top-color: #4fd1c5; /* teal */
  animation: spin 1s linear infinite;
}
.loader-text { font-size: 0.95rem; color: #e6fff9 }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
