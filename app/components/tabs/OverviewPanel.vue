<script setup lang="ts">
// Overview (Genel Bakış) sekmesi için basit panel
// Gerekirse props ekleyebilirsiniz, örn: defineProps<{ projectId?: string }>()
import ProjectForm from "~/components/projects/ProjectForm.vue";
</script>

<template>
  <UPageCard
      title="Proje Detayları"
      description="Projenin genel durumunu, özet metrikleri ve son etkinlikleri burada gösterebilirsiniz."
      variant="subtle">
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="rounded-lg border border-muted p-4">
          <p class="text-sm text-muted-foreground">Tamamlanan Görevler</p>
          <p class="text-2xl font-semibold">12</p>
        </div>
        <div class="rounded-lg border border-muted p-4">
          <p class="text-sm text-muted-foreground">Bekleyen Görevler</p>
          <p class="text-2xl font-semibold">8</p>
        </div>
        <div class="rounded-lg border border-muted p-4">
          <p class="text-sm text-muted-foreground">Yaklaşan Son Tarihler</p>
          <p class="text-2xl font-semibold">3</p>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
