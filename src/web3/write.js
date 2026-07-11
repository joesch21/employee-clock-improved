import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const CONTRACT_ADDRESS = '0x4654675c8C068aC49047e9E607C34BE2492c945e';

const ABI = [
  { "anonymous": false, "inputs": [
      { "indexed": true, "internalType": "address", "name": "employee", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": false, "internalType": "int256", "name": "latitude", "type": "int256" },
      { "indexed": false, "internalType": "int256", "name": "longitude", "type": "int256" }
    ], "name": "ClockIn", "type": "event" },
  { "anonymous": false, "inputs": [
      { "indexed": true, "internalType": "address", "name": "employee", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": false, "internalType": "int256", "name": "latitude", "type": "int256" },
      { "indexed": false, "internalType": "int256", "name": "longitude", "type": "int256" }
    ], "name": "ClockOut", "type": "event" },
  { "inputs": [
      { "internalType": "int256", "name": "latitude", "type": "int256" },
      { "internalType": "int256", "name": "longitude", "type": "int256" }
    ], "name": "clockIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [
      { "internalType": "int256", "name": "latitude", "type": "int256" },
      { "internalType": "int256", "name": "longitude", "type": "int256" }
    ], "name": "clockOut", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isClockedIn", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "employee", "type": "address" }], "name": "getClockRecords", "outputs": [
      { "components": [
          { "internalType": "uint40", "name": "timestamp", "type": "uint40" },
          { "internalType": "int32", "name": "latitude", "type": "int32" },
          { "internalType": "int32", "name": "longitude", "type": "int32" }
        ], "internalType": "struct EmployeeClock.ClockEvent[]", "name": "records", "type": "tuple[]" }
    ], "stateMutability": "view", "type": "function" },
  // Site geofence config (public constants)
  { "inputs": [], "name": "SITE_LAT", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "SITE_LNG", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "GEOFENCE_RADIUS_METERS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const RPC = 'https://opbnb-testnet-rpc.bnbchain.org';
const CHAIN = { id: 5611, name: 'opBNB Testnet', nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 }, rpcUrls: { default: { http: [RPC] } } };

const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC) });

export function makeLocalAccount(hexPk) {
  const pk = hexPk.startsWith('0x') ? hexPk : `0x${hexPk}`;
  return privateKeyToAccount(pk);
}

function getClients(account) {
  const walletClient = createWalletClient({ chain: CHAIN, transport: http(RPC), account });
  return { publicClient, walletClient };
}

const SCALE = 1_000_000n; // 6 decimal places for lat/lng

export async function clockInOut({ account, isIn, lat, lng }) {
  const { walletClient } = getClients(account);
  const latInt = BigInt(Math.round(lat * Number(SCALE)));
  const lngInt = BigInt(Math.round(lng * Number(SCALE)));
  const fn = isIn ? 'clockIn' : 'clockOut';
  return walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: fn,
    args: [latInt, lngInt]
  });
}

export async function getIsClockedIn(address) {
  return publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: 'isClockedIn', args: [address]
  });
}

export async function getClockRecords(address) {
  return publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: 'getClockRecords', args: [address]
  });
}

export async function getNativeBalance(address) {
  return publicClient.getBalance({ address });
}

// Read the fixed worksite geofence configuration from the contract
export async function getSiteConfig() {
  const [siteLat, siteLng, radiusMeters] = await Promise.all([
    publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'SITE_LAT'
    }),
    publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'SITE_LNG'
    }),
    publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'GEOFENCE_RADIUS_METERS'
    })
  ]);

  return {
    siteLat: Number(siteLat),           // already scaled by 1e6
    siteLng: Number(siteLng),
    radiusMeters: Number(radiusMeters)
  };
}
