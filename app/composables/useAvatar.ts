/**
 * 1. Temel Kullanım
 * import { useAvatar } from '~/composables/useAvatar'
 * const { getAvatarUrl } = useAvatar()
 * @example const { getAvatarUrl,getAvatarUrlWithFallback, getPlaceholderAvatar } = useAvatar()
 *  - Component veya composable içinde
 * @example const avatarUrl = getAvatarUrl(row.original?.profile_avatar_url)
 * 2. Fallback ile Kullanım
 *  - Eğer avatar yoksa otomatik placeholder döner
 * @example const avatarUrl = getAvatarUrlWithFallback(row.original?.profile_avatar_url)
 * 3. Kullanıcı Adına Göre
 *  -  Kullanıcı Adına Göre Placeholder verir
 * @example const avatarUrl = row.original?.profile_avatar_url
 *   ? getAvatarUrl(row.original.profile_avatar_url)
 *   : getPlaceholderAvatar(row.original.username || 'User')
 *
 */
export const useAvatar = () => {
    const config = useRuntimeConfig()

    // Supabase storage base URL'i
    const SUPABASE_URL = config.public.supabase?.url || 'https://xmgmeanyjehayuslmnjg.supabase.co'
    const AVATAR_BUCKET = 'avatars'

    /**
     * Avatar URL'sini tam path ile döndürür
     * @param avatarPath - Avatar dosya yolu (örn: "user123/profile.jpg")
     * @param defaultAvatar - Varsayılan avatar URL'i (opsiyonel)
     * @returns Tam avatar URL'i veya default avatar
     */
    const getAvatarUrl = (avatarPath?: string | null, defaultAvatar: string = ''): string => {
        if (!avatarPath) return defaultAvatar

        // Eğer tam URL ise olduğu gibi döndür
        if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
            return avatarPath
        }

        // Supabase storage URL'i oluştur
        return `${SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/${avatarPath}`
    }

    /**
     * Avatar için fallback URL'i ile birlikte döndürür
     * @param avatarPath - Avatar dosya yolu
     * @returns Avatar URL'i veya varsayılan placeholder
     */
    const getAvatarUrlWithFallback = (avatarPath?: string | null): string => {
        const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random'
        return getAvatarUrl(avatarPath, defaultAvatar)
    }

    /**
     * Kullanıcı adına göre placeholder avatar oluşturur
     * @param name - Kullanıcı adı
     * @param size - Avatar boyutu (varsayılan: 200)
     * @returns UI Avatars API URL'i
     */
    const getPlaceholderAvatar = (name: string, size: number = 200): string => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random`
    }

    return {
        getAvatarUrl,
        getAvatarUrlWithFallback,
        getPlaceholderAvatar
    }
}