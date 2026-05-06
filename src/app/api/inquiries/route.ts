import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const schema = z.object({
  propertyId: z.string().cuid(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Vous devez être connecté' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { propertyId, message } = schema.parse(body)

    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) {
      return NextResponse.json({ error: 'Propriété introuvable' }, { status: 404 })
    }

    const inquiry = await prisma.inquiry.create({
      data: { propertyId, userId: session.sub, message },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('[INQUIRIES POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session || (session.role !== 'AGENT' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const where = session.role === 'ADMIN' ? {} : { property: { agentId: session.sub } }
    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: { select: { id: true, title: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(inquiries)
  } catch (err) {
    console.error('[INQUIRIES GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
