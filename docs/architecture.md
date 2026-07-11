# EasyClock Architecture

## Overview

EasyClock is a lightweight, employee-focused clock in/out application that uses a local wallet (private key stored only on the user's device) and interacts with a geofenced smart contract on opBNB Testnet.

The goal is simplicity and security: employees should not need to manage seed phrases or connect external wallets like MetaMask for daily use.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (PWA)                         │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │   React + Tailwind    │       │   Local Wallet        │  │
│  │   (CheckInCard.jsx)   │◄──────│   (localStorage + viem)│ │
│  └───────────────────────┘       └───────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              viem (write.js)                          │  │
│  │  • clockIn / clockOut                                 │  │
│  │  • getSiteConfig()                                    │  │
│  │  • Balance & status reads                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Smart Contract (opBNB Testnet)                │  │
│  │  Address: 0x4654675c8C068aC49047e9E607C34BE2492c945e │  │
│  │  • Fixed geofence (500m)                              │  │
│  │  • On-chain clock events                              │  │
│  │  • No overtime / cooldown logic                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. CheckInCard.jsx (Core UI)
- Wallet creation & persistence
- Geolocation + clock in/out buttons
- Site config loading from contract
- Improved geofence error messages
- QR code generation for manager funding

### 2. write.js (Web3 Layer)
- All contract interaction using viem
- ABI definition
- `getSiteConfig()` helper
- Balance and record fetching

### 3. Local Wallet System
- Private key generated client-side using `crypto.getRandomValues`
- Stored in `localStorage` under key `ec_pk`
- Never shown to the user
- Used to sign transactions directly via viem

### 4. Smart Contract
- Fixed single-site geofence
- `clockIn(lat, lng)` and `clockOut(lat, lng)`
- Events for on-chain audit trail
- `isClockedIn` state per address

## Data Flow (Clock In Example)

1. User taps **CLOCK IN**
2. App requests high-accuracy GPS
3. App scales lat/lng by 1,000,000 and calls `clockInOut()`
4. viem sends transaction using local private key
5. Contract validates geofence → records event → sets `isClockedIn = true`
6. Frontend refreshes status from contract

## Design Decisions

| Decision                        | Reason |
|----------------------------------|--------|
| Local wallet instead of MetaMask | Simpler UX for non-crypto users |
| Geofence enforced on-chain       | Prevents tampering |
| No overtime tracking on-chain    | Kept simple; calculated off-chain |
| Patch-based updates              | Avoids version fragmentation |
| Documentation in `/docs`         | Helps LLMs maintain context across threads |

## Current Limitations

- No shift cooldown enforcement in frontend
- No manager dashboard yet
- Balance updates can be slow due to testnet RPC
- Some deprecated dependencies from base template

## Future Architecture Considerations

- Add optional cooldown logic in the app layer
- Create manager dashboard for funding/approving wallets
- Consider account abstraction (ERC-4337) for gasless clocking
- Add real PWA icons and better offline support
