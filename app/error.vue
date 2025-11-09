<script lang="ts" setup>
import type {NuxtError} from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator/>
    <NuxtLayout>
      <UContainer>
        <UHeader icon="i-lucide-arrow-left" title="LEVENTLER ASANSÖR" to="/"/>
        <UError
            :clear="{
              color: 'neutral',
              size: 'xl',
              icon: 'i-lucide-arrow-left',
              class: 'rounded-full cursor-pointer',
              label:'Ana sayfaya dön'
             }"
            :error=" error || { statusCode: 404,statusMessage: 'Sayfa bulunamadı', message: 'Aradığınız sayfa bulunamadı.'}"
            :ui="{statusCode: 'text-9xl'}"
            redirect="/"
        />
        <UFooter/>
      </UContainer>
    </NuxtLayout>
  </UApp>
</template>
