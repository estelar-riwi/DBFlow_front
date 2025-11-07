<template>
  <LoadingOverlay />
  <transition name="page-transition" mode="out-in">
    <router-view :key="$route.path" />
  </transition>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';

export default {
  components: { LoadingOverlay }
}
</script>

<style>
/* Transiciones de página globales */
.page-transition-enter-active {
  animation: pageEnter 0.5s ease-out;
}

.page-transition-leave-active {
  animation: pageLeave 0.4s ease-in;
  position: absolute;
  width: 100%;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: scale(1.02) translateY(20px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

@keyframes pageLeave {
  from {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: scale(0.98);
    filter: blur(5px);
  }
}
</style>