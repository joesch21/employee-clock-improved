# ClockIn Manager — Employee Attendance Dashboard

Improved modern React UI for managers to view blockchain-recorded employee clock-in/out events, worked hours, and overtime.

**Features**
- 📊 **Overview Dashboard**: Quick stats, recent activity, total overtime.
- 👥 **Employee Mappings**: Add/edit/delete wallet → name mappings. Bulk CSV import/export. Searchable table.
- 📋 **Attendance Logs**: 
  - Filter by date, event type (In/Out), employee name/wallet.
  - Sortable event log table with one-click Google Maps links for locations.
  - **Daily Summary** table: Auto-pairs ClockIn/ClockOut per employee to show worked minutes + overtime.
- 🔄 Real-time fetch from BSC Testnet smart contract events.
- 🕵️ De-identification toggle (hides real names).
- 💾 Export any filtered view to CSV.
- Demo data included so you can explore the UI immediately.

## Quick Start (Local Development)

```bash
# 1. Unzip the downloaded folder
cd clockin-clockout-manager-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open http://localhost:3000 (or the port shown).

The app will attempt to load real logs from the deployed contract on BSC Testnet. If it fails (rate limits, no events yet, or API key issues), it automatically falls back to **demo data** so you can still test all UI features.

## Blockchain Configuration

- **Network**: BSC Testnet
- **Contract**: `0x4ACFE507138b73393Bc97C8913d30f79892eF1f2`
- **BscScan API Key**: Currently uses a demo key (may have rate limits). 

To use your own key (recommended for heavy use):
1. Get a free key at https://bscscan.com/apis
2. Edit `src/utils/fetchLogs.js` and replace the `bscScanApiKey` value.

## How It Works

1. Employees use a separate dApp/wallet to call `ClockIn(lat, long)` or `ClockOut(lat, long, overtimeMinutes)` on the smart contract.
2. This manager app reads those events via BscScan + direct RPC.
3. You maintain a local mapping of wallet addresses → employee names (persisted in browser localStorage).
4. The Daily Summary automatically calculates worked time by pairing In/Out events for the selected day.

## Future Enhancements (Roadmap)

- Roster / scheduled hours cross-reference
- Multi-day reports & charts (Recharts)
- Export PDF payslip summaries
- Employee self-service portal
- Dark mode + mobile-first PWA

## Tech Stack

- Vite + React 18 + React Router
- Tailwind CSS
- Ethers v6 (browser)
- PapaParse + FileSaver for CSV
- Lucide icons
- date-fns for date handling

## Notes

- All mappings are stored **only in your browser** (localStorage). They are not on-chain.
- Location values (lat/long) are stored as int256 on-chain (possibly scaled). The "View Map" button passes them directly to Google Maps — adjust if your contract uses a different scaling factor.
- This is a read-only manager tool. Clocking in/out happens via the employee-facing contract interaction.

Built as an improved clone of the original manager-timeclock interface with better UX, summaries, and modern design.

---

Enjoy tracking your team's hours! ⏱️
