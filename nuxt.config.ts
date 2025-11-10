// https://nuxt.com/docs/api/configuration/nuxt-config
// Nuxt.js yapılandırma dosyası - Supabase modülünü ve genel ayarları içerir
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        'nuxt-auth-utils',
        '@nuxtjs/supabase',
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/icon',
        '@vueuse/nuxt',
        '@pinia/nuxt',
    ],
    // Supabase yapılandırması
    // URL ve Key değerleri .env dosyasından okunur, yoksa burada tanımlanan varsayılan değerler kullanılır
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        redirect: false, // Otomatik yönlendirmeyi kapatıyoruz
        redirectOptions: {
            login: '/auth/login',
            callback: '/confirm',
            // include: ['/protected'],
            exclude: ['/', '/unprotected', '/public/*'],
            saveRedirectToCookie: false,
        }
    },

    runtimeConfig: {
        public: {
            // apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
            // apiBase: 'http://leventlerapp.test'
            apiBase: 'http://localhost:8000/api'
        },
    },

    // Geliştirme sunucusu ayarları
    devServer: {
        port: 3000
    },

    // Geliştirici ayarları
    devtools: {
        // Enable devtools (default: true)
        enabled: true,
        // VS Code Server options
        vscode: {},
        // ...other options
    },

    // CSS ayarları
    css: ['~/assets/css/main.css'],

    // Sourcemap’i kapatın (uyarıyı susturur, ama debug haritanız olmaz):
    vite: {
        server: {
            hmr: {
                // Ağa yayınlanan adresinizi yazın (örn. bilgisayarınızın LAN IP’si)
                host: '192.168.1.50',
                port: 24678,         // veya boşta bir port
                // Eğer kurumsal proxy/HTTPS karmaşığı varsa:
                // clientPort: 443,
                // protocol: 'wss'
            },
        },
        build: {sourcemap: false},
        // dev sırasında da kapatmak için
        css: {devSourcemap: false},
    },

    routeRules: {
        '/api/**': {cors: false},
        // '/docs': { redirect: '/docs/getting-started', prerender: false },
    },

    compatibilityDate: '2024-07-11',

    //Eslint ayarları
    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs'
            }
        }
    },

})