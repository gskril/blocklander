'use client'

import { SubTitle, Title } from '@/components/atoms'
import { Button, Helper, Spinner } from '@ensdomains/thorin'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Address, useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useFetch } from 'usehooks-ts'

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

  const apiResponse = useFetch<{ address: Address; signature: Address | null }>(
    readyForApiCall
      ? `/api/verify?address=${address}&userSignature=${signature.data}`
      : undefined
  )

  const apiResponseIsLoading = !apiResponse.data && !apiResponse.error

  return (
    <div>
      <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-10 xl:gap-14">
        <div className="w-fit bg-gray-200">
          <img src="https://placehold.co/600x600" alt="" />
        </div>

        <div className="flex flex-col gap-4">
          <Title>Commemerative NFT for Block Proposers</Title>
          <SubTitle>
            If you’ve ever proposed a block on the Ethereum consensus layer,
            mint the NFT.
          </SubTitle>

          <div className="flex gap-4 w-min">
            {(() => {
              // When the user connects, show sign message button
              if (address) {
                return (
                  <Button onClick={() => signature.signMessage?.()}>
                    Sign Message
                  </Button>
                )
              }

              // Once we have the signature, move forward with minting
              if (signature.data) {
                // First ping the API to verify the signature
                if (apiResponseIsLoading) {
                  return <Spinner />
                }

                // If the API returns a valid signature, show the mint button
                if (apiResponse.data?.signature) {
                  return <Button>Mint NFT</Button>
                }

                // If the API returns an invalid signature, show an error
                return <Helper type="error">Invalid Signature</Helper>
              }

              // If the user hasn't connected, show the connect button
              return (
                <Button onClick={() => openConnectModal?.()}>
                  Connect Wallet
                </Button>
              )
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
