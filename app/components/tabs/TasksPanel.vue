<script lang="ts" setup>
// Görevler sekmesi için basit panel
// Ör: defineProps<{ projectId?: string }>()
import ProjectForm from "~/components/projects/ProjectForm.vue";
</script>

<template>
  <UPageCard
      description="Bu alanda görev listesi, filtreler ve hızlı eylemleri gösterebilirsiniz."
      title="Görevler"
      variant="subtle">
    <div class="space-y-3">
      <div class="rounded-lg border border-muted divide-y">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center gap-2">
            <UCheckbox/>
            <span>Veritabanı şemasını güncelle</span>
          </div>
          <UBadge color="primary" variant="soft">Yüksek</UBadge>
        </div>
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center gap-2">
            <UCheckbox/>
            <span>Bildirim e‑postalarını düzenle</span>
          </div>
          <UBadge color="neutral" variant="soft">Orta</UBadge>
        </div>
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center gap-2">
            <UCheckbox/>
            <span>UI temalarını gözden geçir</span>
          </div>
          <UBadge color="success" variant="soft">Düşük</UBadge>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
