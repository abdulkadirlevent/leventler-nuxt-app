// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession()

    if (loggedIn.value) {
        // Eğer gitmek istediği bir yer varsa oraya yönlendir
        const redirectTo = to.query.redirect as string

        if (redirectTo) {
            return navigateTo(redirectTo)
        }

        // Yoksa ana sayfaya yönlendir
        return navigateTo('/')
    }
})