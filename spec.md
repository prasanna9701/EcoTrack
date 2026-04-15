# Project Specification: EcoTrack (Carbon AI)

## Overview
EcoTrack is a high-fidelity React application designed to monitor, track, and report carbon emissions (Scope 1, 2, and 3) with a focus on data integrity and audit-ready compliance. It leverages AI and local OCR to automate the ingestion of utility data from physical and digital bills.

## Core Philosophical Principles
- **Audit-Ready Integrity**: The system rejects fabricated or "faked" data. All inputs must be traceable to a source (e.g., a utility bill).
- **Precision Grounding**: Emission calculations are grounded in real-world conversion factors (specifically India-grid factors by default).
- **Conversational UX**: Data entry is facilitated through an "Eco Assistant" chatbot rather than just complex forms.

## Technology Stack
- **Frontend**: React 19, Tailwind CSS (Styling), Framer Motion (Animations), Lucide-React/React-Icons (Iconography).
- **Backend/Auth**: Supabase (PostgreSQL, Auth).
- **OCR Engine**: Tesseract.js (Local, offline OCR parsing).
- **Blockchain**: Algorand (Wallet integration via `@txnlab/use-wallet-react` and custom `AlgoWalletProvider`).
- **State Management**: React Context API (`DataContext`, `WalletProviders`, `SidebarContext`).

## Functional Modules

### 1. Eco Assistant (`src/pages/EcoAssistant.js`)
- An interactive chatbot that acts as a sustainability consultant.
- **Bill Parsing**: Users upload images/PDFs of bills; the assistant triggers local OCR.
- **Confirmation Flow**: Extracted data is presented to the user for validation before being synced to the dashboard.
- **Scenario Modeling**: Handles "What if" queries (e.g., "What if I reduce usage by 20%?").
- **Carbon Credit Recommendations**: Recommends offsets based on calculated footprint.

### 2. Extraction Engine (`src/utils/extractionLogic.js`)
- Uses Tesseract.js to scan documents for keywords (kWh, SCM, Units, etc.).
- Implements strict RegEx patterns for various Indian utility providers (BSES, TPDDL, IGL, TSSPDCL).
- Includes hardcoded fallbacks/mappings for specific sample files to ensure demo stability.

### 3. Carbon Logic Engine (`src/utils/carbonLogicEngine.js`)
- Implements the mathematical formulas for carbon footprinting.
- **Scope 1**: Natural Gas volume to CO2e.
- **Scope 2**: Purchased Electricity (kWh) to CO2e, using `ELECTRICITY_FACTORS` (India Grid default: `0.0008` MT/kWh).
- **Scope 3**: Business travel calculations (Car, Flight Short/Long).
- **Normalization**: All calculations are normalized to Metric Tons (MT).

### 4. Dashboards & Pages
- **Home**: Overview of total emissions and trends.
- **Emission**: Detailed breakdown of carbon footprint sources.
- **Energy**: Focus on electricity and gas usage patterns.
- **Purchase**: Tracking of procurement-related emissions.
- **Data**: A tabular view of all ingested records with manual edit/delete capabilities.
- **Reports**: Generation of audit-ready sustainability narratives.

### 5. Algorand Wallet Integration (`src/utils/AlgoWalletProvider.js`)
- Supports Pera, Defly, and a custom "Kyra" wallet provider.
- Handles connecting, disconnecting, and signing transactions for blockchain-based settlement or verification.

## Data Schema (Conceptual)
- **UtilityItem**: `id`, `type` (Electricity/Gas), `provider`, `billingPeriod`, `value`, `unit`, `billId`, `accountId`, `sourceFileName`, `isEdited`.

## Key Files for Context
- `README.md`: High-level overview and setup.
- `package.json`: Dependency map.
- `src/App.js`: Routing and provider wrappers.
- `src/utils/carbonLogicEngine.js`: Calculation logic.
- `src/utils/extractionLogic.js`: OCR parsing logic.
- `src/pages/EcoAssistant.js`: AI Agent implementation.
- `AGENTS.md`: Rules for Algorand development within this repo.
