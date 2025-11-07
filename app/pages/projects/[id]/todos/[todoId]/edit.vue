<!-- Todo düzenleme sayfası -->
<template>
  <div class="todo-form-page">
    <div v-if="loading" class="loading">Yükleniyor...</div>
    
    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="page-header">
        <NuxtLink :to="`/projects/${projectId}`" class="btn btn-outline">
          ← Geri
        </NuxtLink>
        <h1>Görevi Düzenle</h1>
      </div>
      
      <TodoForm
        :todo="todo"
        :project-id="projectId"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Todo düzenleme sayfası
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getTodo, updateTodo } = useTodos()

const projectId = route.params.id as string
const todoId = route.params.todoId as string
const todo = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Todo'yu yükle
onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    todo.value = await getTodo(todoId)
  } catch (err: any) {
    error.value = err.message || 'Görev yüklenirken bir hata oluştu'
    console.error('Görev yükleme hatası:', err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (todoData: any) => {
  try {
    await updateTodo(todoId, todoData)
    await router.push(`/projects/${projectId}`)
  } catch (err: any) {
    alert('Görev güncellenirken bir hata oluştu: ' + err.message)
  }
}

const handleCancel = () => {
  router.push(`/projects/${projectId}`)
}
</script>

<style scoped>
.todo-form-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0;
}
</style>

