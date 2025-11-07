<script lang="ts" setup>

// path'in string veya undefined olabileceğini belirtiyoruz
const props = defineProps<{ path?: string, size?: string }>()
// const props = defineProps(['path', 'size'])
const {path, size} = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const uploading = ref(false)
const isDeleting = ref(false)
const files = ref()
const fileRef = ref<HTMLInputElement>()

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }
  files.value = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}

const downloadImage = async () => {
  try {
    const filePath = path.value || '';

    const {data, error} = await supabase.storage.from('avatars').download(filePath)
    if (error) throw error
    files.value = URL.createObjectURL(data)
  } catch (error: any) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt: any) => {
  files.value = evt.target.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }
    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    // get user id from auth
    const {data: userData, error: userErr} = await supabase.auth.getUser()
    if (userErr) throw userErr
    const userId = userData.user?.id
    if (!userId) throw new Error('Kullanıcı giriş yapmamış.')

    const fileName = `${unique}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // 1) upload new file
    const {error: uploadError} = await supabase.storage.from('avatars').upload(filePath, file)
    if (uploadError) throw uploadError

    // 2) list existing files in user's folder
    const {data: listData, error: listErr} = await supabase.storage.from('avatars').list(userId, {limit: 100, offset: 0, sortBy: {column: 'name', order: 'asc'}})
    if (listErr) {
      // listeleme başarısızsa uyar, ama yeni dosya yüklemesi zaten başarılı, silme adımını atla veya tekrar dene
      console.warn('Could not list files after upload:', listErr.message)
    } else {
      // 3) delete all files except the newly uploaded one
      const filesToDelete = listData.map((f: any) => `${userId}/${f.name}`).filter((p: string) => p !== filePath)

      // delete in sequence or parallel (paralel için Promise.all)
      if (filesToDelete.length) {
        // delete each file
        await Promise.all(filesToDelete.map(async (p: string) => {
          const {error: delErr} = await supabase.storage.from('avatars').remove([p])
          if (delErr) {
            console.warn('Failed to delete', p, delErr.message)
          }
        }))
      }
    }

    // 4) optionally get public url
    const {data: publicData} = supabase.storage.from('avatars').getPublicUrl(filePath)

    // emit events to parent component
    emit('update:path', filePath)
    emit('upload', {path: filePath, publicUrl: publicData?.publicUrl})

  } catch (error: any) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

downloadImage()

watch(path, () => {
  if (path.value) {
    downloadImage()
  }
})

/**
 * Tüm avatarları siler ve profiles.avatar_url alanını temizler.
 * - Bucket: 'avatars'
 * - Kullanıcı id: auth.getUser()
 * - Güvenlik: path'lerin ilk segmenti userId ile eşleşmeli
 */
const deleteAllAvatarsForCurrentUser = async () => {
  const supabase = useSupabaseClient()
  isDeleting.value = true

  try {
    // 1) get user
    const {data: userData, error: userErr} = await supabase.auth.getUser()
    if (userErr) throw userErr
    const userId = userData.user?.id
    if (!userId) throw new Error('Kullanıcı giriş yapmamış.')

    // 2) listele (kullanıcının klasörü)
    const {data: listData, error: listErr} = await supabase.storage.from('avatars').list(userId, {
      limit: 1000, // gerektiğinde paging ekle
      offset: 0,
      sortBy: {column: 'name', order: 'asc'}
    })

    if (listErr) throw listErr

    if (!listData || listData.length === 0) {
      // silinecek dosya yok; yine de profile temizlenebilir
      const {error: updateErr} = await supabase
          .from('profiles')
          .update({avatar_url: null, updated_at: new Date()})
          .eq('id', userId);
      if (updateErr) throw updateErr;
      return {success: true, deleted: 0};
    }

    // 3) paths dizisi oluştur
    const paths = listData.map((f: any) => `${userId}/${f.name}`)

    // 4) topluca sil
    const {error: deleteErr} = await supabase.storage.from('avatars').remove(paths)
    if (deleteErr) {
      // bazı silmeler başarısız olursa, detaylı hata için ayrı ayrı silme veya retry uygulayabilirsin
      throw deleteErr
    }

    // 5) profile güncelle
    const {error: updateErr} = await supabase
        .from('profiles')
        .update({avatar_url: null, updated_at: new Date()} as any) // as any eklendi
        .eq('id', userId);
    if (updateErr) throw updateErr;

    files.value = null;

  } catch (error: any) {
    console.error('Error deleting avatars: ', error.message);
  } finally {
    isDeleting.value = false;
  }
}


</script>

<template>
  <div>
    <UFormField
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
        description="Profiliniz için bir resim yükleyin. JPG, GIF veya PNG. 1MB Max."
        label="Avatar"
        name="avatar">
      <div class="flex flex-wrap items-center gap-2">
        <UAvatar v-if="false" :src="files" alt="Avatar" size="3xl"/>
        <UButton :label="uploading ? 'Yükleniyor...' : 'Resim seç'" color="neutral" icon="i-lucide-image" @click="onFileClick"/>
        <UButton v-if="files" :disabled="isDeleting" :label="'Sil'" color="error" icon="i-lucide-trash" @click="deleteAllAvatarsForCurrentUser"/>
        <input
            id="single"
            ref="fileRef"
            :disabled="uploading"
            accept="image/*, .jpg, .jpeg, .png, .gif"
            class="hidden"
            type="file"
            @change="uploadAvatar">
      </div>

    </UFormField>
    <USeparator class="my-2"/>
    <img
        v-if="files"
        :src="files"
        alt="Avatar"
        class="avatar image"
        style="width: 10em; height: 10em;"
    />
    <div v-else :style="{ height: size, width: size }" class="avatar no-image"/>

    <div class="my-2  min-h-2">
      <UProgress v-if="uploading"/>
    </div>

    <div v-if="false" style="width: 10em; position: relative;">
      <label class="button primary block" for="single">
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input
          id="single"
          :disabled="uploading"
          accept="image/*"
          style="position: absolute; visibility: hidden;"
          type="file"
          @change="uploadAvatar"
      />
    </div>
  </div>
</template>