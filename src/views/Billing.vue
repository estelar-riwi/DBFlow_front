<template>
<div>
    <div class="view-header">
    <h1>Plan y Facturación</h1>
    <button class="btn-primary" @click="goToMercadoPago">Actualizar a Intermedio</button>
    </div>

    <h3>Plan Actual</h3>
    <div class="quota-grid">
    <div class="quota-card">
        <h4>Plan Gratuito</h4>
        <div class="usage">2 DBs / Motor</div>
    </div>
    <div class="quota-card">
        <h4>Costo Mensual</h4>
        <div class="usage">$0 COP</div>
    </div>
    <div class="quota-card">
        <h4>Próximo Cobro</h4>
        <div class="usage">N/A</div>
    </div>
    </div>

    <h3>Historial de Facturación</h3>
    <div class="db-table-container">
    <table class="db-table">
        <thead>
        <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>30 Oct, 2025</td>
            <td>Suscripción Plan Gratuito</td>
            <td>$0 COP</td>
            <td><span class="status-dot"></span> Completado</td>
        </tr>
        </tbody>
    </table>
    </div>

</div>
</template>

<script setup>
// Lógica para manejar la redirección a Mercado Pago
const goToMercadoPago = () => {
console.log('Redirigiendo a Mercado Pago...');
// Aquí iría la lógica para crear una suscripción en tu backend
// y redirigir al checkout de Mercado Pago.
alert('Redirección a Mercado Pago (Simulación)');
};
</script>

<style scoped>
/* Estilos específicos de esta vista (si los hubiera) */
/* (La mayoría de los estilos .view-header, .quota-card, etc., ya están en Dashboard.css) */
</style>