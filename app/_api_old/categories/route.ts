import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const authenticate = (request: NextRequest) => {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]
    if (!token) throw new Error('Non authentifié')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
}

export async function GET(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(categories, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const body = await request.json()
        const { name, icon, color, backgroundColor } = body

        if (!name || !icon || !color || !backgroundColor) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
        }

        const category = await prisma.category.create({
            data: {
                userId,
                name,
                icon,
                color,
                backgroundColor,
                isDefault: false
            }
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
