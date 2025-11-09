// server/api/auth/login.post.ts
import {useAuth} from "~/composables/useAuth";
export default defineEventHandler(async (event) => {

    const {signIn} = useAuth()

    const { email, password } = await readBody(event)

    try {
        const loginUser = await signIn(email, password)

        // ✅ Session'a veri ekleniyor (Server-side)
        await setUserSession(event, {
            user: {
                id: loginUser.user?.id,
                githubId: loginUser.user?.id,
                name: loginUser.user?.user_metadata.full_name,
                email: loginUser.user?.email,
                avatar: loginUser.user?.user_metadata.avatar_url,
            }
        })

        return {
            success: true,
            message: 'Giriş başarılı'
        }
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            message: error.message || 'Giriş yapılırken bir hata oluştu'
        })
    }
})