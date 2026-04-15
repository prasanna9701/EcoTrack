# EcoTrack Dependencies

This file provides a detailed breakdown of all dependencies used in the EcoTrack project, based on `package.json`.

## Runtime Dependencies

### Blockchain & Wallets
- **algosdk (^3.5.2)**: The official JavaScript SDK for interacting with the Algorand blockchain. Used for transaction building, signing, and node interaction.
- **@algorandfoundation/algokit-utils (^9.2.0)**: A suite of utilities for Algorand development, simplifying contract deployment and client interaction.
- **@txnlab/use-wallet-react (^4.6.0)**: A React hook library for managing Algorand wallet connections (Pera, Defly, etc.).
- **@perawallet/connect (^1.5.2)**: Connector for the Pera Algorand wallet.
- **@blockshake/defly-connect (^1.2.1)**: Connector for the Defly Algorand wallet.
- **lute-connect (^1.7.0)**: Connector for the Lute/Kibisis Algorand wallet.
- **@agoralabs-sh/avm-web-provider (^1.7.0)**: Provider for AVM-compatible web wallets.
- **buffer (^6.0.3)**: Polyfill for Node.js Buffer, required for some blockchain cryptographic operations in the browser.

### AI & OCR
- **tesseract.js (^7.0.0)**: A pure JavaScript OCR engine that runs entirely in the browser. Used for extracting data from utility bills locally, ensuring user data privacy.

### Backend & Data
- **@supabase/supabase-js (^2.101.0)**: JavaScript client for Supabase. Handles authentication, database queries, and real-time subscriptions.

### Testing
- **@testing-library/dom (^10.4.1)**: Utilities for testing DOM elements.
- **@testing-library/jest-dom (^6.9.1)**: Custom Jest matchers for DOM assertions.
- **@testing-library/react (^16.3.2)**: Core library for testing React components.
- **@testing-library/user-event (^13.5.0)**: Simulates real user events in tests.

### UI & Animation
- **framer-motion (^12.38.0)**: Animation library for React transitions and effects.
- **lucide-react (^1.7.0)**: SVG icon library.
- **react-icons (^5.6.0)**: Comprehensive icon library.

### Core React
- **react (^19.2.4)**: Core UI library.
- **react-dom (^19.2.4)**: DOM rendering for React.
- **react-router-dom (^7.13.1)**: Routing and navigation.

### Build & Utils
- **react-scripts (5.0.1)**: Build and development scripts.
- **web-vitals (^2.1.4)**: Performance monitoring.

## Dev Dependencies

### Styling
- **tailwindcss (^3.4.19)**: Utility-first CSS framework.
- **autoprefixer (^10.4.27)** & **postcss (^8.5.8)**: CSS processing and browser compatibility.

## Summary
The stack integrates **Algorand** for immutable data attestation, **Tesseract.js** for private local OCR, and **Supabase** for secure user management, providing a robust, audit-ready carbon tracking platform.