import React from 'react';
import { WalletButton } from '@txnlab/use-wallet-ui-react';

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="wui-custom-trigger">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
