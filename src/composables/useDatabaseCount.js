import { ref } from 'vue'
import { getDatabasesCount } from '@/services/databaseService'

const databasesCount = ref({
  mysql: 0,
  postgresql: 0,
  mongodb: 0,
  cassandra: 0,
  sqlserver: 0,
  redis: 0
})

export async function loadDatabaseCount() {
  try {
    const count = await getDatabasesCount()
    if (count) {
      databasesCount.value = {
        mysql: count.mysql || 0,
        postgresql: count.postgresql || 0,
        mongodb: count.mongodb || 0,
        cassandra: count.cassandra || 0,
        sqlserver: count.sqlserver || 0,
        redis: count.redis || 0
      }
    }
  } catch (error) {
    console.error('Error al cargar conteo de bases de datos:', error)
  }
}

export function useDatabaseCount() {
  return { databasesCount, loadDatabaseCount }
}
