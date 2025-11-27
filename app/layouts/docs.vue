<script setup lang="ts">
/*
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

*/
</script>
<template>
  <div>
    <AppHeader />
    <UMain>
      <UContainer>
        <UPage>
          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>