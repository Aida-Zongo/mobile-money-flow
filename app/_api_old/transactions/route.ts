import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Middleware local pour vérifier le token (utilisable dans les routes API)
const authenticate = (request: NextRequest) => {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]
    if (!token) throw new Error('Non authentifié')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
}

export async function GET(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 100
        })
        return NextResponse.json(transactions, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const body = await request.json()
        const { amount, description, category, operator, type, date } = body

        if (!amount || !category || !type || !date) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: parseFloat(amount),
                description,
                category,
                operator,
                type,
                date: new Date(date)
            }
        })

        return NextResponse.json(transaction, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
