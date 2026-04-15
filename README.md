# EcoTrack (Carbon AI)

A state-of-the-art sustainability platform that combines **Local OCR**, **AI-driven Carbon Tracking**, and **Algorand Blockchain** for immutable emission notarization and carbon credit trading.

## 🚀 Key Features

- **Local-First Privacy OCR**: Extract billing data (Electricity/Gas) entirely in the browser using Tesseract.js. No cloud processing for your sensitive data.
- **Blockchain-Verified Emissions**: Notarize your carbon footprint on the Algorand blockchain to create an immutable, audit-ready sustainability record.
- **Carbon Credit Ecosystem**: Mint, trade, and retire carbon offset tokens (ASA) via a decentralized marketplace.
- **Eco Assistant**: A conversational AI agent that guides you through data ingestion, scenario modeling, and reduction strategies.
- **Precision Calculations**: Grounded in real-world emission factors (e.g., India-grid standards) with high-precision float calculations.
- **Connect Wallet**: Integrated support for Pera, Defly, and Lute/Kibisis wallets.

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion.
- **Blockchain**: Algorand (TEAL/TypeScript contracts).
- **Backend/Auth**: Supabase.
- **OCR Engine**: Tesseract.js.

## 📦 Prerequisites

- **Node.js** (v18+ recommended)
- **AlgoKit CLI** (for contract deployment)
- **Docker** (to run localnet, if not using Testnet)

## 🏗️ Getting Started

### 1. Repository Setup

```bash
git clone https://github.com/prasanna9701/EcoTrack.git
cd EcoTrack
npm install
```

### 2. Environment Configuration

You will need two `.env` files:

#### Root Directory (`.env.local`)
Create a `.env.local` file at the root:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

#### Contracts Directory (`contracts/.env`)
Create a `.env` file in the `contracts` folder:
```env
DEPLOYER_MNEMONIC="your twenty four word mnemonic for algorand testnet"
```

### 3. Smart Contract Deployment (Optional)

If you wish to deploy your own instances of the contracts:

```bash
cd contracts
npm install
# To deploy to Testnet
npx tsx smart_contracts/deploy-config.ts
```

This script will automatically update `src/config/contractAddresses.js` with the new App IDs.

### 4. Running the Frontend

```bash
# Return to root
cd ..
npm start
```

## ⛓️ Blockchain Integration

EcoTrack uses 4 core smart contracts on Algorand:
1. **EmissionAttestation**: Securely notarizes billing data on-chain.
2. **CarbonCreditToken**: An ASA representing 1 MT of CO2e offset.
3. **OffsetMarketplace**: Peer-to-peer trading platform for offsets.
4. **SustainabilityReportNFT**: Identity and performance-based NFTs for corporations.

## 📂 Project Structure

```
EcoTrack/
├── contracts/               # Algorand Smart Contracts
│   ├── smart_contracts/     # Contract source and deployment scripts
│   └── artifacts/           # Generated App Specs and Clients
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── config/              # Contract addresses and constants
│   ├── hooks/               # Custom React hooks (Wallet, Data)
│   ├── pages/               # Main application pages (EcoAssistant, Dashboard)
│   └── utils/               # Logic engines (Carbon, OCR, Blockchain)
└── spec.md                  # Detailed Project Specification
```

## 📜 Dependencies

For a full list of libraries and их purposes, see [DEPENDENCIES.md](DEPENDENCIES.md).

## 👥 Contributors
- **Prasanna**: lavangamprasanna@gmail.com
- **Akhil**: akhilreddymogilla@gmail.com

---
*EcoTrack is an open-source project dedicated to making sustainability transparent and verifiable through blockchain technology.*
