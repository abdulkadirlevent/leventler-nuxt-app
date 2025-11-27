// server/api/auth/session.get.ts
export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if(session){
        console.log('session', session)
    }else{
        console.log('---SESSION YOK---')
    }
    // Tüm session bilgisini döndür
    return session
})