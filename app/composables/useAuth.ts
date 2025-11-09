/*
import { useAuthStore } from '@/stores/useAuthStore';

export const useAuth = () => {
    const auth = useAuthStore();
    return {
        user: computed(() => auth.user),
        login: auth.login,
        logout: auth.logout,
        fetchUser: auth.fetchUser
    }
}
*/

// Kimlik doğrulama işlemleri için composable
// Supabase auth fonksiyonlarını sarmalar
import type {Provider, SignInWithOAuthCredentials} from "@supabase/auth-js/src/lib/types";

export const useAuth = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

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
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            console.log('error', error)
            throw error
        }
        return data
    }

    // Çıkış yap
    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) {
            console.error('error', error)
            throw error
        }else{
            console.log('signOut...')
        }
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

    /**
     * @param newPassword
     *
     */
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


    const signinWithGoogle = async () => {
        const auth_callback_url = `${process.env.SITE_URL}/auth/callback`
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google' as Provider,
            options: {
                redirectTo: auth_callback_url,
            },
        })

        if (error) {
            console.log(error)
        }

        navigateTo(data.url)
    }

    const signinWithGithub = async () => {
        const auth_callback_url = `${process.env.SITE_URL}/auth/callback`
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'github' as Provider,
            options: {
                redirectTo: auth_callback_url,
            },
        })

        if (error) {
            console.log(error)
        }

        navigateTo(data.url)
    }

    return {
        user: readonly(user),
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        signinWithGoogle,
        signinWithGithub
    }
}

