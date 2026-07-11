# EasyClock — Employee Clock In/Out

A simple, secure, and modern employee-facing clock in/out application built with React. Employees create a local wallet (private key stored only in their browser) and clock in/out directly on the **opBNB Testnet** with geofence validation.

## Features

- 🔐 **Local Wallet Creation** — Private key is generated and stored only in the browser (`localStorage`). No seed phrases or external wallets required.
- 🟢 **Big Clock In / Clock Out Buttons** — Simple, touch-friendly interface designed for daily use.
- 📍 **Geofence Enforcement** — Clocking is only allowed within 500 meters of the configured worksite (enforced on-chain).
- 📱 **QR Code Sharing** — Employees can easily share their wallet address with managers via QR code for funding (gas fees).
- 💾 **Persistent Wallet** — The wallet stays saved across browser sessions and refreshes.
- 📊 **On-Chain Records** — All clock events are permanently recorded on the blockchain.
- ⚡ **Live Status** — Shows current clocked-in/out state and recent activity pulled from the contract.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Web3**: viem (for contract interaction)
- **Blockchain**: opBNB Testnet (Chain ID `5611`)
- **Smart Contract**: `0x4654675c8C068aC49047e9E607C34BE2492c945e`

## Quick Start

```bash
# Clone the repository
git clone https://github.com/joesch21/employee-clock-improved.git
cd employee-clock-improved

# Install dependencies
npm install

# Start development server
npm run dev
Open http://localhost:5173 in your browser.
How It Works

Employee opens the app and clicks "Create My Work Wallet".
A private key is generated and stored locally in the browser.
The employee shares their wallet address (via QR or copy) with their manager.
Manager sends a small amount of tBNB to the wallet for gas fees.
Employee can now Clock In and Clock Out — location is verified on-chain against the geofence.

Geofence

Site Location: -33.932101, 151.165226
Allowed Radius: 500 meters
Geofence logic is enforced directly in the smart contract.

Project Structure
textemployee-clock-improved/
├── src/
│   ├── components/
│   │   └── CheckInCard.jsx       # Main clocking interface
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── web3/
│   │   └── write.js              # Contract interaction (viem)
│   └── lib/
│       ├── auth.jsx
│       └── toast.jsx
├── docs/                         # Project documentation
├── public/
└── package.json
Documentation
Additional documentation is available in the /docs folder:

architecture.md — High-level system design
operator_workflow.md — Development process and patch workflow
repo_state.json — Structured snapshot of the project
Schema_drift.MD — Guidelines for maintaining consistency across sessions

Future Improvements

Distance-to-site indicator before clocking
Optional shift cooldown enforcement
Better login / "existing wallet" flow
PWA improvements + offline support
Manager dashboard for funding/approving wallets

Notes

This is an employee-facing application. Clocking happens directly from the browser using a locally stored private key.
The smart contract enforces geofencing. Clocking outside the allowed area will be rejected on-chain.
All wallet data is stored client-side only. Nothing is sent to any backend.