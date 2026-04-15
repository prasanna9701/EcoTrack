import algosdk from 'algosdk'
import * as fs from 'fs'
import * as path from 'path'

// Generate a new Algorand account
const account = algosdk.generateAccount()
const mnemonic = algosdk.secretKeyToMnemonic(account.sk)

console.log('=== New Algorand Testnet Account ===')
console.log(`Address: ${account.addr.toString()}`)
console.log(`Mnemonic: ${mnemonic}`)
console.log('')

// Write mnemonic to .env
const envPath = path.resolve(__dirname, '../.env')
const envContent = `# Deployer mnemonic — auto-generated for Testnet
DEPLOYER_MNEMONIC=${mnemonic}
`
fs.writeFileSync(envPath, envContent)
console.log(`✅ Mnemonic written to: ${envPath}`)
console.log('')
console.log('⚠️  NEXT STEP: Fund this account with Testnet ALGO!')
console.log(`    Go to: https://bank.testnet.algorand.network/`)
console.log(`    Paste this address: ${account.addr.toString()}`)
console.log(`    Then run: npx tsx smart_contracts/deploy-config.ts`)
