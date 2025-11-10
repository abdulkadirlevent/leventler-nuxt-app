<script lang="ts" setup>
import type {NavigationMenuItem} from '@nuxt/ui'

const {loggedIn, user, session, fetch, clear, openInPopup} = useUserSession()

const route = useRoute()
const toast = useToast()

const open = ref(false)
const collapsed = ref(false)

// const items = computed<DropdownMenuItem[][]>(() => (
const links = computed<NavigationMenuItem>(() => [[
      {
        label: 'Home', icon: 'i-lucide-house', to: '/', onSelect: () => {
          open.value = false
        }
      },

      // Koşullu menü - spread operator ile
      ...(loggedIn.value ? [
        {
          label: 'Inbox', icon: 'i-lucide-inbox', to: '/inbox', badge: '4', onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Customers', icon: 'i-lucide-users', to: '/customers', onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Projeler',
          icon: 'i-lucide-briefcase-business',
          to: '/projects',
          onSelect: () => {
            open.value = false
          }
        },

      ] : []),
      {
        label: 'Settings', to: '/settings', icon: 'i-lucide-settings', defaultOpen: true, type: 'trigger',
        children: [
          {
            label: 'General', to: '/settings', exact: true, onSelect: () => {
              open.value = false
            }
          },
          {
            label: 'Members', to: '/settings/members', onSelect: () => {
              open.value = false
            }
          },
          {
            label: 'Notifications', to: '/settings/notifications', onSelect: () => {
              open.value = false
            }
          },
          {
            label: 'Security', to: '/settings/security', onSelect: () => {
              open.value = false
            }
          }
        ]
      }],
      [
        {label: 'Feedback', icon: 'i-lucide-message-circle', to: 'https://github.com/nuxt-ui-templates/dashboard', target: '_blank'},
        {label: 'Help & Support', icon: 'i-lucide-info', to: 'https://github.com/nuxt-ui-templates/dashboard', target: '_blank'}
      ]
    ] as NavigationMenuItem[][]
)

const groups = computed(() => [
  {id: 'links', label: 'Go to', items: links.value.flat()},
  {
    id: 'code', label: 'Code',
    items: [{
      id: 'source',
      label: 'View page source',
      icon: 'i-simple-icons-github',
      to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
      target: '_blank'
    }]
  }])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'Çerez kullanımını onaylayın',
    description: 'Web sitemizdeki deneyiminizi geliştirmek için birinci taraf çerezleri kullanıyoruz.',
    // icon: 'i-lucide-info',
    duration: 0,
    close: {
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    },
    color: 'success',
    actions: [{
      label: 'Kabul et',
      color: 'success',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Vazgeç ve devam et',
      color: 'error',
      variant: 'outline',
      onClick: () => {
        cookie.value = null
      }
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">

    <UDashboardSidebar
        id="default"
        v-model:collapsed="collapsed"
        v-model:open="open"
        :ui="{ footer: 'lg:border-t lg:border-default'}"
        class="bg-elevated/25"
        collapsible
        resizable
        side="right">
      <template #header="{ collapsed: isCollapsed }" class="flex items-center justify-center">
        <AppLogo v-if="!isCollapsed" class="h-8 w-auto shrink-0 cursor-pointer" @click="navigateTo('/')"/>
        <UIcon v-else class="h-6 w-6 text-primary mx-auto cursor-pointer" name="i-lucide-circle-ellipsis" @click="collapsed=false"/>
      </template>

      <template #default="{ collapsed: isCollapsed }">
        <TeamsMenu :collapsed="isCollapsed"/>
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default"/>
        <UNavigationMenu
            :collapsed="collapsed"
            :items="links[0]"
            orientation="vertical"
            popover
            tooltip
        />

        <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            class="mt-auto"
            orientation="vertical"
            tooltip
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu v-if="loggedIn" :collapsed="collapsed"/>
        <UButton
            v-else
            :label="collapsed ? '' : 'Oturum Aç'"
            class="w-full"
            color="neutral"
            icon="i-lucide-log-in"
            to="/auth/login"
            variant="ghost"
        />
        <UButton
            v-if="false"
            :label="collapsed ? '' : 'Login with GitHub'"
            class="w-full"
            color="neutral"
            icon="i-simple-icons-github"
            variant="ghost"
            @click="openInPopup('/auth/github')"
        />

      </template>
    </UDashboardSidebar>

    <!-- Search -->
    <UDashboardSearch :groups="groups"/>
    <!-- Main slot (page content) -->
    <slot/>
    <!-- Notifications -->
    <NotificationsSlideover/>
  </UDashboardGroup>
</template>
