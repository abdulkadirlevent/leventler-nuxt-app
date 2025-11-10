// SERVER: Korumalı API Endpoint Örneği
// server/api/user/profile.get.ts
export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    // Kullanıcı oturum açmamışsa otomatik 401 hatası döner
    return {
        user: session.user,
        message: 'Korumalı veri'
    }
})