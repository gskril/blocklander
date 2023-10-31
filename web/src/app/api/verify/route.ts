import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { recoverAddress } from 'ethers/lib/utils'
import { hashMessage } from '@ethersproject/hash'
import {
  parseSearchParams,
  generateMintingSignature,
  Signature,
  fetchBeaconChainData,
} from '@/lib/utils'
import { Address } from 'viem'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

const addressZ = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const schema = z.object({
  address: addressZ,
  userSignature: z.string(),
})

export async function GET(request: NextRequest) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Missing contract address')
  }

  const params = parseSearchParams(request.nextUrl.searchParams)
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  // Access the validated data
  const { address, userSignature } = safeParse.data

  const projectSlug = 'blockLander'
  const network: string = 'base'
  const message = JSON.stringify({ network, projectSlug })
  const signerAddress = addressZ.parse(
    recoverAddress(hashMessage(message), userSignature)
  )

  if (address !== signerAddress) throw new Error('Invalid signer')

  const beaconData = await fetchBeaconChainData(address as Address).catch(
    (err) => console.error(err)
  )

  let signature: Signature | null = null

  if (beaconData) {
    try {
      signature = await generateMintingSignature(
        address,
        beaconData.validatorIndex,
        projectSlug,
        CONTRACT_ADDRESS,
        network
      )
    } catch (err) {
      console.error(err)
    }
  }

  return NextResponse.json(
    { address, validatorIndex: beaconData?.validatorIndex, signature },
    { status: 200 }
  )
}
