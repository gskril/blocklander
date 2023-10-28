import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
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
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            color: '#fff',
            backgroundColor: '#000000',
            border: '0.75rem solid #FF364E',
            borderRadius: '8rem',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            fontFamily: 'PPSupplyMono',
            padding: '2.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            className="bg-pattern"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              color: 'white',
              backgroundColor: '#FF364E',
              opacity: 0.1,
            }}
          />

          <img
            src={`${baseUrl}/pattern.svg`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
            }}
          />

          <div style={{ display: 'flex', padding: '3rem 3rem 0 3rem' }}>
            <span
              style={{
                fontSize: '5rem',
              }}
            >
              GREGSKRIL.ETH
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0 3rem 0 3rem',
            }}
          >
            <span
              style={{
                fontSize: '3.5rem',
                opacity: 0.5,
              }}
            >
              LATEST BLOCK
            </span>

            <span
              style={{
                fontSize: '13rem',
                lineHeight: 1,
              }}
            >
              18443534
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '2.5rem 3.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: '100%',
              borderRadius: '4rem',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  opacity: 0.5,
                  fontSize: '3rem',
                }}
              >
                BLOCKS LANDED
              </span>
              <span
                style={{
                  fontSize: '7.75rem',
                }}
              >
                189
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  opacity: 0.5,
                  fontSize: '3rem',
                }}
              >
                ETH EARNED
              </span>
              <span
                style={{
                  fontSize: '7.75rem',
                }}
              >
                19.441
              </span>
            </div>
          </div>
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
