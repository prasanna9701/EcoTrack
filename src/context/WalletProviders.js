import React from 'react';
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react';
import { AlgoWalletProvider } from '../utils/AlgoWalletProvider';
import '@txnlab/use-wallet-ui-react/dist/style.css';

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    {
      id: WalletId.CUSTOM,
      options: {
        provider: new AlgoWalletProvider()
      },
      metadata: {
        name: 'Kyra Wallet',
        icon: 'https://kyra.algocraft.fun/logo.png' // Using external logo for now
      }
    }
  ],
  defaultNetwork: NetworkId.TESTNET,
});

export function WalletProviders({ children }) {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        {children}
      </WalletUIProvider>
    </WalletProvider>
  );
}
