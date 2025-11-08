<script lang="ts" setup>
const props = withDefaults(defineProps<{
  count?: number
}>(), {
  count: 0
})

const open = ref(false)

const emit = defineEmits<{
  submit: [data: object]
  cancel: []
}>()

// İptal
const handleSubmit = async () => {
  // await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
  const response = {
    count: props.count,
    message: `Proje başarıyla silindi`
  }
  emit('submit', response)
}
// İptal
const handleCancel = async () => {
  // await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
  emit('cancel')
}

</script>

<template>
  <UModal
      v-model:open="open"
      :description="`Bu işlem geri alınamaz!`"
      :title="`${count > 1 ? 'Projeleri' : 'Projeyi'} Sil`"
      :ui="{ footer: 'justify-end' }">
    <slot/>
    <template #body>
      <div class="flex items-center justify-start gap-2">
        <UBadge class="font-bold rounded-full">{{ count }}</UBadge>
        {{ `Projeyi silmek istediğinize emin misiniz?` }}
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton
            color="neutral"
            icon="i-lucide-x"
            label="İptal"
            variant="subtle"
            @click="handleCancel"
        />
        <UButton
            :label="`${count > 1 ? 'Projeleri' : 'Projeyi'} Sil`"
            color="error"
            icon="i-lucide-trash"
            loading-auto
            variant="solid"
            @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
