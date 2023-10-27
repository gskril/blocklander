import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { recoverAddress } from 'ethers/lib/utils'
import { hashMessage } from '@ethersproject/hash'
import { parseSearchParams, generateMintingSignature, Signature } from '@/lib/utils'


const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ''
const TEST_CONTRACT_ADDRESS = process.env.TEST_CONTRACT_ADDRESS || ''
const BEACONCHAIN_API_KEY = process.env.BEACONCHAIN_API_KEY || ''

const addressZ = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const schema = z.object({
  address: addressZ,
  userSignature: z.string(),
})

type ValidatorResponse = {
    status: string;
    data: Array<{
      publickey: string;
      validatorindex: number;
    }>;
  };
  
  type ExecutionResponse = {
    status: string;
    data: any; // Replace 'any' with the actual shape of the response
  };
  
  async function fetchBeaconChainData(userAddress: string): Promise<any> {
    try {
      const validatorUrl = `https://beaconcha.in/api/v1/validator/withdrawalCredentials/${userAddress}?limit=10&offset=0&apikey=${BEACONCHAIN_API_KEY}`
      const validatorRes = await fetch(validatorUrl, {
        headers: {
          'Accept': 'application/json',
        },
      })
  
      const validatorData: ValidatorResponse = await validatorRes.json();
  
      if (validatorData.status === 'OK' && validatorData.data.length > 0) {
        const validatorIndex = validatorData.data[0].validatorindex;
  
        const executionUrl = `https://beaconcha.in/api/v1/execution/${validatorIndex}/produced?offset=0&limit=10&sort=desc&APIKEY=${BEACONCHAIN_API_KEY}`;

        const executionRes = await fetch(executionUrl, {
          headers: {
            'Accept': 'application/json',
          },
        });
  
        const executionData: ExecutionResponse = await executionRes.json();
  
        if (executionData.status === 'OK') {
          const executionInfo = executionData.data;
          // Do something with executionInfo
          console.log(executionInfo);
          return executionInfo;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  
  

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
