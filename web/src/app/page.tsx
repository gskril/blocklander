import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlockLander',
  description: 'A commemorative NFT for Ethereum block proposers',
}

import { Client } from './client'

export default function Home() {
  return <Client />
}
