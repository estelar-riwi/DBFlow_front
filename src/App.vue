<template>
  <LoadingOverlay />
  <!-- <router-view /> -->
  <TokenGenerator />
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import TokenGenerator from '@/components/TokenGenerator.vue';

export default {
  components: { LoadingOverlay, TokenGenerator }
}
</script>

