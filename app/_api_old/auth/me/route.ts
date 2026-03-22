import { NextResponse, NextRequest } from 'next/server'
import { UserService } from '@/lib/user-service'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

        if (!decoded.userId) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
        }

        const user = await UserService.getCurrentUser(decoded.userId)

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur introuvable' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Non authentifié' },
            { status: 401 }
        )
    }
}
