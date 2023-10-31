import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlockLander',
  description: 'A commemorative NFT for Ethereum block proposers',
}

import { Client } from './client'

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Client />
    </div>
  )
}
