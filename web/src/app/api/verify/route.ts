import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'

import { parseSearchParams } from '@/lib/utils'

const schema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
})

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.nextUrl.searchParams)
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  // Access the validated data
  const { address } = safeParse.data

  return NextResponse.json({ address }, { status: 200 })
}
