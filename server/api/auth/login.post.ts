// server/api/auth/login.post.ts
import { serverSupabaseClient } from '#supabase/server'
import { useAvatar } from '~/composables/useAvatar'
const { getAvatarUrl } = useAvatar()
export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)

    try {
        const supabase = await serverSupabaseClient(event)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw createError({
                statusCode: 401,
                message: error.message || 'Giriş yapılırken bir hata oluştu'
            })
        }
        // console.log('Supabase OAuth success:', data)

        // Profiles tablosundan kullanıcı bilgilerini çek
        const { data: profile, error: profileError } = await supabase.from('profiles')
            .select('avatar_url, username')
            .eq('id', data.user.id)
            .single()

        console.log('Profile fetch:', profile)

        if (profileError) {
            console.error('Profile fetch error:', profileError)
        }

        const avatarUrl = getAvatarUrl(profile?.avatar_url || '')

        // Session'ı kaydet
        await setUserSession(event, {
            user: {
                provider: 'email',
                supabaseID:data.user.id,
                id: data.user.id,
                email: data.user.email,
                name: profile?.username || data.user.email,
                avatar: avatarUrl,
                emailVerified: data.user.confirmed_at || '',
                metadata: data.user.user_metadata || ''
            },
            supabaseSession: {
                accessToken: data.session?.access_token || '',
                tokenType: data.session?.token_type || '',
                expiresIn: data.session?.expires_in || '',
                tokens: data.session?.refresh_token || ''
            },
            loggedInAt: Date.now()
        })

        // DEBUG: Session'ı kontrol et
        // const savedSession = await getUserSession(event)
        // console.log('Saved session:', savedSession)

        return {user: data.user, success: true, message: 'Giriş başarılı'}

    } catch (error: any) {
        throw createError({
            statusCode: 401,
            message: error.message || 'Giriş yapılırken bir hata oluştu'
        })
    }
})