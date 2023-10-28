'use client'

import { Button, Spinner } from '@ensdomains/thorin'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  Address,
  useAccount,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
  useSignMessage,
  useWaitForTransaction,
} from 'wagmi'
import { useFetch } from 'usehooks-ts'

import { contract } from '@/lib/contractABI'
import { Signature } from '@/lib/utils'
import { SubTitle, Title } from '@/components/atoms'

export function Client() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  const signature = useSignMessage({
    message: JSON.stringify({
      network: 'sepolia',
      projectSlug: 'blockProposer',
    }),
  })

  const readyForApiCall = !!signature.data && !!address

  const apiResponse = useFetch<{
    address: Address
    signature: Signature | null
  }>(
    readyForApiCall
      ? `/api/verify?address=${address}&userSignature=${signature.data}`
      : undefined
  )

  const apiResponseIsLoading = !apiResponse.data && !apiResponse.error

  const prepare = usePrepareContractWrite({
    ...contract,
    functionName: 'mintWithSignature',
    args:
      address && apiResponse.data?.signature
        ? [
            address, // minter
            apiResponse.data?.signature?.v, // v
            apiResponse.data?.signature?.r, // r
            apiResponse.data?.signature?.s, // s
          ]
        : undefined,
  })

  const tx = useContractWrite(prepare.config)
  const receipt = useWaitForTransaction(tx.data)

  return (
    <div>
      <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-10 xl:gap-14">
        <div className="max-w-2xl">
          <img src="/nft.png" className="w-full" alt="" />
        </div>

        <div className="flex flex-col gap-4">
          <Title>Commemerative NFT for Block Proposers</Title>
          <SubTitle>
            If you’ve ever proposed a block on the Ethereum consensus layer,
            mint the NFT.
          </SubTitle>

          <div className="flex gap-3 w-min items-center">
            {(() => {
              // If the user hasn't connected, show the connect button
              if (!address) {
                return (
                  <Button onClick={() => openConnectModal?.()}>
                    Connect Wallet
                  </Button>
                )
              }

              if (receipt.isError) {
                return (
                  <Button colorStyle="redPrimary">Transaction Failed</Button>
                )
              }

              // Wait for transaction
              if (receipt.isLoading) {
                return <Button disabled>Transaction Processing</Button>
              }

              // If the API returns a valid signature, show the mint button
              if (apiResponse.data?.signature) {
                return (
                  <Button
                    loading={tx.isLoading}
                    disabled={!tx.write || tx.isLoading}
                    onClick={() => tx.write?.()}
                  >
                    Mint NFT
                  </Button>
                )
              }

              // Once we have the signature, move forward with minting
              if (signature.data) {
                // First ping the API to verify the signature
                if (apiResponseIsLoading) {
                  return <Spinner size="medium" color="bluePrimary" />
                }

                // If the API returns a null signature, they're not eligible to mint
                return <Button disabled>You Are Not Eligible</Button>
              }

              // When the user connects, show sign message button
              if (address) {
                return (
                  <Button
                    onClick={() => signature.signMessage?.()}
                    loading={signature.isLoading}
                    disabled={signature.isLoading}
                  >
                    Sign Message
                  </Button>
                )
              }
            })()}

            {address && (
              <Button colorStyle="blueSecondary" onClick={() => disconnect?.()}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
