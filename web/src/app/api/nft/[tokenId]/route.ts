import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next/types'
import z from 'zod'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { contractABI } from '@/lib/contractABI'
import { fetchBeaconChainData } from '@/lib/utils'

const client = createPublicClient({ 
  chain: mainnet,
  transport: http()
})

export type Metadata = {
    name: string;
    description: string;
    image: string; // birthblock.art/api/v1/image/[tokenId]
    external_url: string; // birthblock.art/birthblock/[tokenId]
    address: string;
    // birthTime?: string;
    // date?: number;
};

export type OpenSeaMetadata = {
    name: string;
    description: string;
    image: string; // birthblock.art/api/v1/image/[tokenId]
    external_url: string; // birthblock.art/birthblock/[tokenId]
    attributes: [
        // properties
        {
            trait_type: 'address';
            value: string;
        },
        {
            trait_type: 'txn hash';
            value: string;
        },
        // levels
        // Date
    ];
};



// export function metadataToOpenSeaMetadata(metadata: Metadata): OpenSeaMetadata {
//     const openseaMetadata: OpenSeaMetadata = {
//         name: metadata.name,
//         description: metadata.description,
//         image: metadata.image,
//         external_url: metadata.external_url,
//         attributes: [
//             // properties
//             {
//                 trait_type: 'address',
//                 value: metadata.address,
//             },
//         ],
//     };

//     return openseaMetadata;
// }


const schema = z.object({
  tokenId: z.coerce.number(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json(safeParse.error, { status: 400 })
  }

  // call ownerOf on an ethereum smart contract using the tokenId
  const { tokenId } = safeParse.data


const userAddress = await client.readContract({
  address: '0x7ad05c1b87e93BE306A9Eadf80eA60d7648F1B6F', //TODO
  abi: contractABI,
  functionName: 'ownerOf',
  args: [BigInt(tokenId)],
})

console.log(userAddress)

const executionInfo = await fetchBeaconChainData(userAddress)

  
  //     const metadata = await ioredisClient.hget(tokenIdString.toLowerCase(), 'metadata');
  //     const openseaMetadata = metadataToOpenSeaMetadata(JSON.parse(metadata));

  return NextResponse.json({ userAddress, executionInfo })
}
