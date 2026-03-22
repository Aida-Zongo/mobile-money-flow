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
        const month = parseInt(url.searchParams.get('month') || new Date().getMonth().toString())
        const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString())

        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59)

        const expenses = await prisma.transaction.findMany({
            where: {
                userId,
                type: 'expense',
                date: { gte: startDate, lte: endDate }
            },
            orderBy: { date: 'asc' }
        })

        const dailyRecap = expenses.reduce((acc: any, t) => {
            const day = t.date.toISOString().split('T')[0] // YYYY-MM-DD
            acc[day] = (acc[day] || 0) + t.amount
            return acc
        }, {})

        const result = Object.keys(dailyRecap).map(date => ({
            date,
            amount: dailyRecap[date]
        }))

        return NextResponse.json(result, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}
