<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)
const avatar_path = ref('')
const toast = useToast()

// Kullanıcı ID'sini al
const getUserId = async () => {
  if (user.value?.id) {
    return user.value.id
  }
  // Eğer user.value henüz yüklenmemişse, direkt auth'dan al
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser?.id) {
    throw new Error('Kullanıcı giriş yapmamış')
  }
  return authUser.id
}
const userId = await getUserId()

const profileSchema = z.object({
  username: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  avatar: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

// Profil bilgilerini getir
const { data } = await supabase
    .from('profiles')
    .select(`*`)
    .eq('id', userId)
    .single()
if (data) {
  avatar_path.value = data.avatar_url
}


const profile = reactive<Partial<ProfileSchema>>({
  email: user.value?.email || '',
  username: data?.username,
  website: data?.website || '',
  avatar: data?.avatar_url || undefined,
  bio: data?.bio || undefined
})

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {

  try {
    loading.value = true
    const userId = await getUserId()
    const updates = {
      id: userId,
      username: profileSchema.parse(event.data).username,
      website: profileSchema.parse(event.data).website,
      avatar_url: avatar_path.value,
      bio: profileSchema.parse(event.data).bio,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)

    console.log(event.data)

    if (error) throw error

    toast.add({title: 'Success', description: 'Your settings have been updated.', icon: 'i-lucide-check', color: 'success'})

  } catch (error : any) {
    console.log(event.data)
    //alert(error.message)
    toast.add({title: 'Hata', description: error.message || 'Hata oluştu', icon: 'i-lucide-check', color: 'error'})
  } finally {
    loading.value = false
  }

}



async function updateProfile() {
  try {
    loading.value = true
    const userId = await getUserId()
    const updates = {
      id: user.value?.id || userId,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    }
    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="These informations will be displayed publicly."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Tam adınız, herkese açık olarak görüntülenir."
        required>
        <UInput
            v-model="profile.name"
            autocomplete="off"
            class="w-full"
        />
      </UFormField>

      <UFormField
        name="email"
        label="Email"
        description="E-posta adresiniz, yalnızca sizin yetki verdiğiniz kişilere gösterilir."
        required>
        <UInput
            v-model="profile.email"
            type="email"
            autocomplete="off"
            class="w-full"
        />
      </UFormField>

      <UFormField
        name="username"
        label="Username"
        description="Kullanıcı adınız, yalnızca sizin yetki verdiğiniz kişilere gösterilir."
        required>
        <UInput
            v-model="profile.username"
            type="username"
            autocomplete="off"
            class="w-full"
        />
      </UFormField>
      <USeparator />

      <Avatar v-model:path="avatar_path" @upload="updateProfile" />
      <USeparator />

      <UFormField name="bio" label="Bio" description="Hakkınızda daha fazla bilgi verin." :ui="{ container: 'w-full' }">
        <UTextarea
          v-model="profile.bio"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>

    </UPageCard>
  </UForm>
</template>
