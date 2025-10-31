<template>
<div>
    <div class="view-header">
    <h1>Webhooks</h1>
    <button class="btn-primary">Crear Nuevo Webhook</button>
    </div>

    <p style="color: #94a3b8; font-size: 1rem; margin-bottom: 30px; line-height: 1.6;">
    Recibe notificaciones HTTP POST cuando ocurran eventos específicos en tu plataforma, 
    como 'database.created' o 'build.failed'.
    </p>

    <h3>Endpoints Registrados</h3>
    <div class="db-table-container">
    <table class="db-table">
        <thead>
        <tr>
            <th>URL del Endpoint</th>
            <th>Eventos Suscritos</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>https://api.mi-servicio.com/hook/dbflow</td>
            <td>database.created, database.deleted</td>
            <td><span class="status-dot"></span> Activo</td>
            <td>
            <button class="action-btn">Editar</button>
            <button class="action-btn delete">Borrar</button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>

</div>
</template>

<script setup>
// Lógica para crear/borrar webhooks
</script>

<style scoped>
/* (Estilos globales de Dashboard.css se aplican) */
</style>