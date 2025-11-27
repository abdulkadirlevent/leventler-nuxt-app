<script lang="ts" setup>
import * as z from 'zod'
import type {AuthFormField, ButtonProps, FormSubmitEvent} from '@nuxt/ui'
import {useAuth} from '~/composables/useAuth';

const {user, loggedIn, openInPopup} = useUserSession()
const route = useRoute()
const toast = useToast()
const {signIn} = useAuth()

// Reactive state
const message = ref('')
const hasError = ref(false)
const errorTitle = ref('')
const isLoading = ref(false)

definePageMeta({
  layout: 'docs', // Eğer özel auth layout'unuz varsa
  middleware: 'guest' // Giriş yapmışları ana sayfaya yönlendirir
})

useSeoMeta({
  title: 'Giriş Yap',
  description: 'Devam etmek için hesabınıza giriş yapın'
})

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

const providers = ref<ButtonProps[]>([
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      openInPopup('/auth/google')
    }
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    color: 'neutral',
    variant: 'subtle',
    onClick: async () => {
      openInPopup('/auth/github')
    }
  }
])

type Schema = z.output<typeof schema>
const schema = z.object({
  email: z.string().email("Geçersiz e-posta adresi"),
  password: z.string('Password is required').min(8, 'En az 8 karakter olmalıdır')
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true

    const data = await signIn(payload.data.email, payload.data.password);

    console.log('data', data)

    if (data.user) {
      // ÖNEMLİ: Session'ı client'ta yenile
      const {fetch: fetchSession} = useUserSession()
      await fetchSession()

      await navigateTo(`/?success=true&provider=email`)
    }

  } catch (error: any) {
    toast.add({
      title: 'Hata',
      description: error.data?.message || 'Giriş yapılırken bir hata oluştu',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Hatayı manuel olarak temizle
const clearError = () => {
  hasError.value = false
  errorTitle.value = ''
  message.value = ''
}

onMounted(() => {
  const error = route.query.error
  const message = route.query.message as string
})

// Sadece loggedIn değiştiğinde çalışır
watch(loggedIn, (newValue, oldValue) => {
  if (newValue && !oldValue) { // false'dan true'ya geçtiğinde
    toast.add({
      title: 'Hoşgeldiniz',
      description: `${user.value?.name || user.value?.email}`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    navigateTo('/')
  }
})

</script>

<template>
  <UContainer class="flex items-center justify-center min-h-[calc(100vh-150px)]">
    <UCard class="w-full max-w-md">
      <UAuthForm
          :disabled="isLoading"
          :fields="fields"
          :loading="isLoading"
          :providers="providers"
          :schema="schema"
          :submit="{ label: isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap', icon:'i-lucide-lock'}"
          class="w-full"
          icon="i-lucide-user"
          separator="Providers"
          title="Tekrar hoş geldiniz"
          @submit="onSubmit">

        <template #description>
          Hesabınız yok mu?
          <ULink class="text-primary font-medium" to="/auth/signup">Kayıt olun</ULink>
        </template>

        <template #password-hint>
          <ULink class="text-primary font-medium" tabindex="-1" to="/auth/forgot-password">Şifremi unuttum?</ULink>
        </template>

        <template #validation>
          <UAlert
              v-if="hasError"
              :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link' }"
              :description="message"
              :title="errorTitle || 'Error signing in'"
              class="mb-6"
              color="error"
              icon="i-lucide-alert-circle"
              @close="clearError"
          />
        </template>

        <template #footer>
          Giriş yaparak
          <ULink class="text-primary font-medium" to="/">Hizmet Şartlarımızı</ULink>
          kabul etmiş olursunuz.
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>
