import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commemerative NFT for Block Proposers',
  description: 'Validators, come get your NFT!',
}

import { Client } from './client'

export default function Home() {
  return <Client />
}
