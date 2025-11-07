<script lang="ts" setup>
import AppLogo from "~/components/AppLogo.vue";

const route = useRoute()

const items = computed(() => [
  {
    label: 'Docs',
    to: '/docs',
    active: route.path.startsWith('/docs')
  },
  {
    label: 'Pricing',
    to: '/pricing'
  },
  {
    label: 'Blog',
    to: '/blog'
  }, {
    label: 'Changelog',
    to: '/changelog'
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
        :items="items"
        variant="link"
    />

    <template #right>
      <UColorModeButton/>

      <UButton
          class="lg:hidden"
          color="neutral"
          icon="i-lucide-log-in"
          to="/login"
          variant="ghost"
      />

      <UButton
          class="hidden lg:inline-flex"
          color="neutral"
          label="Sign in"
          to="/login"
          variant="outline"
      />

      <UButton
          class="hidden lg:inline-flex"
          color="neutral"
          label="Sign up"
          to="/signup"
          trailing-icon="i-lucide-arrow-right"
      />
    </template>

    <template #body>
      <UNavigationMenu
          :items="items"
          class="-mx-2.5"
          orientation="vertical"
      />

      <USeparator class="my-6"/>

      <UButton
          block
          class="mb-3"
          color="neutral"
          label="Sign in"
          to="/login"
          variant="subtle"
      />
      <UButton
          block
          color="neutral"
          label="Sign up"
          to="/signup"
      />
    </template>
  </UHeader>
</template>