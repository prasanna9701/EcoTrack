import algosdk from 'algosdk';

export class AlgoWalletProvider {
    constructor() {
        this.accounts = [];
        this.baseUrl = 'https://kyra.algocraft.fun';
    }

    async connect() {
        console.log('[Kyra] Opening connect popup...');
        return new Promise((resolve, reject) => {
            const popup = window.open(`${this.baseUrl}/rpc?type=connect`, 'Kyra', 'width=450,height=700');

            const handler = (event) => {
                if (event.origin !== this.baseUrl) return;
                if (event.data.type === 'ALGO_WALLET_RESPONSE') {
                    console.log('[Kyra] Connected:', event.data.address);
                    window.removeEventListener('message', handler);
                    this.accounts = [{ name: event.data.name, address: event.data.address }];
                    resolve(this.accounts);
                }
            };

            window.addEventListener('message', handler);

            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', handler);
                    reject(new Error('Window closed by user'));
                }
            }, 1000);
        });
    }

    async disconnect() {
        console.log('[Kyra] Disconnecting...');
        this.accounts = [];
    }

    async resumeSession() {
        console.log('[Kyra] Resuming session...');
        // For simplicity, we'll return nothing, meaning they need to reconnect.
        return undefined;
    }

    async signTransactions(txnGroup, indexesToSign) {
        console.log('[Kyra] Signing transactions:', txnGroup);

        // Ensure we're working with a single group of transactions
        const firstGroup = Array.isArray(txnGroup[0]) ? txnGroup[0] : txnGroup;

        // Properly serialize Transactions to Base64 msgpack for the popup
        const txnsToSign = firstGroup.map(t => {
            const bytes = t instanceof Uint8Array ? t : algosdk.encodeUnsignedTransaction(t);
            // Use window.btoa for browser context since Buffer might not be available
            let binary = '';
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        });

        const data = encodeURIComponent(JSON.stringify(txnsToSign));

        return new Promise((resolve) => {
            window.open(`${this.baseUrl}/rpc?type=sign&txns=${data}`, 'Kyra', 'width=450,height=700');

            const handler = (event) => {
                if (event.origin !== this.baseUrl) return;
                if (event.data.type === 'ALGO_WALLET_RESPONSE') {
                    console.log('[Kyra] Signing complete');
                    window.removeEventListener('message', handler);

                    const signedTxns = event.data.signedTxns.map((s) => {
                        if (!s) return null;
                        
                        // Check if this is a TxID instead of a binary blob
                        if (s.length === 52 && !s.includes('=') && !s.includes('+') && !s.includes('/')) {
                            console.log('[Kyra] Transaction already submitted by backend. TxID:', s);
                            return null;
                        }

                        try {
                            const binaryString = window.atob(s);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            return bytes;
                        } catch (e) {
                            console.warn('[Kyra] Failed to decode transaction, might be a TxID:', s);
                            return null;
                        }
                    });
                    resolve(signedTxns);
                }
            };

            window.addEventListener('message', handler);
        });
    }
}
