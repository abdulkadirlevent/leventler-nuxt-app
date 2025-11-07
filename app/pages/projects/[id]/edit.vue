<script lang="ts" setup>
import ProjectForm from "~/components/projects/ProjectForm.vue";
import type {BreadcrumbItem} from "@nuxt/ui";
import type {Project} from "~/types";

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const {getProject, updateProject} = useProjects()

const project = ref<Project | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Projeyi yükle
onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    project.value = await getProject(route.params.id as string)
    console.log('Project Data:', project.value) // Veri kontrolü
  } catch (err: any) {
    error.value = err.message || 'Proje yüklenirken bir hata oluştu'
    console.error('Proje yükleme hatası:', err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (projectData: any) => {
  try {
    await updateProject(route.params.id as string, projectData)
    await router.push('/projects')
  } catch (err: any) {
    alert('Proje güncellenirken bir hata oluştu: ' + err.message)
  }
}

const handleCancel = async () => {
  await navigateTo('/projects')
}

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

        <div v-if="loading" class="loading">Yükleniyor...</div>

        <div v-else-if="error" class="alert alert-error">
          {{ error }}
        </div>
        <ProjectForm v-else
                     :project="project"
                     @cancel="handleCancel"
                     @submit="handleSubmit"/>
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

