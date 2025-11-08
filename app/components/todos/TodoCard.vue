<!-- Todo kartı bileşeni - Her görevi kart olarak gösterir -->
<template>
  <div class="todo-card">
    <div class="card-header">
      <div class="todo-checkbox">
        <input
          type="checkbox"
          :checked="todo.status === 'completed'"
          @change="handleStatusToggle"
          class="checkbox-input"
        />
        <h4 :class="{ completed: todo.status === 'completed' }">
          {{ todo.title }}
        </h4>
      </div>
      <div class="card-actions">
        <NuxtLink :to="`/projects/${projectId}/todos/${todo.id}/edit`" class="btn-icon" title="Düzenle">
          ✏️
        </NuxtLink>
        <button @click="handleDelete" class="btn-icon" title="Sil">
          🗑️
        </button>
      </div>
    </div>
    
    <p class="card-description" v-if="todo.description">
      {{ todo.description }}
    </p>
    
    <div class="card-footer">
      <div class="card-badges">
        <span :class="['badge', `badge-${todo.status}`]">
          {{ getStatusText(todo.status) }}
        </span>
        <span :class="['badge', `badge-${todo.priority}`]">
          {{ getPriorityText(todo.priority) }}
        </span>
      </div>
      
      <div class="card-meta">
        <span class="created-date">
          {{ formatDate(todo.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Todo kartı bileşeni - Görev bilgilerini gösterir
interface Todo {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  created_at: string
  project_id: string
}

const props = defineProps<{
  todo: Todo
  projectId: string
}>()

const emit = defineEmits<{
  delete: [id: string]
  statusChange: [id: string, status: string]
}>()

// Durum metnini Türkçe'ye çevir
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Beklemede',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  }
  return statusMap[status] || status
}

// Öncelik metnini Türkçe'ye çevir
const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek'
  }
  return priorityMap[priority] || priority
}

// Tarih formatla
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Durum değiştirme
const handleStatusToggle = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  const newStatus = checked ? 'completed' : 'pending'
  emit('statusChange', props.todo.id, newStatus)
}

// Todo silme
const handleDelete = () => {
  emit('delete', props.todo.id)
}
</script>

<style scoped>
.todo-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #ddd;
}

.todo-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.todo-card.completed {
  border-left-color: #4CAF50;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.todo-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin-right: 10px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.card-header h4 {
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.card-header h4.completed {
  text-decoration: line-through;
  color: #999;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.btn-icon:hover {
  background-color: #f5f5f5;
}

.card-description {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.card-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-meta {
  font-size: 11px;
  color: #999;
}
</style>

