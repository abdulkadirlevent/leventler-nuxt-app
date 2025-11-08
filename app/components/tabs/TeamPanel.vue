<script lang="ts" setup>
// Ekip sekmesi için basit panel
// Ör: defineProps<{ teamId?: string }>()
</script>

<template>
  <UPageCard
      description="Ekip üyeleri, roller ve iletişim bilgileri."
      title="Ekip"
      variant="subtle">
    <div class="space-y-3">
      <ul class="divide-y rounded-lg border border-muted">
        <li class="flex items-center justify-between p-3">
          <div class="flex items-center gap-3">
            <UAvatar name="Ayşe Yılmaz" size="md"/>
            <div>
              <p class="font-medium">Ayşe Yılmaz</p>
              <p class="text-xs text-muted-foreground">Proje Yöneticisi</p>
            </div>
          </div>
          <UBadge color="primary" variant="soft">Yönetici</UBadge>
        </li>
        <li class="flex items-center justify-between p-3">
          <div class="flex items-center gap-3">
            <UAvatar name="Mehmet Demir" size="md"/>
            <div>
              <p class="font-medium">Mehmet Demir</p>
              <p class="text-xs text-muted-foreground">Kıdemli Geliştirici</p>
            </div>
          </div>
          <UBadge color="neutral" variant="soft">Üye</UBadge>
        </li>
        <li class="flex items-center justify-between p-3">
          <div class="flex items-center gap-3">
            <UAvatar name="Zeynep Kaya" size="md"/>
            <div>
              <p class="font-medium">Zeynep Kaya</p>
              <p class="text-xs text-muted-foreground">Tasarımcı</p>
            </div>
          </div>
          <UBadge color="success" variant="soft">Üye</UBadge>
        </li>
      </ul>
    </div>
  </UPageCard>
</template>
