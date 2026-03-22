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

        // Find budgets for specific month/year if provided, else all
        const whereClause: any = { userId }
        if (month && year) {
            whereClause.month = parseInt(month)
            whereClause.year = parseInt(year)
        }

        const budgets = await prisma.budget.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(budgets, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = authenticate(request)
        const body = await request.json()
        const { category, limitAmount, month, year } = body

        if (!category || limitAmount === undefined || !month || !year) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
        }

        // Upsert budget to avoid duplicate for same month/year
        const budget = await prisma.budget.upsert({
            where: {
                userId_category_month_year: {
                    userId,
                    category,
                    month: parseInt(month),
                    year: parseInt(year)
                }
            },
            update: {
                limitAmount: parseFloat(limitAmount)
            },
            create: {
                userId,
                category,
                limitAmount: parseFloat(limitAmount),
                month: parseInt(month),
                year: parseInt(year)
            }
        })

        return NextResponse.json(budget, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
