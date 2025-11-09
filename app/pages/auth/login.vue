<script lang="ts" setup>
import * as z from 'zod'
import type {AuthFormField, FormSubmitEvent} from '@nuxt/ui'
import {useAuth} from '~/composables/useAuth';

// Giriş sayfası - Kullanıcı girişi yapar
const {signIn} = useAuth()
const loading = ref(false)
const message = ref('')

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Giriş Yap',
  description: 'Devam etmek için hesabınıza giriş yapın'
})

const toast = useToast()
const fields: AuthFormField[] = [
  {
    name: 'email',
    defaultValue: 'abdulkadirlevent@hotmail.com',
    type: 'text' as const,
    label: 'E-posta',
    placeholder: 'E-posta adresinizi girin',
    required: true
  },
  {
    name: 'password',
    defaultValue: 'Akll0571',
    label: 'Şifre',
    type: 'password' as const,
    placeholder: 'Şifrenizi girin'
  },
  {
    name: 'remember',
    label: 'Beni hatırla',
    type: 'checkbox' as const
  },
]

const schema = z.object({
  email: z.string().email("Geçersiz e-posta adresi"),
  password: z.string('Password is required').min(8, 'En az 8 karakter olmalıdır')
})

type Schema = z.output<typeof schema>

async function onSubmit222(payload: FormSubmitEvent<Schema>) {
  console.log('Gönderildi', payload)
  try {
    loading.value = true
    message.value = ''
    const loginUser = await signIn(payload.data.email, payload.data.password);
    message.value = 'Giriş başarılı! Yönlendiriliyorsunuz...'
    toast.add({title: 'Tamamlandı', description: `${message.value}`, color: 'success'})
    // Kullanıcı durumunun güncellenmesi için kısa bir bekleme
    // await new Promise(resolve => setTimeout(resolve, 2000))
    // navigateTo('/projects');

    await setUserSession(event, {
      user: {
        id: loginUser.user?.id,
        githubId: loginUser.user?.id,
        name: loginUser.user?.user_metadata.full_name,
        email:loginUser.user?.email,
        avatar: loginUser.user?.user_metadata.avatar_url,
      }
    })

    await new Promise(r => setTimeout(() => r(navigateTo('/')), 2000))
  } catch (error: any) {
    message.value = error.message || 'Giriş yapılırken bir hata oluştu'
    toast.add({title: 'Hata', description: `${message.value}`, color: 'error'})
  } finally {
    loading.value = false
  }
}


// pages/login.vue veya components/LoginForm.vue
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    loading.value = true

    // 1. Server API'ye istek at (session server'da set edilir)
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: payload.data.email,
        password: payload.data.password
      }
    })

    // 2. Client-side session bilgisini güncelle
    await refreshNuxtData() // veya useUserSession composable kullanın

    toast.add({
      title: 'Tamamlandı',
      description: 'Giriş başarılı! Yönlendiriliyorsunuz...',
      color: 'success'
    })

    await new Promise(r => setTimeout(() => r(navigateTo('/')), 2000))

  } catch (error: any) {
    toast.add({
      title: 'Hata',
      description: error.data?.message || 'Giriş yapılırken bir hata oluştu',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <UAuthForm
      :disabled="loading"
      :fields="fields"
      :loading="loading"
      :schema="schema"
      :submit="{ label: loading ? 'Giriş yapılıyor...' : 'Giriş Yap', icon:'i-lucide-lock'}"
      class="w-full"
      icon="i-lucide-user"
      title="Tekrar hoş geldiniz"
      @submit="onSubmit">

    <div v-if="message" :class="['alert']">
      {{ message }}
    </div>

    <template #description>
      Hesabınız yok mu?
      <ULink class="text-primary font-medium" to="/auth/signup">Kayıt olun</ULink>
    </template>

    <template #password-hint>
      <ULink class="text-primary font-medium" tabindex="-1" to="/auth/forgot-password">Şifremi unuttum?</ULink>
    </template>

    <template #footer>
      Giriş yaparak
      <ULink class="text-primary font-medium" to="/">Hizmet Şartlarımızı</ULink>
      kabul etmiş olursunuz.
    </template>
  </UAuthForm>


</template>
