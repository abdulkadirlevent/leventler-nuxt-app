<!-- Todo formu bileşeni - Yeni görev oluşturma ve düzenleme için -->
<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <div class="form-group">
      <label class="form-label" for="title">Görev Başlığı *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="form-input"
        required
        placeholder="Görev adını girin"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="description">Açıklama</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        placeholder="Görev hakkında detaylı bilgi"
        rows="3"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="status">Durum</label>
        <select id="status" v-model="formData.status" class="form-select">
          <option value="pending">Beklemede</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal Edildi</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="priority">Öncelik</label>
        <select id="priority" v-model="formData.priority" class="form-select">
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ todo ? 'Güncelle' : 'Oluştur' }}
      </button>
      <button type="button" @click="handleCancel" class="btn btn-outline">
        İptal
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
// Todo formu bileşeni - Form verilerini yönetir
interface Todo {
  id?: string
  title: string
  description?: string
  status?: string
  priority?: string
  project_id: string
}

const props = defineProps<{
  todo?: Todo | null
  projectId: string
}>()

const emit = defineEmits<{
  submit: [data: Omit<Todo, 'id'>]
  cancel: []
}>()

// Form verileri
const formData = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium'
})

// Eğer todo varsa (düzenleme modu), formu doldur
watch(() => props.todo, (todo) => {
  if (todo) {
    formData.value = {
      title: todo.title || '',
      description: todo.description || '',
      status: todo.status || 'pending',
      priority: todo.priority || 'medium'
    }
  }
}, { immediate: true })

// Form gönderimi
const handleSubmit = () => {
  const submitData = {
    title: formData.value.title,
    description: formData.value.description || undefined,
    status: formData.value.status,
    priority: formData.value.priority,
    project_id: props.projectId
  }
  emit('submit', submitData)
}

// İptal
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.todo-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>

