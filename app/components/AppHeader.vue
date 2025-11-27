<script lang="ts" setup>
import AppLogo from "~/components/AppLogo.vue";

const route = useRoute()

const items = computed(() => [
  {
    label: 'Hakkımızda',
    to: '/info/about',
    icon: 'i-lucide-info'
  },
  {
    label: 'Banka hesaplarımız',
    to: '/info/banka-hesaplari',
    icon: 'i-lucide-receipt-turkish-lira'
  },
  {
    label: 'İletişim',
    to: '/info/iletisim',
    icon: 'i-lucide-phone'
  },
])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0"/>
      </NuxtLink>
    </template>

    <UNavigationMenu
        :active="route.path.startsWith('/auth/signup')"
        :items="items"
        variant="link"/>

    <template #right>
      <UColorModeButton/>

      <UButton
          class="hidden lg:inline-flex"
          color="neutral"
          label="Giriş yap"
          to="/auth/login"
          variant="outline"
      />

      <UButton
          class="hidden lg:inline-flex"
          color="neutral"
          label="Kayıt ol"
          to="/auth/signup"
          trailing-icon="i-lucide-arrow-right"
      />
    </template>

    <template #body>
      <UNavigationMenu :items="items" class="-mx-2.5" orientation="vertical"/>

      <USeparator class="my-6"/>

      <UButton
          block
          class="mb-3"
          color="neutral"
          label="Giriş yap"
          to="/auth/login"
          variant="subtle"
      />
      <UButton
          block
          color="neutral"
          label="Kayıt ol"
          to="/auth/signup"
      />
    </template>
  </UHeader>
</template>