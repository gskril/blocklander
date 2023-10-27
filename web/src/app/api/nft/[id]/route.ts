import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest } from 'next/types'
import z from 'zod'

const schema = z.object({
  id: z.coerce.number(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  const { id } = safeParse.data

  return NextResponse.json({ id })
}
