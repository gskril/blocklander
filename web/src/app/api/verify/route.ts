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

export const EXAMPLE_VALIDATOR_ADDRESS =
  '0xFf8D58f85a4f7199c4b9461F787cD456Ad30e594' // danning.eth

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
  const network: string = 'sepolia'
  const message = JSON.stringify({ network, projectSlug })
  const signerAddress = addressZ.parse(
    recoverAddress(hashMessage(message), userSignature)
  )

  if (network === 'homestead' && signerAddress !== address)
    throw new Error('Invalid signer')
  // if (address !== signerAddress) throw new Error('Invalid signer')

  const addressForExecutionData =
    network === 'homestead' ? address : EXAMPLE_VALIDATOR_ADDRESS

  const beaconData = await fetchBeaconChainData(
    addressForExecutionData as Address
  ).catch((err) => console.error(err))

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
