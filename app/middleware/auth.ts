// Kimlik doğrulama middleware'i - Giriş yapmamış kullanıcıları yönlendirir
export default defineNuxtRouteMiddleware(async (to, from) => {
  // const user = useSupabaseUser()
  const { user:nuxtAuthUser } = useUserSession()

  // Herkese açık sayfalar (koruma yok)
  const publicPaths = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password']
  // Oturum açıkken yönlendirmek istediğimiz özel yollar (login/signup gibi)
  const privatePaths = ['/auth/login', '/auth/signup']

  // Eğer hedef herkese açık bir rota ise geçişe izin ver
  if (publicPaths.includes(to.path)) {
    // Oturum açıkken login/signup sayfalarına gidişi engellemek istiyoruz:
    if (nuxtAuthUser.value && privatePaths.includes(to.path)) {

      return navigateTo('/')
    }
    return
  }

  // Korunan bir sayfa ve kullanıcı yoksa login'e yönlendir (geri dönüş için redirect parametresi ekle)
  if (!nuxtAuthUser.value) {
    return navigateTo({path: '/auth/login', query: {redirect: to.fullPath}})
  }
})

