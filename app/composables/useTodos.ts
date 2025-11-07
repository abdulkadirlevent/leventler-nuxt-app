// Görevlerle ilgili işlemler için composable
// Supabase client'ı kullanarak CRUD işlemlerini yönetir

export const useTodos = () => {
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

  // Tüm görevleri getir (tüm projeler için)
  const getTodos = async () => {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Belirli bir projeye ait görevleri getir
  const getTodosByProject = async (projectId: string) => {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Tek bir görevi getir
  const getTodo = async (id: string) => {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  // Yeni görev ekle
  const createTodo = async (todo: {
    title: string
    description?: string
    status?: string
    priority?: string
    project_id: string // Zorunlu
  }) => {
    const userId = await getUserId()

    // Projenin kullanıcıya ait olduğunu kontrol et
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', todo.project_id)
      .eq('user_id', userId)
      .single()

    if (projectError || !project) {
      throw new Error('Proje bulunamadı veya erişim yetkiniz yok')
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({
        title: todo.title,
        description: todo.description || null,
        status: todo.status || 'pending',
        priority: todo.priority || 'medium',
        project_id: todo.project_id,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Görev güncelle
  const updateTodo = async (id: string, updates: {
    title?: string
    description?: string
    status?: string
    priority?: string
    project_id?: string
  }) => {
    const userId = await getUserId()

    // Eğer project_id değiştiriliyorsa, yeni projenin kullanıcıya ait olduğunu kontrol et
    if (updates.project_id) {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', updates.project_id)
        .eq('user_id', userId)
        .single()

      if (projectError || !project) {
        throw new Error('Proje bulunamadı veya erişim yetkiniz yok')
      }
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Görev sil
  const deleteTodo = async (id: string) => {
    const userId = await getUserId()

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Projeye ait tüm görevleri sil
  const deleteTodosByProject = async (projectId: string) => {
    const userId = await getUserId()

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Görev durumunu güncelle (hızlı güncelleme için)
  const updateTodoStatus = async (id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    return await updateTodo(id, { status })
  }

  // Görev önceliğini güncelle (hızlı güncelleme için)
  const updateTodoPriority = async (id: string, priority: 'low' | 'medium' | 'high') => {
    return await updateTodo(id, { priority })
  }

  return {
    getTodos,
    getTodosByProject,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteTodosByProject,
    updateTodoStatus,
    updateTodoPriority
  }
}

