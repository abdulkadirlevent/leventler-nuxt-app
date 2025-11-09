export default defineAppConfig({
    ui: {
        // colors
        colors: {
            primary: 'cyan',
            neutral: 'slate',
            secondary: 'purple',
        },
        // badge
        badge: {
            slots: {
                base: 'inline-flex items-center px-2 py-0.5 rounded-md',
            },
            // Varyantlar
            variants: {
                rounded: {
                    none: {base: 'rounded-none'},
                    sm: {base: 'rounded-sm'},
                    md: {base: 'rounded-md'},
                    lg: {base: 'rounded-lg'},
                    full: {base: 'rounded-full'}
                }
            },
            // Varsayılan varyantlar
            defaultVariants: {
                color: 'primary',
                variant: 'subtle',
                size: 'base',
                rounded: 'full'
            }
        },
        // checkbox
        checkbox: {
            slots: {
                root: 'inline-flex items-center select-none',
                base: 'dark:bg-[#0e1726ff]',
            },
            // Varyantlar (renk, boyut, yuvarlaklık)
            variants: {
                rounded: {
                    none: {base: 'rounded-none'},
                    sm: {base: 'rounded-sm'},
                    md: {base: 'rounded-md'},
                    lg: {base: 'rounded-lg'},
                    full: {base: 'rounded-full'}
                }
            },
            // Varsayılan varyantlar
            defaultVariants: {
                color: 'primary',
                size: 'md',
                rounded: 'full'
            }
        },
        // dashboardPanel
        dashboardPanel: {
            slots: {
                root: 'relative flex flex-col min-w-0 min-h-svh lg:not-last:border-e lg:not-last:border-muted shrink-0',
                body: 'flex flex-col gap-2 sm:gap-4 flex-1 overflow-y-auto p-2 sm:p-4',
            },
        },
        // dashboardNavbar
        dashboardNavbar: {
            slots: {
                root: 'h-(--ui-header-height) shrink-0 flex items-center justify-between border-b border-muted px-4 sm:px-6 gap-1.5',
                left: 'flex items-center gap-1.5 min-w-0',
                icon: 'shrink-0 size-5 self-center me-1.5',
                title: 'flex items-center gap-1.5 font-semibold text-highlighted truncate',
                center: 'hidden lg:flex',
                right: 'flex items-center shrink-0 gap-1.5',
                toggle: 'i-lucide-menu'
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
        // dashboardToolbar
        dashboardToolbar: {
            slots: {
                root: 'shrink-0 flex items-center justify-between border-b border-muted px-4 sm:px-6 gap-1.5 overflow-x-auto min-h-[49px]',
                left: 'flex items-center gap-1.5',
                right: 'flex items-center gap-1.5',
            }
        },
        // table[&>tr]:last:[&>td]:border-b-0
        table: {
            slots: {
                root: 'overflow-auto shrink-0 border border-muted rounded-lg',
                base: 'min-w-full table-fixed border-spacing-0 rounded-md border border-muted',
                thead: '[&>tr]:bg-muted [&>tr]:after:content-none',
                tbody: '[&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary',
                tr: 'data-[selected=true]:bg-elevated/50',
                th: 'px-4 py-3.5 min-w-20 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0 border border-muted',
                td: 'p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0 border border-muted',
            },
        }
    },
})
