// Kimlik doğrulama işlemleri için composable
// Supabase auth fonksiyonlarını sarmalar
export const useAuth = () => {
    const { clear } = useUserSession()
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const toast = useToast()
    // E-posta ve şifre ile kayıt ol
    const signUp = async (name: string, email: string, password: string, phone: string) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            phone,
            options: {
                emailRedirectTo: `${window.location.origin}/confirm`,
                data: {
                    display_name: `${name}`,
                    phone: `${phone}`,
                }
            }
        })
        if (error) {
            console.log('error', error)
            throw error
        }
        return data
    }

    // E-posta ve şifre ile giriş yap
    const signIn = async (email: string, password: string) => {
        const  data  =  await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email,
                password: password
            }
        })
        console.log('composables-useAuth', data)
        return data
    }

    // signOut fonksiyonu
    const signOut = async () => {
        try {
            // 1. Client-side Supabase session'ını kapat
            await supabase.auth.signOut()

            // 2. Server-side API call
            await $fetch('/api/auth/logout', {
                method: 'POST'
            })

            // 3. Local session'ı temizle
            await clear()

            // 4. Başarı mesajı
            toast.add({
                title: 'Çıkış Yapıldı',
                description: 'Başarıyla çıkış yaptınız',
                color: 'primary',
                icon: 'i-lucide-log-out'
            })

            // 5. Login sayfasına yönlendir
            navigateTo('/auth/login')

            return { success: true }
        } catch (error: any) {
            console.error('Logout error:', error)

            // Hata olsa bile local state'i temizle
            await clear()

            toast.add({
                title: 'Uyarı',
                description: 'Çıkış yapıldı ancak bir hata oluştu',
                color: 'error'
            })

            // Yine de login sayfasına yönlendir
            navigateTo('/auth/login')

            return { success: false, error: error.message }
        }
    }

    // Hızlı çıkış (API call olmadan - offline durumlar için)
    const quickLogout = async () => {
        await supabase.auth.signOut()
        await clear()
        navigateTo('/auth/login')
    }

    // Şifre sıfırlama e-postası gönder
    const resetPassword = async (email: string) => {
        const {error, data,} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })

        if (error) {
            console.log('error', error)
            throw error
        }

        console.log('data', data)
        return {
            success: 'Please check your email',
            error: '',
            data: data,
        }
    }

    // @param newPassword
    const updatePassword = async (newPassword: string) => {
        const {data, error} = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            console.log('error', error)
            throw error
        }

        console.log('data', data)
        return {
            success: 'Password updated',
            error: '',
            data: data,
        }
    }

    return {
        user: readonly(user),
        signUp,
        signIn,
        signOut,
        quickLogout,
        resetPassword,
        updatePassword,
    }
}