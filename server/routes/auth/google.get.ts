export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline',
        },
    },
    async onSuccess(event, { user , tokens }) {
        console.log('Google OAuth success:', user)
        await setUserSession(event, {
            user: {
                provider: 'google',
                googleID:user.sub || '',
                id: user.id,
                email: user.email,
                name: user.name || user.user_metadata?.full_name || '',
                avatar: user.picture || user.user_metadata?.avatar_url || '',
                emailVerified: user.email_verified || '',
                metadata: user.user_metadata || ''
            },
            supabaseSession: {
                 accessToken: tokens.access_token || '',
                 expiresIn: tokens.expires_in || '',
                 idToken: tokens.id_token || '',
                 scope: tokens.scope || '',
                 expiresAt: tokens.expires_at || '',
                 tokenType:tokens.token_type || ''
            },
            loggedInAt: Date.now(),
        })


        return sendRedirect(event, `/confirm?success=true&provider=google`)
    },

    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.log('Google OAuth error:', error)
        return sendRedirect(event, '/auth/login?error=google&message=' + encodeURIComponent(error.message))
    },
})