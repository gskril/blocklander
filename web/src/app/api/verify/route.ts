import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { recoverAddress } from 'ethers/lib/utils'
import { hashMessage } from '@ethersproject/hash'
import { parseSearchParams, generateMintingSignature, Signature, fetchBeaconChainData } from '@/lib/utils'


const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ''
const TEST_CONTRACT_ADDRESS = process.env.TEST_CONTRACT_ADDRESS || ''

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


    const projectSlug = "blockProposer"
    const network = "homestead"
    const message = JSON.stringify({ network, projectSlug })
    const signerAddress = addressZ.parse(recoverAddress(hashMessage(message), userSignature))
    if (address !== signerAddress) throw new Error('Invalid signer')

    const executionData = await fetchBeaconChainData(address).catch(err => console.error(err));

    const contractAddress = network === 'homestead' ? CONTRACT_ADDRESS : TEST_CONTRACT_ADDRESS

    let signature: Signature | null = null

    if(executionData) {
        signature = await generateMintingSignature(address, projectSlug, contractAddress, network)

    }

    return NextResponse.json({ address, signature }, { status: 200 })
}
