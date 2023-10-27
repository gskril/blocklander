import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient } from 'viem'
import z from 'zod'

export const runtime = 'edge'

const schema = z.object({
  id: z.coerce.number(),
})

const baseUrl = 'http://localhost:3000'

const font = fetch(
  new URL('../../../../assets/fonts/PPSupplyMono-Regular.otf', import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  const { id } = safeParse.data

  try {
    const fontData = await font

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            color: '#fff',
            backgroundColor: '#000000',
            border: '0.75rem solid #FF364E',
            borderRadius: '6rem',
            backgroundImage: `url('${baseUrl}/pattern.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            fontFamily: 'PPSupplyMono',
            padding: '4rem',
          }}
        >
          <span
            style={{
              fontSize: '4rem',
            }}
          >
            GREGSKRIL.ETH
          </span>

          <span
            style={{
              fontSize: '2rem',
              opacity: 0.5,
            }}
          >
            LATEST
          </span>

          <span
            style={{
              fontSize: '4rem',
            }}
          >
            18443534
          </span>
        </div>
      ),
      {
        width: 1200,
        height: 1200,
        fonts: [
          {
            name: 'PPSupplyMono',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    console.error(error)
  }
}
