import { reactive } from 'vue';

// Estado global simple para pantalla de carga
export const loading = reactive({ 
  value: false,
  text: 'Cargando...'
});

export function showLoading(text = 'Cargando...') {
  loading.value = true;
  loading.text = text;
}

export function hideLoading() {
  loading.value = false;
  loading.text = 'Cargando...';
}

export default loading;
