import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Prisma } from '@prisma/client'

const createSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive(),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE']),
  listingType: z.enum(['SALE', 'RENT']),
  city: z.string().min(2),
  address: z.string().min(5),
  bedrooms: z.number().int().positive().optional().nullable(),
  bathrooms: z.number().int().positive().optional().nullable(),
  area: z.number().positive(),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '9', 10))

  const where: Prisma.PropertyWhereInput = { status: 'ACTIVE' }

  const q = searchParams.get('q')
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  const listingType = searchParams.get('listingType')
  if (listingType === 'SALE' || listingType === 'RENT') where.listingType = listingType
  const type = searchParams.get('type')
  if (type) where.type = type as Prisma.PropertyWhereInput['type']
  const city = searchParams.get('city')
  if (city) where.city = { contains: city, mode: 'insensitive' }

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: { agent: { select: { name: true } } },
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({ properties, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[PROPERTIES GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || (session.role !== 'AGENT' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const property = await prisma.property.create({
      data: { ...data, agentId: session.sub },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: err.errors }, { status: 400 })
    }
    console.error('[PROPERTIES POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
