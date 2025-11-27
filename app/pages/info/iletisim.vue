<script lang="ts" setup>

definePageMeta({
  layout: 'docs',
})

const items = computed(() => [
  {
    label: 'Hakkımızda',
    to: '/info/iletisim',
    icon: 'i-lucide-facebook'
  },
  {
    label: 'Banka hesaplarımız',
    to: '/info/iletisim',
    icon: 'i-lucide-mail'
  },
  {
    label: 'İletişim',
    to: '/info/iletisim',
    icon: 'i-lucide-phone'
  },
])

</script>

<template>
  <UPageHero
      :links="items"
      variant="subtle"
      :ui="{ container: 'bg-muted border border-warning rounded-lg mt-4 p-3' }"
      description="Hafta içi 09:00 - 17:00 saatleri arasında hizmet veriyoruz."
      title="İletişim bilgilerimiz"
  />
</template>

<style scoped>

</style>