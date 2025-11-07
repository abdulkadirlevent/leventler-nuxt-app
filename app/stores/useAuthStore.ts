/*

import { defineStore } from 'pinia';
import {useToast} from "#ui/composables/useToast";
import { useFetch } from '#app';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: null as string | null,
        isAuthenticated: false,
    }),

    actions: {
        // ---------------------
        // Login işlemi
        // ---------------------
        async login(payload: { email: string; password: string }) {
            const config = useRuntimeConfig()
            const toast = useToast()

            try {
                const data = await $fetch('/api/login', {
                    baseURL: config.public.apiBase,
                    method: 'POST',
                    body: payload,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })

                // ✅ Login başarılı, token ve user bilgilerini al
                this.token = data?.data?.token       // response.data.token
                this.user = data?.data?.user         // response.data.user
                this.isAuthenticated = !!this.user

                toast.add({
                    title: 'Başarılı',
                    description: `Hoşgeldin ${this.user?.name || ''}`,
                    color: 'success',
                })

                // Kullanıcı bilgilerini tekrar fetch et (opsiyonel, user zaten dönüyor)
                await this.fetchUser()

                navigateTo('/projeler')
            } catch (error: any) {
                console.error('Login error:', error)
                toast.add({
                    title: 'Hata',
                    description: 'Giriş yapılamadı. Bilgileri kontrol edin.',
                    color: 'error',
                })
            }
        },

        // ---------------------
        // Kullanıcı bilgilerini alma
        // ---------------------
        async fetchUser() {
            if (!this.token) return

            const config = useRuntimeConfig()

            try {
                const data = await $fetch('/api/auth-user', {
                    baseURL: config.public.apiBase,
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.token}`,
                    },
                })

                // auth.user yolunu kullanıyoruz çünkü backend response'u bu yapıda
                this.user = data?.auth?.user || this.user
                this.isAuthenticated = !!this.user
            } catch (error) {
                console.error('fetchUser error:', error)
                this.logout()
            }
        },

        // ---------------------
        // Logout
        // ---------------------
        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            navigateTo('/login')
        },
    },
})

*/
