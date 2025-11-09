<script lang="ts" setup>
import type {TableColumn, DropdownMenuItem} from '@nuxt/ui'
import {useClipboard} from '@vueuse/core'
import {getPaginationRowModel} from "@tanstack/table-core";
import {h, resolveComponent} from "vue";

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

interface User {
  id: number
  name: string
  position: string
  email: string
  role: string
}

const toast = useToast()
const {copy} = useClipboard()

const table = useTemplateRef('table')
const data = ref<User[]>([
  {
    id: 1,
    name: 'Lindsay Walton',
    position: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 2,
    name: 'Courtney Henry',
    position: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin'
  },
  {
    id: 3,
    name: 'Tom Cook',
    position: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member'
  },
  {
    id: 4,
    name: 'Whitney Francis',
    position: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Admin'
  },
  {
    id: 5,
    name: 'Leonard Krasner',
    position: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Owner'
  },
  {
    id: 6,
    name: 'Floyd Miles',
    position: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Member'
  }
])
const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    meta: {class: {th: 'w-20 text-center', td: 'w-20 text-center'}},
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
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
      })
    },
  },
  {
    accessorKey: 'name',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Name',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
  },
  {
    accessorKey: 'email',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Email',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
  },
  {
    accessorKey: 'role',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: 'Role',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: 'w-full cursor-pointer',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
  },
  {
    id: 'action',
    header: 'Action',
    meta: {class: {th: 'w-20 text-center', td: 'w-20 text-center'}},
  }
]
const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

function getDropdownActions(user: User): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy user Id',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(user.id.toString())

          toast.add({
            title: 'User ID copied to clipboard!',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        }
      }
    ],
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit'
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
}
</script>

<template>
  <UPageCard
      description="Projede görev alan personeller ve prodeki görevleri"
      title="Proje çalışanları"
      class="bg-[#0F172BFF]"
      variant="subtle">
    <div class="w-full space-y-4 pb-4">

      <div class="relative my-5 overflow-x-auto">
        <table class="w-full border-separate border-spacing-0 rounded-md">
          <thead class="bg-muted">
          <tr class="[&amp;:first-child&gt;th:first-child]:rounded-tl-md [&amp;:first-child&gt;th:last-child]:rounded-tr-md [&amp;:last-child&gt;td:first-child]:rounded-bl-md [&amp;:last-child&gt;td:last-child]:rounded-br-md">
            <th class="py-3 px-4 font-semibold text-sm text-left border-e border-b first:border-s border-t border-muted">Name</th>
            <th class="py-3 px-4 font-semibold text-sm text-left border-e border-b first:border-s border-t border-muted">Type</th>
          </tr>
          </thead>
          <tbody class="">
          <tr class="[&amp;:first-child&gt;th:first-child]:rounded-tl-md [&amp;:first-child&gt;th:last-child]:rounded-tr-md [&amp;:last-child&gt;td:first-child]:rounded-bl-md [&amp;:last-child&gt;td:last-child]:rounded-br-md">
            <td class="py-3 px-4 text-sm text-left align-top border-e border-b first:border-s border-muted [&amp;_code]:text-xs/5 [&amp;_p]:my-0 [&amp;_p]:leading-6 [&amp;_ul]:my-0 [&amp;_ol]:my-0 [&amp;_ul]:ps-4.5 [&amp;_ol]:ps-4.5 [&amp;_li]:leading-6 [&amp;_li]:my-0.5">
              <code
                  class="px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-muted text-highlighted bg-muted language-ts-type shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"
                  language="ts-type"><span class="sBMFI">tableRef</span></code></td>
            <td class="py-3 px-4 text-sm text-left align-top border-e border-b first:border-s border-muted [&amp;_code]:text-xs/5 [&amp;_p]:my-0 [&amp;_p]:leading-6 [&amp;_ul]:my-0 [&amp;_ol]:my-0 [&amp;_ul]:ps-4.5 [&amp;_ol]:ps-4.5 [&amp;_li]:leading-6 [&amp;_li]:my-0.5">
              <code
                  class="px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-muted text-highlighted bg-muted language-ts-type shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"
                  language="ts-type"><span class="sBMFI">Ref</span><span class="sMK4o">&lt;</span><span class="sBMFI">HTMLTableElement</span><span class="sMK4o"> |</span><span
                  class="sBMFI"> null</span><span class="sMK4o">&gt;</span></code></td>
          </tr>
          <tr class="[&amp;:first-child&gt;th:first-child]:rounded-tl-md [&amp;:first-child&gt;th:last-child]:rounded-tr-md [&amp;:last-child&gt;td:first-child]:rounded-bl-md [&amp;:last-child&gt;td:last-child]:rounded-br-md">
            <td class="py-3 px-4 text-sm text-left align-top border-e border-b first:border-s border-muted [&amp;_code]:text-xs/5 [&amp;_p]:my-0 [&amp;_p]:leading-6 [&amp;_ul]:my-0 [&amp;_ol]:my-0 [&amp;_ul]:ps-4.5 [&amp;_ol]:ps-4.5 [&amp;_li]:leading-6 [&amp;_li]:my-0.5">
              <code
                  class="px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-muted text-highlighted bg-muted language-ts-type shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"
                  language="ts-type"><span class="sBMFI">tableApi</span></code></td>
            <td class="py-3 px-4 text-sm text-left align-top border-e border-b first:border-s border-muted [&amp;_code]:text-xs/5 [&amp;_p]:my-0 [&amp;_p]:leading-6 [&amp;_ul]:my-0 [&amp;_ol]:my-0 [&amp;_ul]:ps-4.5 [&amp;_ol]:ps-4.5 [&amp;_li]:leading-6 [&amp;_li]:my-0.5">
              <a class="text-primary border-b border-transparent hover:border-primary font-medium focus-visible:outline-primary [&amp;&gt;code]:border-dashed hover:[&amp;&gt;code]:border-primary hover:[&amp;&gt;code]:text-primary transition-colors [&amp;&gt;code]:transition-colors"
                 href="https://tanstack.com/table/latest/docs/api/core/table#table-api"
                 rel="nofollow"><code
                  class="px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-muted text-highlighted bg-muted language-ts-type shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"
                  language="ts-type"><span class="sBMFI">Table</span></code></a></td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="relative my-5 group"><!---->
        <button aria-label="Copy code to clipboard"
                class="rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 text-xs gap-1.5 ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted p-1.5 absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition"
                rel="noopener" tabindex="-1"
                type="button">
          <span aria-hidden="true" class="iconify i-lucide:copy shrink-0 size-4"></span><!----><!----></button>
        <pre
            class="group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none language-vue shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"><code><span
            class="line" line="1"><span class="sMK4o">&lt;</span><span class="swJcz">script</span><span class="spNyl"> setup</span><span class="spNyl"> lang</span><span
            class="sMK4o">=</span><span class="sMK4o">"</span><span class="sfazB">ts</span><span class="sMK4o">"</span><span class="sMK4o">&gt;
</span></span><span class="line" line="2"><span class="spNyl">const</span><span class="sTEyZ"> table </span><span class="sMK4o">=</span><span
            class="s2Zo4"> useTemplateRef</span><span class="sTEyZ">(</span><span class="sMK4o">'</span><span class="sfazB">table</span><span class="sMK4o">'</span><span
            class="sTEyZ">)
</span></span><span class="line" line="3"><span class="sMK4o">&lt;/</span><span class="swJcz">script</span><span class="sMK4o">&gt;
</span></span><span class="line" line="4"><span emptylineplaceholder="true">
</span></span><span class="line" line="5"><span class="sMK4o">&lt;</span><span class="swJcz">template</span><span class="sMK4o">&gt;
</span></span><span class="line" line="6"><span class="sMK4o">  &lt;</span><span class="swJcz">UTable</span><span class="spNyl"> ref</span><span class="sMK4o">=</span><span
            class="sMK4o">"</span><span class="sfazB">table</span><span class="sMK4o">"</span><span class="sMK4o"> /&gt;
</span></span><span class="line" line="7"><span class="sMK4o">&lt;/</span><span class="swJcz">template</span><span class="sMK4o">&gt;
</span></span></code></pre>
      </div>

      <UTable
          ref="table"
          v-model:pagination="pagination"
          :columns="columns"
          :data="data"
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
          class="shrink-0 border border-muted rounded-lg flex-1">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
                :alt="`${row.original.name} avatar`"
                :src="`https://i.pravatar.cc/120?img=${row.original.id}`"
                size="lg"
            />
            <div>
              <p class="font-medium text-highlighted">
                {{ row.original.name }}
              </p>
              <p>
                {{ row.original.position }}
              </p>
            </div>
          </div>
        </template>
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton
                aria-label="Actions"
                color="neutral"
                icon="i-lucide-ellipsis-vertical"
                variant="ghost"
            />
          </UDropdownMenu>
        </template>
      </UTable>

      <div class="flex justify-center pt-4">
        <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </UPageCard>
</template>