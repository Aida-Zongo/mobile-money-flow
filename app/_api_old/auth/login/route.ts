import { NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            )
        }

        const { user, token } = await UserService.login(email, password)

        const response = NextResponse.json(
            { user, token },
            { status: 200 }
        )

        // Set cookie for middleware
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        })

        return response
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Email ou mot de passe incorrect' },
            { status: 401 }
        )
    }
}
