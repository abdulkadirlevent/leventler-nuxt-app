<script setup lang="ts">

</script>

<template>
  <div class="flex items-center justify-between gap-2 border-t border-muted py-2 px-4">
    <p class="text-muted text-sm">
      Leventler Asansör • © {{ new Date().getFullYear() }}
    </p>
    <div class="flex items-center justify-end gap-1.5">
      <UButton
          aria-label="GitHub"
          color="neutral"
          icon="simple-icons:github"
          target="_blank"
          to="https://abdulkadirlevent.com.tr"
          variant="ghost"/>
    </div>
  </div>
</template>

<style scoped>

</style>