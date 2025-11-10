export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
        authorizationParams: {
            access_type: 'offline',
        },
    },
    async onSuccess(event, { user, tokens }) {
       console.log('GitHub OAuth success:', user)
        await setUserSession(event, {
            user: {
                provider: 'gitHub',
                googleID:user.id || '',
                id: user.id,
                email: user.email,
                name: user.name  || '',
                avatar: user.avatar_url  || '',
                emailVerified: user.email_verified || '',
                metadata: user?.bio || ''
            },
            supabaseSession: {
                accessToken: tokens?.access_token || '',
                tokenType: tokens?.token_type || '',
                scope: tokens?.scope || '',
                tokens: tokens || ''
            },
            loggedInAt: Date.now()
        })

        return sendRedirect(event, `/confirm?success=true&provider=github`)
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/auth/login?error=github')
    },
})