<script setup lang="ts">
import ProjectForm from "~/components/projects/ProjectForm.vue";
import {navigateTo} from "#app";
import type {BreadcrumbItem} from "@nuxt/ui";

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

const { createProject } = useProjects()
const router = useRouter()

const handleSubmit = async (projectData: any) => {
  try {
    await createProject(projectData)
    toast.add({title: 'Success', description: `Yeni Proje ${projectData.title} eklendi`, color: 'success'})
    await  navigateTo('/projects')
    // await router.push('/projects')
  } catch (error: any) {
    alert('Proje oluşturulurken bir hata oluştu: ' + error.message)
  }
}

const handleCancel = () => {
  router.push('/projects')
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
      label: 'Yeni Proje',
      icon: 'i-lucide-plus',
      to: `/projects/new`,
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
          <UBreadcrumb :items="breadcrumbsItems" />
        </template>
        <template #right>
          <UButton
              label="Kaydet"
              icon="i-lucide-save"
              @click="handleSubmit"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageCard
          title="Yei Proje Bilgileri"
          description="Yeni Projeler Ekleyebilir /Güncelleyebilirsiniz"
          variant="subtle">
        <ProjectForm @submit="handleSubmit" @cancel="handleCancel" />
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


