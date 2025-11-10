<script lang="ts" setup>
import type {AvatarProps, DropdownMenuItem} from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const toast = useToast()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone',]

const {signOut} = useAuth()
const {user, clear} = useUserSession()

const items = computed<DropdownMenuItem[][]>(() => (
    [
      [
        {
          type: 'label',
          label: user.value?.name || user.value?.username,
          avatar: {
            src: user.value?.avatar,
            alt: user.value?.name || user.value?.username
          }
        }
      ],
      [
        {
          label: 'Profilim',
          icon: 'i-lucide-user',
          to: '/auth/login'
        },
        {
          label: 'Billing',
          icon: 'i-lucide-credit-card'
        },
        {
          label: 'Settings',
          icon: 'i-lucide-settings',
          to: '/settings'
        },
      ],
      [
        {
          label: 'Theme',
          icon: 'i-lucide-palette',
          children: [
            {
              label: 'Primary',
              slot: 'chip',
              chip: appConfig.ui.colors.primary,
              content: {
                align: 'center',
                collisionPadding: 16
              },
              children: colors.map(color => ({
                label: color,
                chip: color,
                slot: 'chip',
                type: 'checkbox',
                checked: appConfig.ui.colors.primary === color,
                onSelect: (e) => {
                  e.preventDefault()
                  appConfig.ui.colors.primary = color
                }
              }))
            }, {
              label: 'Neutral',
              slot: 'chip',
              chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
              content: {
                align: 'end',
                collisionPadding: 16
              },
              children: neutrals.map(color => ({
                label: color,
                chip: color === 'neutral' ? 'old-neutral' : color,
                slot: 'chip',
                type: 'checkbox',
                checked: appConfig.ui.colors.neutral === color,
                onSelect: (e) => {
                  e.preventDefault()
                  appConfig.ui.colors.neutral = color
                }
              }))
            }]
        },
        {
          label: 'Appearance',
          icon: 'i-lucide-sun-moon',
          children: [{
            label: 'Light',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
              e.preventDefault()
              colorMode.preference = 'light'
            }
          }, {
            label: 'Dark',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
              if (checked) {
                colorMode.preference = 'dark'
              }
            },
            onSelect(e: Event) {
              e.preventDefault()
            }
          }]
        }
      ],
      [
        {
          label: 'Çıkış Yap',
          icon: 'i-lucide-log-out',
          class: 'text-error',
          // to: '/auth/signOut',
          onSelect() {
            isOpen.value = true
          }
        }
      ]
    ] as DropdownMenuItem[][]
))

const isOpen = ref(false)
const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  await signOut()
  isOpen.value = false
  // Sayfa yönlenecek
}

</script>

<template>
  <UDropdownMenu
      :content="{ align: 'center', collisionPadding: 12 }"
      :items="items"
      :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
        :avatar="{
        src: user?.avatar as AvatarProps['src'] || undefined,
        alt: user?.name || user?.username
      }"
        :square="collapsed"
        :ui="{
        trailingIcon: 'text-dimmed'
      }"
        block
        class="data-[state=open]:bg-elevated"
        color="neutral"
        v-bind="{
        label: collapsed ? undefined : (user?.name || user?.username),
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
        variant="ghost"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
            :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
            class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
        />
      </div>
    </template>
  </UDropdownMenu>

  <UModal v-model:open="isOpen" :ui="{ footer: 'justify-end' }" title="Çıkış Yap">
    <template #body>
      <p class="text-gray-400">
        Çıkış yapmak istediğinizden emin misiniz?
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" icon="i-lucide-x" variant="outline" @click="isOpen = false">İptal</UButton>
        <UButton :loading="loading" color="success" icon="i-lucide-log-out" variant="outline" @click="handleLogout">Evet, Çıkış Yap</UButton>
      </div>
    </template>
  </UModal>
</template>
