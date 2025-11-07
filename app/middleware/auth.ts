// Kimlik doğrulama middleware'i - Giriş yapmamış kullanıcıları yönlendirir
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})

