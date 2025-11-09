<script lang="ts" setup>
const links = [
  {
    label: 'LEVENTLER ASANSÖR',
    to: 'https://leventler.tr',
    target: '_blank',
  },
  {
    label: 'Abdulkadir LEVENT',
    to: 'https://abdulkadirlevent.com.tr',
    target: '_blank',
  },
]
</script>

<template>
  <USeparator class="h-px" icon="i-simple-icons-academia" type="dashed"/>
  <UFooter class="border-t border-muted p-0 m-0">
    <template #left>
      <p class="text-muted text-sm">
        Leventler Asansör © {{ new Date().getFullYear() }}
      </p>
    </template>

    <UNavigationMenu :items="links" class="h-8"/>

    <template #right>
      <UButton
          aria-label="Abdulkadir LEVENT"
          color="neutral"
          icon="i-simple-icons-academia"
          target="_blank"
          to="https://abdulkadirlevent.com.tr"
          variant="ghost"
      />
      <UButton
          aria-label="X"
          color="neutral"
          icon="simple-icons-x"
          target="_blank"
          to="https://x.com/abdulkadirLENT"
          variant="ghost"
      />
      <UButton
          aria-label="GitHub"
          color="neutral"
          icon="simple-icons-github"
          target="_blank"
          to="https://github.com/abdulkadirlevent"
          variant="ghost"/>
    </template>
  </UFooter>
</template>