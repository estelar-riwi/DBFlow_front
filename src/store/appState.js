import { ref } from 'vue';

// Estado reactivo para saber si los datos iniciales de la app están listos.
export const isDataReady = ref(false);

export function setDataReady(status) {
  isDataReady.value = status;
}
