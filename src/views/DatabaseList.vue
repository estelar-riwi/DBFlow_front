<template>
<div>
    <div class="view-header">
    <h1>Mis Bases de Datos</h1>
    <button class="btn-primary">Crear Base de Datos</button>
    </div>

    <h3>Uso de Cuota (Plan Gratuito)</h3>
    <div class="quota-grid">
    <div class="quota-card">
        <h4>MySQL</h4>
        <div class="usage">1 / 2</div>
    </div>
    <div class="quota-card">
        <h4>PostgreSQL</h4>
        <div class="usage">0 / 2</div>
    </div>
    <div class="quota-card">
        <h4>MongoDB</h4>
        <div class="usage">0 / 2</div>
    </div>
    <div class="quota-card">
        <h4>SQL Server</h4>
        <div class="usage">0 / 2</div>
    </div>
    </div>

    <h3>Instancias Activas</h3>
    <div class="db-table-container">
    <table class="db-table">
        <thead>
        <tr>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Motor</th>
            <th>Host</th>
            <th>Puerto</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span class="status-dot"></span> Activo</td>
            <td>db_proyecto_final</td>
            <td>MySQL</td>
            <td>mysql.dbflow.dev</td>
            <td>3306</td>
            <td>
            <button class="action-btn">Ver</button>
            <button class="action-btn delete">Borrar</button>
            </td>
        </tr>
        <tr>
            <td><span class="status-dot"></span> Activo</td>
            <td>db_blog_personal</td>
            <td>MongoDB</td>
            <td>mongo.dbflow.dev</td>
            <td>27017</td>
            <td>
            <button class="action-btn">Ver</button>
            <button class="action-btn delete">Borrar</button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>

</div>
</template>

<script setup>
// Aquí puedes cargar los datos de las bases de datos del usuario
</script>

<style scoped>
/* Estilos específicos para esta vista */
.view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    color: white;
}
.view-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
}
h3 {
    font-size: 1.2rem;
    color: white;
    margin-bottom: 20px;
}
</style>