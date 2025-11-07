<script lang="ts" setup>
import {upperFirst} from "scule";
import type {BreadcrumbItem, TableColumn, Pla} from '@nuxt/ui'
import {getPaginationRowModel} from '@tanstack/table-core'
import type {Row} from '@tanstack/table-core'
import type {Project} from '~/types'

definePageMeta({
// Giriş yapmış kullanıcılar için
  middleware: 'auth'
})
const Placeholder = resolveComponent('Placeholder')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

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
const rowSelection = ref({/*1: true*/})
const isLoading = ref(true)

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
      label: 'Proje ayrıntılarını görüntüle',
      icon: 'i-lucide-eye',
      to: `/projects/${row.original.id}`,
      onSelect() {
        toast.add({
          title: 'Proje ödemeleri',
          description: 'Proje ödemelerini gösteriliyor...',
          icon: 'i-lucide-eye'
        })
      },
    },
    {type: 'separator'},
    {
      label: 'Proje ayrıntılarını düzenle',
      icon: 'i-lucide-pencil',
      to: `/projects/${row.original.id}/edit`,
      onSelect() {
        toast.add({
          title: 'Proje ayrıntılarını',
          description: 'Proje ayrıntılarını gösteriliyor...',
          icon: 'i-lucide-list'
        })
      }
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
    meta: {class: {th: 'w-20', td: 'w-20'}},
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
    meta: {class: {th: 'w-20 p-0 m-0', td: 'w-20 m-0 p-0'}},
    header: ({table}) => {
      return h(UCheckbox, {
        class: 'justify-center min-w-20',
        'modelValue': table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      })
    },
    cell: ({row}) =>
        h(UCheckbox, {
          class: 'justify-center',
          'modelValue': row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'ariaLabel': 'Select row'
        })
  },
  {
    accessorKey: 'id',
    meta: {class: {th: 'w-20 text-center', td: 'w-20 text-center'}},
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
      const avatarUrl = `https://xmgmeanyjehayuslmnjg.supabase.co/storage/v1/object/public/avatars/${row.original?.profile_avatar_url}`
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
              src: row.original?.profile_avatar_url? avatarUrl : 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
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
    meta: {class: {th: 'text-center w-20 ', td: 'text-center w-20'}},
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
      }[row.original.status]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () =>
          row.original.status
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
  pageSize: 10
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

const breadcrumbsItems = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Projeler',
    icon: 'i-lucide-briefcase-business',
    to: '/projects',
    active: true
  },
])

</script>

<template>
  <UDashboardPanel id="projects-page" >
    <template #header>
      <UDashboardNavbar id="Projeler">

        <template #leading>
          <UDashboardSidebarCollapse/>
          <UBreadcrumb :items="breadcrumbsItems" />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="Yeni Proje Ekle" to="/projects/new"/>
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
              <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
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
              </CustomersDeleteModal>
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
            <UDrawer direction="right">
              <UButton label="Filitre" color="primary" variant="subtle" trailing-icon="i-lucide-funnel-plus" />
              <template #content>
                <Placeholder class="min-w-96 min-h-96 size-full m-4" />
              </template>
            </UDrawer>
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>

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
          :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
          :ui="{
          base: 'table-fixed',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 border border-muted ',
          td: 'border border-muted'
        }"
          class="shrink-0 border border-muted rounded-lg"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
              :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length"
              @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <!-- ✅ Footer -->
      <div class="flex items-center justify-between gap-2 border-t border-muted py-2 px-4">
        <p class="text-muted text-sm">
          Leventler Asansör • © {{ new Date().getFullYear() }}
        </p>
        <div class="flex items-center justify-end gap-1.5">
          <UButton
              aria-label="GitHub"
              color="neutral"
              icon="simple-icons:github"
              target="_blank"
              to="https://abdulkadirlevent.com.tr"
              variant="ghost"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

