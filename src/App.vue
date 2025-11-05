<template>
  <LoadingOverlay />
  <router-view />
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';

export default {
  components: { LoadingOverlay }
}
</script>

