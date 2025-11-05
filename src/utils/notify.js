// Simple notifier modal que no depende de librerías externas.
// Uso: import { showAlert } from '@/utils/notify'; await showAlert({ icon:'success'|'error'|'info', title, text, confirmText, showCancel, autoClose })

export function showAlert({ icon = 'info', title = '', text = '', confirmText = 'Aceptar', showCancel = false, autoClose = null }) {
  return new Promise((resolve) => {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'custom-alert-backdrop';
    
    let autoCloseTimer = null;

    // Card
    const card = document.createElement('div');
    card.className = 'custom-alert-card';

    const row = document.createElement('div');
    row.className = 'custom-alert-row';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'custom-alert-icon custom-alert-icon--' + (icon || 'info');

    // SVGs
    let svgInner = '';
    if (icon === 'success') {
      svgInner = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5l3 3L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    } else if (icon === 'error') {
      svgInner = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    } else {
      svgInner = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>'
    }
    iconWrap.innerHTML = svgInner;

    const content = document.createElement('div');
    content.style.flex = '1';

    const h = document.createElement('div');
    h.className = 'custom-alert-title';
    h.textContent = title || (icon === 'success' ? 'Éxito' : icon === 'error' ? 'Error' : 'Info');

    const p = document.createElement('div');
    p.className = 'custom-alert-text';
    p.textContent = text || '';

    content.appendChild(h);
    content.appendChild(p);

    row.appendChild(iconWrap);
    row.appendChild(content);

    card.appendChild(row);

    // Solo mostrar botones si NO hay autoClose
    if (!autoClose) {
      const actions = document.createElement('div');
      actions.className = 'custom-alert-actions';

      const btnConfirm = document.createElement('button');
      btnConfirm.className = 'custom-alert-btn custom-alert-btn--primary';
      btnConfirm.textContent = confirmText || 'Aceptar';

      btnConfirm.addEventListener('click', () => {
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
        document.body.removeChild(backdrop);
        resolve({ isConfirmed: true });
      });

      actions.appendChild(btnConfirm);

      if (showCancel) {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'custom-alert-btn custom-alert-btn--secondary';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => {
          if (autoCloseTimer) clearTimeout(autoCloseTimer);
          document.body.removeChild(backdrop);
          resolve({ isConfirmed: false });
        });
        actions.insertBefore(btnCancel, btnConfirm);
      }

      card.appendChild(actions);
    }

    backdrop.appendChild(card);

    // Auto-close si se especifica (en milisegundos)
    if (autoClose && typeof autoClose === 'number' && autoClose > 0) {
      autoCloseTimer = setTimeout(() => {
        if (document.body.contains(backdrop)) {
          document.body.removeChild(backdrop);
          window.removeEventListener('keydown', onKey);
          resolve({ isConfirmed: true, autoCloseTriggered: true });
        }
      }, autoClose);
    }

    // Close on ESC
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (document.body.contains(backdrop)) {
          if (autoCloseTimer) clearTimeout(autoCloseTimer);
          document.body.removeChild(backdrop);
          window.removeEventListener('keydown', onKey);
          resolve({ isConfirmed: false });
        }
      }
    }
    window.addEventListener('keydown', onKey);

    document.body.appendChild(backdrop);
  });
}

export default showAlert;
