export default defineNuxtRouteMiddleware(() => {
    const toast = useToast()
    const { user } = useAuth()

    if (!user.value) {
        return navigateTo( '/auth/login')
    }

    if ((user.value as any)?.role !== 'admin') {
        toast.add({
            title: 'Bu sayfaya erişim yetkiniz yok',
            color: 'error'
        })
        return navigateTo('/settings')
    }
})