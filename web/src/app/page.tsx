import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commemerative NFT for Block Proposers',
  description: 'Validators, come get your NFT!',
}

import { Client } from './client'

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Client />
    </div>
  )
}
