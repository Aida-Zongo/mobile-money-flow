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
        const url = new URL(request.url)
        const month = url.searchParams.get('month')
        const year = url.searchParams.get('year')

        const whereClause: any = { userId }
        if (month && year) {
            whereClause.month = parseInt(month)
            whereClause.year = parseInt(year)
        }

        const incomes = await prisma.income.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(incomes, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const body = await request.json()
        const { amount, source, note, month, year } = body

        if (!amount || !source || !month || !year) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
        }

        const income = await prisma.income.create({
            data: {
                userId,
                amount: parseFloat(amount),
                source,
                note,
                month: parseInt(month),
                year: parseInt(year)
            }
        })

        return NextResponse.json(income, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
