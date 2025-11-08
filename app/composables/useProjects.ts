// Projelerle ilgili işlemler için composable
// Supabase client'ı kullanarak CRUD işlemlerini yönetir
import type {Project} from "~/types";

export const useProjects = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

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

  // Tüm projeleri getir
  const getProjects = async () => {
    const userId = await getUserId()
    const { data, error } = await supabase
      .from('projects_with_profile')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })
    if (error) throw error
    return data
  }

  // Tek bir projeyi getir
  const getProject = async (id: string): Promise<Project> => {
    const userId = await getUserId()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  // Yeni proje ekle
  const createProject = async (project: {
    title: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
  }) => {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }


  // Proje güncelle
  const updateProject = async (id: string, updates: {
    title?: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
  }) => {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Proje sil
  const deleteProject = async (id: string) => {
    const userId = await getUserId()

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  }
}

