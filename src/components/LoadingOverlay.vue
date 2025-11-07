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
  background: rgba(0, 0, 0, 0.8);
  z-index: 999999;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.loader-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 32px 40px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 200px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15),
              0 0 60px rgba(255, 255, 255, 0.08);
  animation: cardSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.spinner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.9);
  border-right-color: rgba(255, 255, 255, 0.6);
  animation: spin 0.8s linear infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3),
              inset 0 0 10px rgba(255, 255, 255, 0.1);
}

.loader-text {
  font-size: 1rem;
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ========================================================================= */
/* ============================= RESPONSIVE LOADING ======================== */
/* ========================================================================= */

@media (max-width: 480px) {
  .loader-card {
    padding: 24px 32px;
    min-width: 180px;
    border-radius: 12px;
  }
  
  .spinner {
    width: 48px;
    height: 48px;
  }
  
  .loader-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .loader-card {
    padding: 20px 24px;
    min-width: 160px;
  }
  
  .spinner {
    width: 44px;
    height: 44px;
  }
  
  .loader-text {
    font-size: 0.85rem;
  }
}

</style>
