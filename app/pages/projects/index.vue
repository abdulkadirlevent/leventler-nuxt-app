<script lang="ts" setup>
import { computed } from 'vue'
import {h, resolveComponent} from 'vue'
import {upperFirst} from "scule";
import type {BreadcrumbItem, DropdownMenuItem, TableColumn, TableRow} from '@nuxt/ui'
import {getPaginationRowModel} from '@tanstack/table-core'
import type {Row} from '@tanstack/table-core'
import type {Project} from '~/types'
import AppFooter from "~/components/AppFooter.vue";
import {navigateTo} from "#app";

definePageMeta({
// Giriş yapmış kullanıcılar için
  middleware: 'auth'
})

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')
const isLoading = ref(true)
const columnFilters = ref([{
  id: 'title',
  value: ''
}])
const columnVisibility = ref({
  actions: true,
  select: true,
  id: false,
  title: true,
  description: true,
  due_date: true,
  status: true,
})
const rowSelection = ref<Record<string, boolean>>({/*1: true*/})
const openFilterDrawer = ref(false)

function getRowItems(row: Row<Project>) {
  return [
    {type: 'label', label: 'İşlemler', icon: 'i-lucide-ellipsis-vertical'},
    {type: 'separator'},
    {
      label: 'Proje kimliğini kopyala',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'panoya kopyalandı',
          description: 'Müşteri Kimliği panoya kopyalandı',
          icon: 'i-lucide-copy'
        })
      }
    },
    {type: 'separator'},
    {
      label: 'Görüntüle',
      icon: 'i-lucide-eye',
      to: `/projects/${row.original.id}`,
      onSelect() {},
    },
    {type: 'separator'},
    {
      label: 'Düzenle',
      icon: 'i-lucide-pencil',
      to: `/projects/${row.original.id}/edit`,
      onSelect() {}
    },
    {type: 'separator'},
    {
      label: 'Proje\'yi sil',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Proje silindi',
          description: 'Müşteri başarıyla silindi.',
          icon: 'i-lucide-trash'
        })
      }
    }
  ]
}

const columns: TableColumn<Project>[] = [
  {
    id: 'actions',
    header: 'İşlemler',
    meta: {class: {th: 'w-20 text-center', td: 'w-20 text-center'}},
    cell: ({row}) => {
      return h('div', {class: 'text-center'},
          h(
              UDropdownMenu,
              {
                content: {align: 'start'},
                items: getRowItems(row),
              },
              () =>
                  h(UButton, {
                    icon: 'i-lucide-ellipsis-vertical',
                    size: 'xl',
                    color: 'neutral',
                    variant: 'ghost',
                    class: 'ml-auto'
                  })
          )
      )
    }
  },
  {
    id: 'select',
    meta: {class: {th: 'w-20 text-center p-0 m-0', td: 'w-20 text-center m-0 p-0'}},
    header: ({table}) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all'
        }),
    cell: ({row}) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'ariaLabel': 'Select row'
        })
  },
  {
    accessorKey: 'id',
    meta: {class: {th: 'w-32 text-left', td: 'w-32 text-left'}},
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h('div', {class: 'flex items-center justify-center'},
          h(UButton, {
            color: 'neutral',
            variant: 'link',
            label: '#ID',
            icon: isSorted
                ? isSorted === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
            class: 'w-full cursor-pointer',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
          }))
    },
    cell: ({row}) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'title',
    meta: {class: {th: 'text-left', td: 'text-left'}},
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Title',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => {

      const avatarUrl = row.original?.profile_avatar_url
          ?`https://xmgmeanyjehayuslmnjg.supabase.co/storage/v1/object/public/avatars/${row.original?.profile_avatar_url}`
          :''

      return h('div',
          {
            class: 'flex items-center gap-3 cursor-pointer ', onClick: () => {
              if (row.original?.id) {
                navigateTo(`/projects/${row.original.id}`)
              }
            }
          }, [

            h(UAvatar, {
              size: 'lg',
              src:  avatarUrl,
              class: 'rounded-full'
            }),

            h('div', undefined, [
              h('p', {class: 'font-medium text-highlighted'}, row.original?.title),
              h('p', {class: ''}, `Önem: ${row.original.priority}`)
            ])
          ])
    }
  },
  {
    accessorKey: 'description',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Description',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'due_date',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Due Date',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => formatDate(row.original.due_date || '')
  },
  {
    accessorKey: 'priority',
    filterFn: 'equals',
    meta: {class: {th: 'text-center w-20 ', td: 'text-center w-20'}},
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Priority',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => {
      const color = {
        low: 'primary' as const,
        medium: 'warning' as const,
        high: 'success' as const,
        urgent: 'error' as const,
        critical: 'error' as const,
      }[row.original.priority]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () =>
          row.original.priority
      )
    }
  },
  {
    accessorKey: 'status',
    filterFn: 'equals',
    meta: {class: {th: 'w-20 text-center', td: 'w-20 text-center'}},
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Status',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => {
      const color = {
        pending: 'primary' as const,
        in_progress: 'warning' as const,
        completed: 'success' as const,
        cancelled: 'error' as const,
        archived: 'secondary' as const,
        deleted: 'error' as const,
      }[row.getValue('status') as string]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () =>
          row.getValue('status')
      )
    }
  },
]

const statusFilter = ref('all')
const priorityFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('status')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

watch(() => priorityFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('priority')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const currentPage = ref(1)

watchEffect(() => {
  const idx = table?.value?.tableApi?.getState().pagination.pageIndex ?? 0
  currentPage.value = idx + 1
})

function onPageChange(p: number) {
  table?.value?.tableApi?.setPageIndex(Math.max(0, p - 1))
}

// Sayfa boyutu değiştiğinde tabloyu yenile ve ilk sayfaya dön
watch(() => pagination.value.pageSize, (newSize) => {
  // UTable iç durumu ile senkronize et
  const api = table?.value?.tableApi
  if (!api) return
  pagination.value.pageIndex=0
  api.setPageSize(newSize)
  api.setPageIndex(0)
  console.log('pagination.value.pageSize', pagination.value.pageSize)
})

const {getProjects, deleteProject} = useProjects()
const projects = ref<any[]>([])
const error = ref<string | null>(null)

// Projeleri yükle
const loadProjects = async () => {
  try {
    isLoading.value = true
    error.value = null
    projects.value = await getProjects()
  } catch (err: any) {
    error.value = err.message || 'Projeler yüklenirken bir hata oluştu'
    console.error('Proje yükleme hatası:', err)
  } finally {
    isLoading.value = false
  }
}

// Proje silme
const handleDelete = async (id: string) => {
  if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
    return
  }

  try {
    await deleteProject(id)
    await loadProjects() // Listeyi yenile
  } catch (err: any) {
    alert('Proje silinirken bir hata oluştu: ' + err.message)
  }
}

// İlk yüklemede projeleri al
onMounted(() => {
  loadProjects()
})

// Tarih formatla
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleDeleteCancel = () => {
  toast.add({title: 'Başarılı', description: `İşlem iptal edildi.`, color: 'error'})
  rowSelection.value = {}
}

const handleDeleteSubmit = async (data: any) => {
  try {
    toast.add({title: 'Başarılı', description: ` ${data.count}  ${data.message}`, color: 'success'})
    // await  navigateTo('/projects')
    // await router.push('/projects')
  } catch (error: any) {
    console.error('HATA', error)
    toast.add({title: 'Başarılı', description: `Proje oluşturulurken bir hata oluştu ${error.message} `, color: 'success'})
  }
}

const breadcrumbsItems = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Projeler',
    icon: 'i-lucide-briefcase-business',
  },
])

const itemsPageSize = ref<DropdownMenuItem[]>([
  {label: '5', onSelect: (e: Event) => pagination.value.pageSize = 5},
  {label: '10', onSelect: (e: Event) => pagination.value.pageSize = 10},
  {label: '20', onSelect: (e: Event) => pagination.value.pageSize = 20},
  {label: '50', onSelect: (e: Event) => pagination.value.pageSize = 50},
  {label: '100', onSelect: (e: Event) => pagination.value.pageSize = 100},
  {label: '250', onSelect: (e: Event) => pagination.value.pageSize = 250},
  {label: '500', onSelect: (e: Event) => pagination.value.pageSize = 500},
  {label: '1000', onSelect: (e: Event) => pagination.value.pageSize = 1000},
])
</script>

<template>
  <UDashboardPanel id="projects-page">
    <template #header>
      <UDashboardNavbar id="Projeler">

        <template #leading>
          <UDashboardSidebarCollapse icon="i-lucide-menu" />
          <UBreadcrumb :items="breadcrumbsItems"/>
        </template>

        <template #right>
          <UButton
              :to="`/projects/new`"
              color="primary"
              icon="i-lucide-plus"
              label="Yeni Proje Ekle"
              variant="subtle"/>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="px-2">
        <template #left>
          <div class="flex items-center justify-between gap-1.5 w-full">
            <div class="relative inline-flex items-center max-w-sm">
              <UInput
                  :model-value="(table?.tableApi?.getColumn('title')?.getFilterValue() as string)"
                  :ui="{ trailing: 'pe-1' }"
                  class="min-w-72 max-w-xl"
                  icon="i-lucide-search"
                  placeholder="Filter projects..."
                  @update:model-value="table?.tableApi?.getColumn('title')?.setFilterValue($event)">
                <template v-if="(table?.tableApi?.getColumn('title')?.getFilterValue() as string)?.length" #trailing>
                  <UButton
                      aria-label="Clear input"
                      color="neutral"
                      icon="i-lucide-circle-x"
                      size="sm"
                      variant="link"
                      @click="table?.tableApi?.getColumn('title')?.setFilterValue(null)"
                  />
                </template>
              </UInput>
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              <ProjectsDeleteModal
                  :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
                  @cancel="handleDeleteCancel"
                  @submit="handleDeleteSubmit">
                <UButton
                    v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
                    color="error"
                    icon="i-lucide-trash"
                    label="Delete"
                    variant="subtle">
                  <template #trailing>
                    <UKbd>
                      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                    </UKbd>
                  </template>
                </UButton>
              </ProjectsDeleteModal>
            </div>
          </div>
        </template>

        <template #right>
          <div class="flex items-center gap-1.5">
            <USelect v-model="statusFilter"
                     :items="[
              { label: 'Tüm Durumlar', value: 'all' },
              { label: 'Beklemede', value: 'pending' },
              { label: 'Devam Ediyor', value: 'in_progress' },
              { label: 'Tamamlandı', value: 'completed' },
              { label: 'İptal Edildi', value: 'cancelled' },
            ]"
                     :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                     class="min-w-28"
                     placeholder="Filter status"
            />
            <USelect
                v-model="priorityFilter"
                :items="[
                  { label: 'Tüm Öncelikler', value: 'all' },
                  { label: 'Düşük', value: 'low' },
                  { label: 'Normal', value: 'medium' },
                  { label: 'Yüksek', value: 'high' },
              ]"
                :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                class="min-w-28"
                placeholder="Filter Priority"
            />
            <UDropdownMenu
                :content="{ align: 'end' }"
                :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            >
              <UButton
                  color="neutral"
                  label="Display"
                  trailing-icon="i-lucide-settings-2"
                  variant="outline"
              />
            </UDropdownMenu>
            <UDrawer
                v-model:open="openFilterDrawer"
                description="Filtreleme ile arama yapabilirsiniz."
                direction="right"
                title="Filtreleme alanı">
              <UButton color="primary" label="Filitre" trailing-icon="i-lucide-funnel-plus" variant="subtle"/>
              <template #body>
                <div class="min-w-[360px] size-full"> MERHABA</div>
              </template>
              <template #footer>
                <UButton
                    class="justify-center cursor-pointer"
                    color="primary"
                    icon="i-lucide-funnel"
                    label="Filtrele"
                    variant="outline"
                    @click="openFilterDrawer = false"/>
              </template>
            </UDrawer>
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex-1 overflow-y-auto flex flex-col h-full">
        <div class="flex flex-col h-full gap-2">
          <div class="flex-1 min-h-0">
            <div class="overflow-y-auto h-full">
              <div class="relative rounded overflow-auto [&::-webkit-scrollbar-thumb]:bg-transparent border border-gray-300 dark:border-gray-700 h-full flex-1 min-h-full">
                <UTable
                    v-if="projects"
                    ref="table"
                    v-model:column-filters="columnFilters"
                    v-model:column-visibility="columnVisibility"
                    v-model:pagination="pagination"
                    v-model:row-selection="rowSelection"
                    :columns="columns"
                    :data="projects"
                    :loading="isLoading"
                    :pagination-options="{getPaginationRowModel: getPaginationRowModel()}"/>
              </div>
            </div>
          </div>

          <div
              class="overflow-x-auto overflow-y-hidden whitespace-nowrap w-full border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 py-3 md:px-4 px-3 rounded">
            <div class="flex flex-row items-center justify-between w-full">
              <div class="flex flex-row items-center gap-2 text-sm">Toplam: 11.018.541,22 ₺</div>
            </div>
          </div>

          <div
              class="border border-gray-200 dark:border-gray-700/50 min-h-[49px] flex-shrink-0 flex items-center overflow-x-auto px-4 py-2  bg-gray-100 rounded-lg dark:bg-gray-800/50">
            <div class="flex items-center justify-between gap-3 mt-auto">
              <div class="text-sm text-muted">
                Toplam {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} kayıt.
              </div>
              <div v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length" class="text-sm text-muted">
                Seçilen {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
              </div>
              <div class="flex items-center gap-1.5">

                <UDropdownMenu
                    :items="itemsPageSize"
                    :ui="{ content: '', align: 'end' }">
                  <UButton :label="String(pagination.pageSize)" color="neutral" variant="outline" class="text-center" />
                </UDropdownMenu>

                <UPagination
                    :page="currentPage"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="onPageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <AppFooter/>
    </template>
  </UDashboardPanel>
</template>

