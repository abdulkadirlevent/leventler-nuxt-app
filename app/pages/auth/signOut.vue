<template>
  <div class="p-8 text-center">
    <p>Çıkış yapılıyor...</p>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuth()
const route = useRoute()

onMounted(async () => {
  try {
    await signOut()
    // İsteğe bağlı: query ile gelen redirect adresine yönlendir, yoksa ana sayfaya git
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (err) {
    console.error('Sign out failed:', err)
    await navigateTo('/auth/login')
  }
})
</script>
