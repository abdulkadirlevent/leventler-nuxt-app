<script lang="ts" setup>
import * as z from 'zod'
import type {FormError, FormErrorEvent, FormSubmitEvent, SelectMenuItem} from '@nuxt/ui'
import {format} from 'date-fns';
import type {Project, ProjectPriority, ProjectStatus} from "~/types";

const props = defineProps<{
  project?: Project | null
}>()

const emit = defineEmits<{
  submit: [data: Omit<Project, 'id'>]
  cancel: []
}>()

const itemsStatus = ref<SelectMenuItem[]>([
  {label: 'Beklemede', id: 'pending'},
  {label: 'Devam Ediyor', id: 'in_progress'},
  {label: 'Tamamlandı', id: 'completed'},
  {label: 'İptal Edildi', id: 'cancelled'},
])

const itemsPriority = ref<SelectMenuItem[]>([
  {label: 'Düşük', id: 'low'},
  {label: 'Normal', id: 'medium'},
  {label: 'Yüksek', id: 'high'},
])

const schema = z.object({
  title: z.string().min(3, 'Başlık yazın En az 3 karakter'),
  description: z.string().min(3, 'Açıklama yazaın En az 3 karakter'),
  status: z.string(),
  priority: z.string(),
  due_date: z.string().optional(),
})

type Schema = z.output<typeof schema>

// başlangıç değerlerini ayarla
const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  status: 'pending',
  priority: 'medium',
  due_date: format(new Date(), 'yyyy-MM-dd')
})

// Eğer proje varsa (düzenleme modu), formu doldur
// 'yyyy-MM-dd HH:mm:ss'
watch(() => props.project, (project) => {
  if (project) {
    state.title = project.title || '',
        state.description = project.description || '',
        state.status = project.status || 'pending',
        state.priority = project.priority || 'medium',
        state.due_date = project.due_date ? format(new Date(project.due_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  }
}, {immediate: true})

// Form gönderimi
const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  const submitData = {
    title: state.title || '',
    description: state.description || '',
    status: state.status as ProjectStatus,
    priority: state.priority as ProjectPriority,
    due_date: state.due_date ? format(new Date(state.due_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  }
  // await updateProject(route.params.id as string, submitData)
  emit('submit', submitData)
}

const onError = async (event: FormErrorEvent) => {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
}
// İptal
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>

  <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @error="onError"
      @submit="handleSubmit">

    <UFormField label="Proje Başlığı" name="title" required>
      <UInput v-model="state.title" class="w-2xl" placeholder="Proje Başlığı" required/>
    </UFormField>

    <UFormField label="Açıklama" name="description" required>
      <UTextarea v-model="state.description" class="w-full" placeholder="Açıklama" required/>
    </UFormField>

    <div class="flex items-center justify-start gap-2">
      <UFormField label="Durum" name="status" placeholder="Durum" required>
        <USelectMenu v-model="state.status" :items="itemsStatus" class="w-2xl" value-key="id"/>
      </UFormField>
      <UFormField label="Öncelik" name="priority" placeholder="Öncelik" required>
        <USelectMenu v-model="state.priority" :items="itemsPriority" class="w-2xl" value-key="id"/>
      </UFormField>
    </div>

    <div class="flex items-center justify-start gap-2">
      <UFormField label="Bitiş Tarihi" name="due_date" placeholder="Bitiş Tarihi" required>
        <UInput v-model="state.due_date" class="w-2xl" type="date"/>
      </UFormField>
    </div>

    <div class="flex items-center justify-end gap-2">
      <UButton
          class="cursor-pointer"
          color="neutral"
          icon="i-lucide-x"
          label="Cancel"
          variant="subtle"
          @click="handleCancel"
      />

      <UButton
          :label="project ? 'Güncelle' : 'Kaydet'"
          class="cursor-pointer"
          color="success"
          icon="i-lucide-save"
          type="submit"
          variant="subtle"/>
    </div>
  </UForm>
</template>
