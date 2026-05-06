import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { agent: { select: { name: true, phone: true, email: true } } },
    })
    if (!property) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(property)
  } catch (err) {
    console.error('[PROPERTY GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const property = await prisma.property.findUnique({ where: { id: params.id } })
    if (!property) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    if (property.agentId !== session.sub && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await req.json()
    const updated = await prisma.property.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PROPERTY PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const property = await prisma.property.findUnique({ where: { id: params.id } })
    if (!property) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    if (property.agentId !== session.sub && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.inquiry.deleteMany({ where: { propertyId: params.id } })
    await prisma.property.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PROPERTY DELETE]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
