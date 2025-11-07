<script setup lang="ts">
// Proje detay sayfası - Proje bilgilerini ve görevlerini gösterir
import ProjectForm from "~/components/projects/ProjectForm.vue";
import type {BreadcrumbItem} from "@nuxt/ui";

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getProject } = useProjects()
const { getTodosByProject, createTodo, deleteTodo, updateTodoStatus } = useTodos()

const project = ref<any>(null)
const todos = ref<any[]>([])
const loading = ref(true)
const todosLoading = ref(false)
const error = ref<string | null>(null)
const todosError = ref<string | null>(null)
const showAddForm = ref(false)

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
    month: 'long',
    day: 'numeric'
  })
}

// Projeyi yükle
const loadProject = async () => {
  try {
    loading.value = true
    error.value = null
    project.value = await getProject(route.params.id as string)
  } catch (err: any) {
    error.value = err.message || 'Proje yüklenirken bir hata oluştu'
    console.error('Proje yükleme hatası:', err)
  } finally {
    loading.value = false
  }
}

// Görevleri yükle
const loadTodos = async () => {
  try {
    todosLoading.value = true
    todosError.value = null
    todos.value = await getTodosByProject(route.params.id as string)
  } catch (err: any) {
    todosError.value = err.message || 'Görevler yüklenirken bir hata oluştu'
    console.error('Görev yükleme hatası:', err)
  } finally {
    todosLoading.value = false
  }
}

// Yeni görev oluştur
const handleCreateTodo = async (todoData: any) => {
  try {
    await createTodo(todoData)
    showAddForm.value = false
    await loadTodos() // Listeyi yenile
  } catch (err: any) {
    alert('Görev oluşturulurken bir hata oluştu: ' + err.message)
  }
}

// Görev sil
const handleDeleteTodo = async (id: string) => {
  if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
    return
  }

  try {
    await deleteTodo(id)
    await loadTodos() // Listeyi yenile
  } catch (err: any) {
    alert('Görev silinirken bir hata oluştu: ' + err.message)
  }
}

// Görev durumu değiştir
const handleStatusChange = async (id: string, status: string) => {
  try {
    await updateTodoStatus(id, status as any)
    await loadTodos() // Listeyi yenile
  } catch (err: any) {
    alert('Görev durumu güncellenirken bir hata oluştu: ' + err.message)
  }
}

onMounted(async () => {
  await loadProject()
  await loadTodos()
})

const breadcrumbsItems = computed<BreadcrumbItem[]>(() => {
  return [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/'
    },
    {
      label: 'Projeler',
      icon: 'i-lucide-briefcase-business',
      to: '/projects',
    },
    {
      label: project.value ? `${project.value.title}` : 'Proje',
      icon: 'i-lucide-pencil',
      to: `/projects/${route.params.id}/edit`,
    },
  ];
});

</script>

<template>

  <UDashboardPanel id="projects-page">
    <template #header>
      <UDashboardNavbar id="Projeler">
        <template #leading>
          <UDashboardSidebarCollapse/>
          <UBreadcrumb :items="breadcrumbsItems" v-if="project" />
        </template>
        <template #right>
          <UButton
              icon="i-lucide-save"
              label="Kaydet"
              @click="handleSubmit"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageCard
          description="Projeler Güncelleyebilirsiniz"
          title="Proje Güncelleme"
          variant="subtle">

        <div  class="project-detail-page">
          <div v-if="loading" class="loading">Yükleniyor...</div>

          <div v-else-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <div v-else-if="project">
            <!-- Proje Bilgileri -->
            <div class="project-header">
              <div class="header-content">
                <div>
                  <h1>{{ project.title }}</h1>
                  <p v-if="project.description" class="project-description">
                    {{ project.description }}
                  </p>
                  <div class="project-meta">
              <span :class="['badge', `badge-${project.status}`]">
                {{ getStatusText(project.status) }}
              </span>
                    <span :class="['badge', `badge-${project.priority}`]">
                {{ getPriorityText(project.priority) }}
              </span>
                    <span v-if="project.due_date" class="due-date">
                📅 {{ formatDate(project.due_date) }}
              </span>
                  </div>
                </div>
                <div class="header-actions">
                  <NuxtLink :to="`/projects/${project.value.id}/edit`" class="btn btn-secondary">
                    Düzenle
                  </NuxtLink>
                  <NuxtLink to="/projects" class="btn btn-outline">
                    ← Geri
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Görevler Bölümü -->
            <div class="todos-section">
              <div class="section-header">
                <h2>Görevler</h2>
                <button @click="showAddForm = !showAddForm" class="btn btn-primary">
                  {{ showAddForm ? 'İptal' : '+ Yeni Görev' }}
                </button>
              </div>

              <!-- Yeni Görev Formu -->
              <div v-if="showAddForm" class="add-todo-form">
                <TodoForm
                    :project-id="project.id"
                    @submit="handleCreateTodo"
                    @cancel="showAddForm = false"
                />
              </div>

              <!-- Görevler Listesi -->
              <div v-if="todosLoading" class="loading">Görevler yükleniyor...</div>

              <div v-else-if="todosError" class="alert alert-error">
                {{ todosError }}
              </div>

              <div v-else-if="todos.length === 0" class="empty-state">
                <p>Henüz görev eklenmemiş.</p>
                <button @click="showAddForm = true" class="btn btn-primary">
                  İlk Görevinizi Oluşturun
                </button>
              </div>

              <div v-else class="todos-grid">
                <TodoCard
                    v-for="todo in todos"
                    :key="todo.id"
                    :todo="todo"
                    :project-id="project.id"
                    @delete="handleDeleteTodo"
                    @status-change="handleStatusChange"
                />
              </div>
            </div>
          </div>
        </div>

      </UPageCard>
    </template>

    <template #footer>
      <!-- ✅ Footer -->
      <div class="flex items-center justify-between gap-2 border-t border-muted py-2 px-4">
        <p class="text-muted text-sm">
          Leventler Asansör • © {{ new Date().getFullYear() }}
        </p>
        <div class="flex items-center justify-end gap-1.5">
          <UButton
              aria-label="GitHub"
              color="neutral"
              icon="simple-icons:github"
              target="_blank"
              to="https://abdulkadirlevent.com.tr"
              variant="ghost"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>

</template>



