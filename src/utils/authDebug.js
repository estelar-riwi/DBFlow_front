/**
 * Utilidades de debug para autenticación
 */

export function checkAuthStatus() {
  const authStatus = {
    hasToken: false,
    hasUser: false,
    hasUserId: false,
    tokenValid: false,
    timeRemaining: null
  };

  // 1. Verificar token
  const token = localStorage.getItem('authToken');
  authStatus.hasToken = !!token;
  
  if (token) {
    try {
      const payload = parseJwt(token);
      
      // Verificar expiración
      if (payload?.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = now > expirationDate;
        authStatus.tokenValid = !isExpired;
        
        if (!isExpired) {
          const timeRemainingMs = expirationDate - now;
          authStatus.timeRemaining = Math.floor(timeRemainingMs / 1000 / 60); // minutos
        }
      }
    } catch (e) {
      console.error('❌ Error al decodificar token:', e);
    }
  }
  
  // 2. Verificar usuario
  const user = localStorage.getItem('user');
  authStatus.hasUser = !!user;
  
  // 3. Verificar userId
  const userId = localStorage.getItem('user_id');
  authStatus.hasUserId = !!userId;
  
  return authStatus;
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
}

// Función para mostrar el estado de autenticación en un modal profesional
export function showAuthStatusModal() {
  const status = checkAuthStatus();
  
  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'auth-status-modal-overlay';
  
  const modalContent = `
    <div class="auth-status-modal">
      <div class="auth-status-header">
        <div class="auth-status-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h2>Estado de Autenticación</h2>
      </div>
      
      <div class="auth-status-body">
        <div class="auth-status-section">
          <div class="status-label">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="status-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Estado de Autenticación:
          </div>
          <div class="status-items">
            <div class="status-item ${status.hasToken ? 'status-success' : 'status-error'}">
              ${status.hasToken ? '✅' : '❌'} Token: ${status.hasToken ? 'SÍ' : 'NO'}
            </div>
            <div class="status-item ${status.hasUser ? 'status-success' : 'status-error'}">
              ${status.hasUser ? '✅' : '❌'} Usuario: ${status.hasUser ? 'SÍ' : 'NO'}
            </div>
            <div class="status-item ${status.hasUserId ? 'status-success' : 'status-error'}">
              ${status.hasUserId ? '✅' : '❌'} User ID: ${status.hasUserId ? 'SÍ' : 'NO'}
            </div>
          </div>
        </div>
        
        ${status.hasToken ? `
          <div class="auth-status-section">
            <div class="status-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="status-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Token válido
            </div>
            <div class="status-items">
              <div class="status-item ${status.tokenValid ? 'status-success' : 'status-error'}">
                ${status.tokenValid ? '✅' : '❌'} ${status.tokenValid ? 'Válido' : 'Expirado'}
              </div>
              ${status.tokenValid && status.timeRemaining !== null ? `
                <div class="status-item status-info">
                  ⏱️ Tiempo restante: ${status.timeRemaining} minutos
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        ${!status.hasToken ? `
          <div class="auth-status-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>No hay sesión activa. Por favor, inicia sesión.</p>
          </div>
        ` : ''}
      </div>
      
      <div class="auth-status-footer">
        <button class="auth-status-btn" onclick="this.closest('.auth-status-modal-overlay').remove()">
          Entendido
        </button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Estilos CSS para el modal (se inyectan automáticamente)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .auth-status-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }
    
    .auth-status-modal {
      background: rgba(17, 17, 17, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.1),
                  0 0 60px rgba(255, 255, 255, 0.05),
                  0 25px 50px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    
    .auth-status-header {
      background: rgba(255, 255, 255, 0.02);
      padding: 32px 24px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }
    
    .auth-status-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent,
        rgba(255, 255, 255, 0.4),
        rgba(255, 255, 255, 0.6),
        rgba(255, 255, 255, 0.4),
        transparent
      );
    }
    
    .auth-status-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    }
    
    .auth-status-icon svg {
      width: 40px;
      height: 40px;
      color: white;
      filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
    }
    
    .auth-status-header h2 {
      margin: 0;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }
    
    .auth-status-body {
      padding: 28px;
      color: white;
    }
    
    .auth-status-section {
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
    }
    
    .auth-status-section:last-child {
      margin-bottom: 0;
    }
    
    .status-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .status-icon {
      width: 16px;
      height: 16px;
    }
    
    .status-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .status-item {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.2s;
    }
    
    .status-item:hover {
      transform: translateX(4px);
    }
    
    .status-success {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.15);
    }
    
    .status-error {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.15);
    }
    
    .status-info {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.15);
    }
    
    .auth-status-warning {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 10px;
      color: #fbbf24;
      box-shadow: 0 0 8px rgba(251, 191, 36, 0.15);
    }
    
    .auth-status-warning svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .auth-status-warning p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .auth-status-footer {
      padding: 24px 28px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }
    
    .auth-status-btn {
      padding: 14px 40px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .auth-status-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.15), 
        transparent
      );
      transition: left 0.5s;
    }
    
    .auth-status-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
    }
    
    .auth-status-btn:hover::before {
      left: 100%;
    }
    
    .auth-status-btn:active {
      transform: translateY(0);
    }
    
    @keyframes fadeIn {
      from { 
        opacity: 0; 
      }
      to { 
        opacity: 1; 
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}
