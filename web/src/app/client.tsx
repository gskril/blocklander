'use client'

import { SubTitle, Title } from '@/components/atoms'
import { Button } from '@ensdomains/thorin'

export function Client() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-10 xl:gap-14">
      <div className="w-fit bg-gray-200">
        <img src="https://placehold.co/600x600" alt="" />
      </div>

      <div className="flex flex-col gap-4">
        <Title>Commemerative NFT for Block Proposers</Title>
        <SubTitle>
          If you’ve ever proposed a block on the Ethereum consensus layer, mint
          the NFT.
        </SubTitle>

        <div className="w-min">
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </main>
  )
}
