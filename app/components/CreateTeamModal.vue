<script lang="ts" setup>
import type {FormSubmitEvent} from '@nuxt/ui'
import * as z from 'zod'
import type {CreateTeamSchema} from "~/types";

const {createTeam} = useOrgs()
const emit = defineEmits<{ close: [boolean] }>()

const formRef = ref<any>(null)
const state = reactive<Partial<CreateTeamSchema>>({
  name: undefined,
  slug: undefined,
})

const createTeamSchema = z.object({
  name: z.string('Ad gereklidir').min(1, 'Team name is required'),
  slug: z.string('Slug Gereklidir').min(1, 'Team slug is required'),
})

async function create(event: FormSubmitEvent<CreateTeamSchema>) {
  await createTeam(event, {showToast: true})
  emit('close', true)
  console.error('error')
}
</script>

<template>
<UModal
        :close="{ onClick: () => emit('close', false) }"
        :ui="{ footer: 'justify-end', body: '' }"
        description=""
        title="Yeni takım arkadaşlarını ekleyin">
      <template #body>
        <UForm
            ref="formRef"
            :schema="createTeamSchema"
            :state="state"
            class="space-y-2"
            @submit="create">
          <UFormField label="Name" name="name" required>
            <UInput v-model="state.name" class="w-full"/>
          </UFormField>
          <UFormField label="Slug" name="slug" required>
            <UInput v-model="state.slug" class="w-full"/>
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <UButton
            block
            color="success"
            icon="i-lucide:user-plus"
            label="Create Team"
            variant="subtle" @click="() => formRef?.submit()"/>
      </template>
    </UModal>
</template>