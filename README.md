## LFGHO - AaveArtVault🚀

## Introduction :fire:
Revolutionizing art finance, our platform pioneers NFT collateralization with GHO tokens on Aave, empowering creators through decentralized lending.

## TechStack Used 🎯
<li>Solidity</li>
<li>ethers.js</li>
<li>Hardhat</li>
<li>Family - ConnectKit</li>
<li>Metamask</li>
<li>openzeppelin</li>
<li>Aave V3</li>
<li>Stable Coins - GHO, DAI</li>
<li>Typescript</li>
<li>Javascript</li>
<li>Chakra UI</li>
<li>Sepolia Testnet</li>
<li>Alchemy</li>
<li>WalletConnect</li>
<li>Wagmi</li>


## Local Setup 🚧

1. Fork the repo.
2. Clone the repo.
   
```
https://github.com/MukulKolpe/LFGHO
```
## Backend Setup 👷

3.
```
cd hardhat
```
4. Create .env file in the root of the hardhat folder
```
touch .env
```
5. generate RPC URL on Alchemy
   Example, ```ALCHEMY_MAINNET_RPC_URL=```

6. Install dependencies
```
yarn
```
7. Run Tests
```
yarn hardhat test
```

## Frontend Setup 👷

8.
```
cd ../frontend/
```
9. Create .env file at the root of the frontend project and configure environment variables of the API keys (NFTPort, Alchemy, WalletConnect), Refer `.env.example`.
```
touch .env
```
10. Install dependencies
 ```
 yarn
 ```
11. Start the website locally using
 ```
 yarn run dev
 ```


## _Deployed Contract Addresses_

#### LoanManager.sol :-

```
0x854913Dc6C0e978E77F6290D217fC816ba404cc6
```

#### NFT.sol :-

```
0x3b47042A391e5ab3722dD8eD5647c072cC05a40f
```
