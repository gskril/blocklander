import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'

type ResponseType = {
  name: string
  image: string
  description: string
  background_color: '000000'
  attributes?: {
    display_type: 'string' | 'number'
    trait_type: string
    value: string | number
  }[]
}

const schema = z.object({
  id: z.coerce.number(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ResponseType | Error | { error: string }>> {
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  const { id } = safeParse.data

  const VERCEL_URL = process.env.VERCEL_URL
  const baseUrl = VERCEL_URL ? `https://${VERCEL_URL}` : 'http://localhost:3000'

  const metadata: ResponseType = {
    name: `BlockLander #${id}`,
    image: `${baseUrl}/api/nft/${id}/image`,
    description: 'A commemorative NFT for Ethereum block proposers',
    background_color: '000000',
  }

  return NextResponse.json(metadata)
}
