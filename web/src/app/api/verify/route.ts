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

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ''
const TEST_CONTRACT_ADDRESS = process.env.TEST_CONTRACT_ADDRESS || ''

const EXAMPLE_VALIDATOR_ADDRESS = '0xFf8D58f85a4f7199c4b9461F787cD456Ad30e594' // danning.eth

const addressZ = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const schema = z.object({
  address: addressZ,
  userSignature: z.string(),
})

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.nextUrl.searchParams)
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  // Access the validated data
  const { address, userSignature } = safeParse.data

  const projectSlug = 'blockProposer'
  const network: string = 'sepolia'
  const message = JSON.stringify({ network, projectSlug })
  const signerAddress = addressZ.parse(
    recoverAddress(hashMessage(message), userSignature)
  )

  if(network === 'homestead' && signerAddress !== address) throw new Error('Invalid signer')
//   if (address !== signerAddress) throw new Error('Invalid signer')

    const addressForExecutionData = (network === 'homestead' ? address : EXAMPLE_VALIDATOR_ADDRESS) 


    const beaconData = await fetchBeaconChainData(addressForExecutionData as Address).catch(
        (err) => console.error(err)
  )

  const contractAddress =
    network === 'homestead' ? CONTRACT_ADDRESS : TEST_CONTRACT_ADDRESS

  let signature: Signature | null = null

  console.log(`${CONTRACT_ADDRESS} ${TEST_CONTRACT_ADDRESS}`)
  console.log(`${address} ${beaconData?.validatorIndex} ${projectSlug} ${contractAddress} ${network}`)

  if (beaconData) {
    try {
      signature = await generateMintingSignature(
        address,
        beaconData.validatorIndex,
        projectSlug,
        contractAddress,
        network
      )
    } catch (err) {
      console.error(err)
    }
  }

  return NextResponse.json({ address, validatorIndex: beaconData?.validatorIndex, signature }, { status: 200 })
}
