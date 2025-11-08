/**
 * Utilidades para debugear problemas con tokens JWT
 */

export function debugToken() {
  console.group('🔍 DEBUG DEL TOKEN JWT');
  
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('❌ NO HAY TOKEN EN LOCALSTORAGE');
    console.groupEnd();
    return { hasToken: false };
  }
  
  console.log('✅ Token existe en localStorage');
  console.log('📝 Token completo:', token);
  console.log('📏 Longitud del token:', token.length);
  
  // Intentar decodificar
  try {
    const parts = token.split('.');
    console.log('🔢 Partes del token:', parts.length);
    
    if (parts.length !== 3) {
      console.error('❌ Token malformado - debería tener 3 partes separadas por puntos');
      console.groupEnd();
      return { hasToken: true, valid: false, error: 'Malformado' };
    }
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    console.log('📦 Payload decodificado:', payload);
    
    // Verificar expiración
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const expirationDate = new Date(payload.exp * 1000);
      const isExpired = now >= payload.exp;
      
      console.log('⏰ Fecha de expiración:', expirationDate.toLocaleString());
      console.log('🕐 Fecha actual:', new Date().toLocaleString());
      console.log(isExpired ? '❌ TOKEN EXPIRADO' : '✅ Token válido');
      
      if (isExpired) {
        const expiredMinutes = Math.floor((now - payload.exp) / 60);
        console.log(`⏱️ Expiró hace ${expiredMinutes} minutos`);
      } else {
        const remainingMinutes = Math.floor((payload.exp - now) / 60);
        console.log(`⏱️ Le quedan ${remainingMinutes} minutos`);
      }
      
      console.groupEnd();
      return { 
        hasToken: true, 
        valid: !isExpired, 
        payload, 
        expiresAt: expirationDate,
        isExpired 
      };
    }
    
    console.log('⚠️ Token sin fecha de expiración');
    console.groupEnd();
    return { hasToken: true, valid: true, payload };
    
  } catch (error) {
    console.error('❌ Error al decodificar token:', error);
    console.groupEnd();
    return { hasToken: true, valid: false, error: error.message };
  }
}

export function testTokenInRequest() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('❌ No hay token para probar');
    return;
  }
  
  console.log('🧪 Simulando headers que se enviarán:');
  console.log('Authorization:', `Bearer ${token.substring(0, 50)}...`);
}
