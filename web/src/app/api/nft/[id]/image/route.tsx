import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { contract } from '@/lib/contractABI'
import { fetchBeaconChainData } from '@/lib/utils'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export const runtime = 'edge'

const schema = z.object({
  id: z.coerce.number(),
})

const baseUrl = 'http://localhost:3000'

const font = fetch(
  new URL(
    '../../../../../assets/fonts/PPSupplyMono-Regular.otf',
    import.meta.url
  )
).then((res) => res.arrayBuffer())

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ImageResponse | NextResponse> {
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  const { id } = safeParse.data

  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  })

  try {
    const ownerOfToken = await client.readContract({
      ...contract,
      functionName: 'ownerOf',
      args: [BigInt(id)],
    })

    const name = await client.getEnsName({ address: ownerOfToken })
    const beaconChainData = await fetchBeaconChainData(ownerOfToken)

    if (!beaconChainData) {
      return NextResponse.json(
        { error: 'No data found for this address' },
        { status: 400 }
      )
    }

    const rewards = beaconChainData.map((data) => data.blockReward)
    const rewardsSum = rewards.reduce((acc, curr) => acc + curr, 0)

    const image = await generateImage({
      name:
        name?.toUpperCase() ||
        ownerOfToken.slice(0, 6) + '...' + ownerOfToken.slice(-4),
      latestBlock: beaconChainData[0].blockNumber,
      blocksLanded: beaconChainData.length,
      ethEarned: rewardsSum,
    })

    return image
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.shortMessage || error?.message || 'Unkown' },
      { status: 400 }
    )
  }
}

type ImageProps = {
  name: string
  latestBlock: number
  blocksLanded: number
  ethEarned: number
}

async function generateImage({
  name,
  latestBlock,
  blocksLanded,
  ethEarned,
}: ImageProps): Promise<ImageResponse> {
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
            {name}
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
            {latestBlock}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            padding: '3rem 4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            width: '100%',
            borderRadius: '4rem',
            gap: '9rem',
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
              {blocksLanded}
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
              {(ethEarned / 1e18).toFixed(3)}
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
}
