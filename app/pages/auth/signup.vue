<script lang="ts" setup>
import * as z from 'zod'
import type {AuthFormField, FormSubmitEvent} from '@nuxt/ui'

const {signUp} = useAuth()

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Kayıt Ol',
  description: 'Başlamak için bir hesap oluşturun'
})

const toast = useToast()
const loading = ref(false)
const message = ref('')
const fields: AuthFormField[] = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Ad Soyad',
    placeholder: 'Adınızı girin',
    required: true
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'E-posta',
    placeholder: 'E-posta adresinizi girin',
    required: true
  },
  {
    name: 'password',
    label: 'Şifre',
    type: 'password' as const,
    placeholder: 'Şifrenizi girin',
    required: true
  },
  {
    name: 'phone',
    label: 'Telefon',
    type: 'text' as const,
    placeholder: 'Telefon no girin'
  },
]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({title: 'Google', description: 'Google ile giriş yap'})
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({title: 'GitHub', description: 'GitHub ile giriş yap'})
  }
}]

const schema = z.object({
  name: z.string('Ad gereklidir').min(3, 'En az 3 karakter olmalıdır'),
  email: z.string('Email gereklidir').email('Geçersiz e-posta'),
  password: z.string('Şifre gereklidir').min(8, 'En az 8 karakter olmalıdır'),
  phone: z.string().optional().nullable()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    message.value = ''
    await signUp(payload.data.name, payload.data.email, payload.data.password, payload.data.phone || '')
    message.value = 'Kayıt başarılı! E-posta adresinize doğrulama linki gönderildi. Giriş sayfasına yönlendiriliyorsunuz...'
    toast.add({title: 'Başarılı', description: `${message.value}`, color: 'success'})
    // Kullanıcı durumunun güncellenmesi için kısa bir bekleme
    // setTimeout(async () => await navigateTo('/auth/login'), 2000)
    await new Promise(r => setTimeout(() => r(navigateTo('/auth/login')), 2000))
  } catch (error: any) {
    message.value = error.message || 'Kayıt yapılırken bir hata oluştu'
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
      :submit="{ label: loading ? 'Bekleyiniz...' : 'Hesap oluştur', icon:'i-lucide-user' }"
      class="w-full"
      icon="i-lucide-user"
      title="Tekrar hoş geldiniz"
      @submit="onSubmit">
    <template #description>
      Zaten hesabınız var mı?
      <ULink class="text-primary font-medium" to="/auth/login">Giriş yapın</ULink>
    </template>

    <template #footer>
      Kayıt olarak
      <ULink class="text-primary font-medium" to="/public">Hizmet Şartlarımızı</ULink>
      kabul etmiş olursunuz.
    </template>
  </UAuthForm>
</template>
