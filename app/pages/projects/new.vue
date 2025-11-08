<script lang="ts" setup>
import ProjectForm from "~/components/projects/ProjectForm.vue";
import {navigateTo} from "#app";
import type {BreadcrumbItem} from "@nuxt/ui";
import AppFooter from "~/components/AppFooter.vue";

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

const {createProject} = useProjects()
const router = useRouter()

const handleSubmit = async (projectData: any) => {
  try {
    await createProject(projectData)
    toast.add({title: 'Success', description: `Yeni Proje ${projectData.title} eklendi`, color: 'success'})
    await navigateTo('/projects')
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
          <UBreadcrumb :items="breadcrumbsItems"/>
        </template>
        <template #right>
          <UButton
              :label="'Kaydet'"
              color="success"
              icon="i-lucide-save"
              variant="subtle" @click="handleSubmit"/>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageCard
          description="Yeni Projeler Ekleyebilir /Güncelleyebilirsiniz"
          title="Yei Proje Bilgileri"
          variant="subtle">
        <ProjectForm @cancel="handleCancel" @submit="handleSubmit"/>
      </UPageCard>
    </template>

    <template #footer>
      <AppFooter/>
    </template>
  </UDashboardPanel>
</template>


