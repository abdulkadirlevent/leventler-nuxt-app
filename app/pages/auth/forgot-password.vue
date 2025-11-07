<script lang="ts" setup>
import * as z from 'zod'
import type {AuthFormField, FormSubmitEvent} from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { resetPassword } = useAuth()
const toast = useToast()

const loading = ref(false)
const message = ref('')


const fields: AuthFormField[] = [
  {
    name: 'email',
    defaultValue: 'abdulkadirlevent@hotmail.com',
    type: 'text' as const,
    label: 'E-posta',
    placeholder: 'E-posta adresinizi girin',
    required: true
  },
]

const schema = z.object({
  email: z.string().email("Geçersiz e-posta adresi"),
})

type Schema = z.output<typeof schema>

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true
    message.value = ''
    await resetPassword(payload.data.email)
    message.value = 'Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.'
    toast.add({title: 'Tamamlandı', description: `${message.value}`, color: 'success'})
    // Kullanıcı durumunun güncellenmesi için kısa bir bekleme
    await new Promise(r => setTimeout(() => r(navigateTo('/auth/login')), 2000))
  } catch (error: any) {
    message.value = error.message || 'Bir hata oluştu'
    toast.add({title: 'Hata', description: `${message.value}`, color: 'error'})
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
        :submit="{ label: loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder', icon:'i-lucide-lock' }"
        class="w-full"
        icon="i-lucide-lock"
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
        <ULink class="text-primary font-medium" to="/">Hizmet Şartlarımız</ULink>
      </template>
    </UAuthForm>
</template>


