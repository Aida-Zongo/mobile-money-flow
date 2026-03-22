import { NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, phone, operator } = body

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, mot de passe et nom sont requis' },
                { status: 400 }
            )
        }

        const { user, token } = await UserService.register({
            email,
            password,
            name,
            phone,
            operator
        })

        const response = NextResponse.json(
            { user, token },
            { status: 201 }
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
            { error: error.message || 'Une erreur est survenue lors de l\'inscription' },
            { status: 400 }
        )
    }
}
