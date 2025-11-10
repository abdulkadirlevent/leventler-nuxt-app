// 1. SERVER API: Logout (Tam Kapsamlı)
// server/api/auth/logout.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)

        // 1. Supabase auth session'ını kapat
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Supabase signOut error:', error)
            // Hata olsa bile devam et, local session temizlensin
        }

        // 2. Nuxt Auth Utils session'ını temizle
        await clearUserSession(event)

        console.log('✅ User logged out successfully')

        return {
            success: true,
            message: 'Çıkış yapıldı'
        }
    } catch (error: any) {
        console.error('Logout error:', error)

        // Hata olsa bile session'ı temizle
        await clearUserSession(event)

        throw createError({
            statusCode: 500,
            message: 'Çıkış yapılırken bir hata oluştu'
        })
    }
})