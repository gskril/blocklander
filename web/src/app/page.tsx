import { Metadata } from 'next'

import { Client } from './client'

export const metadata: Metadata = {
  title: 'BlockLander',
  description: 'A commemorative NFT for Ethereum block proposers',
}

export default function Home() {
  return <Client />
}
