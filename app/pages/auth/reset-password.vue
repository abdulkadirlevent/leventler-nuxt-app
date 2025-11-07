<script lang="ts" setup>
import * as z from 'zod'
import type {AuthFormField, FormSubmitEvent} from '@nuxt/ui'

const supabase = useSupabaseClient()

definePageMeta({
  layout: 'auth'
})

const {updatePassword} = useAuth()
const toast = useToast()

// Query paramdaki `code` değerini SSR ve istemci tarafında güvenle almak için
const route = useRoute()
const router = useRouter()
const requestURL = useRequestURL()

const loading = ref(false)
const message = ref('')

const error = ref<string | null>(null)
const success = ref(false)
const code = ref<string | null>(null)

const fields: AuthFormField[] = [
  {
    name: 'password',
    label: 'Şifre',
    type: 'password' as const,
    placeholder: 'Şifrenizi girin',
    required: true
  },
  {
    name: 'password_confirm',
    label: 'Şifre tekrarı',
    type: 'password' as const,
    placeholder: 'Şifrenizi girin',
    required: true
  },
]


const schema = z.object({
  newPassword: z.string('Yeni şifre gerelklidir').min(8, 'En az 8 karakter olmalıdır'),
  password_confirm: z.string('Şifre tekrarı gerelklidir').min(8, 'En az 8 karakter olmalıdır')
})

type Schema = z.output<typeof schema>

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true
    message.value = ''
    await updatePassword(payload.data.newPassword)
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

// Sayfa yüklendiğinde URL'den code parametresini al
onMounted(async () => {
  const queryCode = route.query.code as string | ''
  if (!queryCode) {
    error.value = 'Geçersiz bağlantı.'
    toast.add({title: 'Hata', description: `${error.value}`, color: 'error'})
    // return
  }

  code.value = queryCode || 'as'

  // Supabase'e session değişimi
  const {data, error: exchangeError} = await supabase.auth.exchangeCodeForSession(queryCode)

  if (exchangeError) {
    error.value = 'Kod doğrulanamadı: ' + exchangeError.message
    toast.add({title: 'Hata', description: `${error.value}`, color: 'error'})
   //  return
  }
  // URL’den code parametresini gizle
  // await router.replace({query: {}})
})

</script>


<template>
  <UAuthForm
      :disabled="loading"
      :fields="fields"
      :loading="loading"
      :schema="schema"
      :submit="{ label: loading ? 'Gönderiliyor...' : 'Şifremi Yenile', icon:'i-lucide-rotate-ccw-key' }"
      class="w-full"
      icon="i-lucide-lock"
      title="Şifre Sıfırlama"
      @submit="onSubmit">

    <template #description>
      <div v-if="code" class="my-4 text-sm">
        Sıfırlama kodu: <span class="font-mono px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{{ code }}</span>
      </div>
      Hesabınız yok mu?
      <ULink class="text-primary font-medium" to="/auth/signup">Kayıt olun</ULink>
    </template>

    <template #password-hint>
      <ULink class="text-primary font-medium" tabindex="-1" to="/auth/forgot-password">Şifremi unuttum?</ULink>
    </template>

    <template #footer>
      <ULink class="text-primary font-medium" to="/">Hizmet Şartlarımız</ULink>
      <div v-if="message" :class="['mb-4', 'alert']">
        {{ message }}
      </div>
    </template>
  </UAuthForm>
</template>


