<script lang="ts" setup>
import type {BreadcrumbItem, NavigationMenuItem, TabsItem} from "@nuxt/ui";
import AppFooter from "~/components/AppFooter.vue";
import TodoForm from "~/components/todos/TodoForm.vue";

import OverviewPanel from '~/components/tabs/OverviewPanel.vue'
import TasksPanel from '~/components/tabs/TasksPanel.vue'
import TeamPanel from '~/components/tabs/TeamPanel.vue'
import TodoCard from "~/components/todos/TodoCard.vue";
import UsersPanel from "~/components/tabs/UsersPanel.vue";
import CalisanlarPanel from "~/components/tabs/CalisanlarPanel.vue";

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const {getProject} = useProjects()
const {getTodosByProject, createTodo, deleteTodo, updateTodoStatus} = useTodos()

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

const handleDelete = async (id: string) => {
  if (!id) {
    alert('Geçersiz proje kimliği')
    return
  }

  if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
    return
  }

  try {
    // await deleteProject(id)
    // Silindikten sonra proje listesine dön
    // router.push('/projects')
  } catch (err: any) {
    alert('Proje silinirken bir hata oluştu: ' + (err?.message || String(err)))
  }
}

onMounted(async () => {
  await loadProject()
  await loadTodos()
})

type TabKey = 'overview' | 'tasks' | 'team' | 'hakedisler' | 'calisanlar'

const activeTab = ref<TabKey>('overview')

const links = computed<NavigationMenuItem[][]>(() => [
  // links[0]
  [
    {
      label: 'Proje Detayları',
      icon: 'i-lucide-user',
      class: 'capitalize cursor-pointer',
      active: activeTab.value === 'overview',
      onSelect: (e: Event) => activeTab.value = 'overview',
    },
    {
      label: 'Tesisatlar',
      icon: 'i-lucide-shield',
      class: 'capitalize cursor-pointer',
      active: activeTab.value === 'tasks',
      onSelect: (e: Event) => activeTab.value = 'tasks',
    },
    {
      label: 'Görevler',
      icon: 'i-lucide-calendar',
      class: 'capitalize cursor-pointer',
      active: activeTab.value === 'team',
      onSelect: (e: Event) => activeTab.value = 'team',
    },
    {
      label: 'Hakedişler',
      icon: 'i-lucide-bell',
      class: 'capitalize cursor-pointer',
      active: activeTab.value === 'hakedisler',
      onSelect: (e: Event) => activeTab.value = 'hakedisler',
    },
    {
      label: 'Çalışanlar',
      icon: 'i-lucide-people',
      class: 'capitalize cursor-pointer',
      active: activeTab.value === 'calisanlar',
      onSelect: (e: Event) => activeTab.value = 'calisanlar',
    }

  ],
  // links[1]
  [
    {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
      target: '_blank'
    }
  ]
])

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
      icon: 'i-lucide-eye',
      // to: `/projects/${route.params.id}`,
      class: 'capitalize',
    },
  ];
});

const componentsMap = {
  overview: OverviewPanel,
  tasks: TasksPanel,
  team: TeamPanel,
  hakedisler: UsersPanel,
  calisanlar: CalisanlarPanel,
} as const

</script>

<template>
  <UDashboardPanel id="projects-page">
    <template #header>
      <UDashboardNavbar id="Projeler">
        <template #leading>
          <UDashboardSidebarCollapse/>
          <UBreadcrumb v-if="project" :items="breadcrumbsItems"/>
        </template>
        <template #right>
          <UButton
              color="error"
              icon="i-lucide-trash"
              label="Sil"
              variant="outline"
              class="cursor-pointer"
              @click="handleDelete(`${route.params.id}`)"/>
          <UButton
              :to="`/projects/${route.params.id}/edit`"
              color="info"
              icon="i-lucide-pencil"
              label="Düzenle"
              variant="outline"/>
          <UButton
              :to="`/projects/new`"
              color="primary"
              icon="i-lucide-plus"
              label="Yeni Proje Ekle"
              variant="subtle"/>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight/>
      </UDashboardToolbar>
    </template>

    <template #body>

      <div class="">
        <Transition mode="out-in" name="fade">
          <KeepAlive>
            <component :is="componentsMap[activeTab]" :key="activeTab"/>
          </KeepAlive>
        </Transition>
      </div>

      <!-- Proje detay Bölümü -->
      <UCard v-if="false" variant="subtle">
        <template #header>
          <div>Proje detay</div>
        </template>

        <div class="project-detail-page">
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
                  <NuxtLink class="btn btn-secondary" to="/">
                    Düzenle
                  </NuxtLink>
                  <NuxtLink class="btn btn-outline" to="/projects">
                    ← Geri
                  </NuxtLink>
                </div>
              </div>
            </div>

          </div>
        </div>

        <template #footer>
          <div>Footer</div>
        </template>
      </UCard>

      <!-- Tesisatlar Bölümü -->
      <UCard v-if="false" variant="subtle">
        <template #header>
          <div>Tesisatlar</div>
        </template>

        <div class="todos-section">
          <div class="section-header">
            <h2>Görevler</h2>
            <button class="btn btn-primary" @click="showAddForm = !showAddForm">
              {{ showAddForm ? 'İptal' : '+ Yeni Görev' }}
            </button>
          </div>

          <!-- Yeni Görev Formu -->
          <div v-if="showAddForm" class="add-todo-form">
            <TodoForm
                :project-id="project.id"
                @cancel="showAddForm = false"
                @submit="handleCreateTodo"
            />
          </div>

          <!-- Görevler Listesi -->
          <div v-if="todosLoading" class="loading">Görevler yükleniyor...</div>

          <div v-else-if="todosError" class="alert alert-error">
            {{ todosError }}
          </div>

          <div v-else-if="todos.length === 0" class="empty-state">
            <p>Henüz görev eklenmemiş.</p>
            <button class="btn btn-primary" @click="showAddForm = true">
              İlk Görevinizi Oluşturun
            </button>
          </div>

          <div v-else class="todos-grid">
            <TodoCard
                v-for="todo in todos"
                :key="todo.id"
                :project-id="project.id"
                :todo="todo"
                @delete="handleDeleteTodo"
                @status-change="handleStatusChange"
            />
          </div>
        </div>

        <template #footer>
          <div>Footer</div>
        </template>
      </UCard>

      <!-- Görevler Bölümü -->
      <UCard v-if="false" variant="subtle">
        <template #header>
          <div>Görevler</div>
        </template>

        <div class="todos-section">
          <div class="section-header">
            <h2>Görevler</h2>
            <button class="btn btn-primary" @click="showAddForm = !showAddForm">
              {{ showAddForm ? 'İptal' : '+ Yeni Görev' }}
            </button>
          </div>

          <!-- Yeni Görev Formu -->
          <div v-if="showAddForm" class="add-todo-form">
            <TodoForm
                :project-id="project.id"
                @cancel="showAddForm = false"
                @submit="handleCreateTodo"
            />
          </div>

          <!-- Görevler Listesi -->
          <div v-if="todosLoading" class="loading">Görevler yükleniyor...</div>

          <div v-else-if="todosError" class="alert alert-error">
            {{ todosError }}
          </div>

          <div v-else-if="todos.length === 0" class="empty-state">
            <p>Henüz görev eklenmemiş.</p>
            <button class="btn btn-primary" @click="showAddForm = true">
              İlk Görevinizi Oluşturun
            </button>
          </div>

          <div v-else class="todos-grid">
            <TodoCard
                v-for="todo in todos"
                :key="todo.id"
                :project-id="project.id"
                :todo="todo"
                @delete="handleDeleteTodo"
                @status-change="handleStatusChange"
            />
          </div>
        </div>

        <template #footer>
          <div>Footer</div>
        </template>
      </UCard>

      <!-- Görevler Bölümü -->
      <UCard v-if="false" variant="subtle">
        <template #header>
          <div>Hakedişler</div>
        </template>

        <div class="todos-section">
          <div class="section-header">
            <h2>Görevler</h2>
            <button class="btn btn-primary" @click="showAddForm = !showAddForm">
              {{ showAddForm ? 'İptal' : '+ Yeni Görev' }}
            </button>
          </div>

          <!-- Yeni Görev Formu -->
          <div v-if="showAddForm" class="add-todo-form">
            <TodoForm
                :project-id="project.id"
                @cancel="showAddForm = false"
                @submit="handleCreateTodo"
            />
          </div>

          <!-- Görevler Listesi -->
          <div v-if="todosLoading" class="loading">Görevler yükleniyor...</div>

          <div v-else-if="todosError" class="alert alert-error">
            {{ todosError }}
          </div>

          <div v-else-if="todos.length === 0" class="empty-state">
            <p>Henüz görev eklenmemiş.</p>
            <button class="btn btn-primary" @click="showAddForm = true">
              İlk Görevinizi Oluşturun
            </button>
          </div>

          <div v-else class="todos-grid">
            <TodoCard
                v-for="todo in todos"
                :key="todo.id"
                :project-id="project.id"
                :todo="todo"
                @delete="handleDeleteTodo"
                @status-change="handleStatusChange"
            />
          </div>
        </div>

        <template #footer>
          <div>Footer</div>
        </template>
      </UCard>
    </template>

    <template #footer>
      <AppFooter/>
    </template>
  </UDashboardPanel>

</template>



