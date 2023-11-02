# BlockLander

A commemorative NFT for Ethereum block proposers.

## Getting Started

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

We connect an ETH address to a validator via it's withdrawal credentials using the [beaconcha.in API](https://beaconcha.in/api/v1/docs/index.html). If the validator has successfully proposed a block, our backend signs a message which is then verified in the contract while minting the NFT.
