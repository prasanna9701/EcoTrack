# Project Specification: EcoTrack (Carbon AI)

## Overview
EcoTrack is a high-fidelity React application designed to monitor, track, and report carbon emissions (Scope 1, 2, and 3) with a focus on data integrity and audit-ready compliance. It leverages AI, local OCR, and the Algorand blockchain to automate and notarize sustainability data.

## Core Philosophical Principles
- **Audit-Ready Integrity**: The system rejects fabricated data. All inputs must be traceable to a source (e.g., a utility bill).
- **Immutable Attestation**: Emission records are notarized on the Algorand blockchain to prevent tampering.
- **Precision Grounding**: Emission calculations use real-world conversion factors (India-grid default: 0.0008 MT/kWh).
- **Conversational UX**: Data entry is facilitated through the "Eco Assistant" chatbot.

## Technology Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion.
- **Backend/Auth**: Supabase (PostgreSQL, Auth).
- **OCR Engine**: Tesseract.js (Local, offline parsing).
- **Blockchain**: Algorand (Testnet).
- **State Management**: React Context API (`DataContext`, `AlgoWalletProvider`).

## Blockchain Architecture

EcoTrack utilizes 4 interconnected smart contracts on Algorand:

1. **EmissionAttestation**: Notarizes emission records (Utility type, value, timestamp) as on-chain attestations.
2. **CarbonCreditToken (ASA)**: A custom Algorand Standard Asset representing verified carbon offsets.
3. **OffsetMarketplace**: A decentralized platform for users to list, buy, and sell carbon credits.
4. **SustainabilityReportNFT**: Issues unique NFTs representing a company's annual sustainability performance.

## Functional Modules

### 1. Eco Assistant (`src/pages/EcoAssistant.js`)
- **Bill Parsing**: Triggers local Tesseract.js OCR to extract billing data.
- **Verification Loop**: Users confirm extracted data before it is saved to Supabase and notarized on Algorand.
- **On-chain Notarization**: After confirmation, the assistant calls the `EmissionAttestation` contract.

### 2. Carbon Logic Engine (`src/utils/carbonLogicEngine.js`)
- **Scope 1 (Gas)**: SCM to Metric Tons of CO2e.
- **Scope 2 (Electricity)**: kWh to Metric Tons (using `0.0008` MT/kWh for India Grid).
- **Scope 3 (Travel)**: KM-based calculations for road and air travel.

### 3. Wallet Integration (`src/utils/AlgoWalletProvider.js`)
- Powered by `@txnlab/use-wallet-react`.
- Supports **Pera**, **Defly**, and **Lute/Kibisis** wallets.
- Manages the `activeAccount` and `signer` for all on-chain interactions.

### 4. Marketplace & Credits
- Users can view their `CarbonCreditToken` balance.
- Integrated marketplace UI for trading offsets natively on-chain.

## Key Files for Context
- `contracts/smart_contracts/deploy-config.ts`: Deployment logic for all 4 contracts.
- `src/config/contractAddresses.js`: Auto-generated file containing current App IDs.
- `src/utils/algorandContracts.js`: Helper functions for contract calls.
- `AGENTS.md`: Canonical rules for Algorand development in this project.

