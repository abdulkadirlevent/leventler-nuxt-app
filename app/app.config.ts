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
                root: 'inline-flex items-center gap-2 select-none',
                base: [
                    'rounded-full ring ring-inset ring-accented overflow-hidden ',
                    'relative flex items-center justify-center',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary/40',
                    'data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed',
                    // checked durumunda
                    'data-[checked=true]:bg-primary data-[checked=true]:border-primary',
                ].join(' '),
                input: 'peer',
                icon: 'i-lucide-check dark:text-[#202225ff] text-white ',
                label: 'text-sm text-foreground',
                description: 'text-xs text-muted-foreground',
                hint: 'text-xs text-muted-foreground',
            },
            // Varyantlar (renk, boyut, yuvarlaklık)
            variants: {
                color: {
                    primary: {
                        base: 'data-[checked=true]:bg-primary data-[checked=true]:border-primary',
                        icon: 'text-white'
                    },
                    neutral: {
                        base: 'data-[checked=true]:bg-neutral-600 data-[checked=true]:border-neutral-600',
                        icon: 'text-white'
                    },
                    success: {
                        base: 'data-[checked=true]:bg-emerald-600 data-[checked=true]:border-emerald-600',
                    },
                    danger: {
                        base: 'data-[checked=true]:bg-rose-600 data-[checked=true]:border-rose-600',
                    }
                },
                size: {
                    xs: {base: 'size-4', input: 'size-3', icon: 'size-2'},   // 16px, 12px, 8px
                    sm: {base: 'size-5', input: 'size-4', icon: 'size-3'},   // 20px, 16px, 12px
                    md: {base: 'size-6', input: 'size-5', icon: 'size-4'},   // 24px, 20px, 16px
                    lg: {base: 'size-7', input: 'size-6', icon: 'size-5'},   // 28px, 24px, 20px
                    xl: {base: 'size-8', input: 'size-7', icon: 'size-6'},   // 32px, 28px, 24px
                },
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
    },
})
