/**
 * Kullanım örneği
 * @example const { data: api } = await useFetch('/api/test')
 * <pre>{{ api }}</pre>
 */

import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    if (!supabase) {
        throw createError({ statusMessage: 'Supabase client not found' })
    }

    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // const session = await serverSupabaseSession(event)
    const session = await getUserSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Session not found' })
    }

    // ✅ User ID kontrolü yap
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Kullanıcı oturumu bulunamadı'
        })
    }
    console.log('User ID:', session.user.id) // Debug için

    // const { data, error } = await supabase.from('test').select('*')
    // Supabase sorgusunu yap
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

    if (error) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }

    if (error) {
        throw createError({ statusMessage: error })
    }

    return { success: true, data }

})