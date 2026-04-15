import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ExternalLink, Check } from 'lucide-react';
import { getExplorerTxUrl, getExplorerAssetUrl } from '../utils/algorandContracts';

/**
 * BlockchainBadge — Reusable "Attested on Algorand" verification badge.
 *
 * @param {string} txId - Transaction ID
 * @param {string} label - Badge label (default: "Attested on Algorand")
 * @param {string} network - Network name (default: "testnet")
 * @param {string} assetId - Optional ASA ID (for NFT link)
 * @param {'compact'|'full'} variant - Display variant
 */
const BlockchainBadge = ({ 
  txId, 
  label = 'Attested on Algorand', 
  network = 'testnet',
  assetId = null,
  variant = 'compact'
}) => {
  const [copied, setCopied] = useState(false);

  const truncatedTxId = txId 
    ? `${txId.slice(0, 6)}...${txId.slice(-4)}` 
    : '';

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!txId) return;
    try {
      await navigator.clipboard.writeText(txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const explorerUrl = txId ? getExplorerTxUrl(txId) : '#';
  const assetUrl = assetId ? getExplorerAssetUrl(assetId) : null;

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
        }}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        <span>{label}</span>
        {txId && (
          <>
            <span style={{ opacity: 0.7 }}>·</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ opacity: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {truncatedTxId}
            </a>
            <button
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy Transaction ID'}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {copied ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <Copy className="w-3 h-3 text-white" />
              )}
            </button>
          </>
        )}
      </motion.div>
    );
  }

  // Full variant — card-style badge
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
        border: '1px solid #6ee7b7',
        borderRadius: '12px',
        padding: '12px 16px',
        marginTop: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
          }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: '#fff' }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: '13px', color: '#065f46' }}>{label}</span>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            background: '#a7f3d0',
            color: '#065f46',
            borderRadius: '4px',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          {network}
        </span>
      </div>

      {txId && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span style={{ color: '#047857', fontFamily: 'monospace' }}>{truncatedTxId}</span>
          <button
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy Transaction ID'}
            style={{
              background: 'none',
              border: '1px solid #6ee7b7',
              borderRadius: '4px',
              padding: '2px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#047857',
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              fontSize: '11px',
            }}
          >
            <ExternalLink className="w-3 h-3" /> View on Explorer
          </a>
        </div>
      )}

      {assetUrl && (
        <div style={{ marginTop: '6px' }}>
          <a
            href={assetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              fontSize: '11px',
            }}
          >
            <ExternalLink className="w-3 h-3" /> View Asset #{assetId}
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default BlockchainBadge;
