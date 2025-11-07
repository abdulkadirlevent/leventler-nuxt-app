export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      neutral: 'slate',
      secondary: 'purple',
    },
    dashboardPanel: {
      slots: {
        root: 'relative flex flex-col min-w-0 min-h-svh lg:not-last:border-e lg:not-last:border-muted shrink-0',
        body: 'flex flex-col gap-2 sm:gap-4 flex-1 overflow-y-auto p-2 sm:p-4',
      },
    },
    dashboardNavbar: {
      slots: {
        root: 'h-(--ui-header-height) shrink-0 flex items-center justify-between border-b border-muted px-4 sm:px-6 gap-1.5',
        left: 'flex items-center gap-1.5 min-w-0',
        icon: 'shrink-0 size-5 self-center me-1.5',
        title: 'flex items-center gap-1.5 font-semibold text-highlighted truncate',
        center: 'hidden lg:flex',
        right: 'flex items-center shrink-0 gap-1.5',
        toggle: ''
      },
      variants: {
        toggleSide: {
          left: {
            toggle: ''
          },
          right: {
            toggle: ''
          }
        }
      }
    },
    dashboardToolbar: {
      slots: {
        root: 'shrink-0 flex items-center justify-between border-b border-muted px-4 sm:px-6 gap-1.5 overflow-x-auto min-h-[49px]',
        left: 'flex items-center gap-1.5',
        right: 'flex items-center gap-1.5',
      }
    },
  },
})
