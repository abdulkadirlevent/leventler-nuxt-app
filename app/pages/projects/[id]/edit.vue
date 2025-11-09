<script lang="ts" setup>
import ProjectForm from "~/components/projects/ProjectForm.vue";
import type {BreadcrumbItem} from "@nuxt/ui";
import type {Project} from "~/types";
import AppFooter from "~/components/AppFooter.vue";

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
   // const payload = stripForbiddenKeys(projectData);
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
      icon: 'i-lucide-eye',
      to: `/projects/${route.params.id}`,
      class: 'capitalize',
    },
    {
      label:'düzenle',
      icon: 'i-lucide-pencil',
      class: 'capitalize',
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
              color="success"
              label="Güncelle"
              variant="subtle"
              class="cursor-pointer"
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
      <AppFooter/>
    </template>
  </UDashboardPanel>
</template>

