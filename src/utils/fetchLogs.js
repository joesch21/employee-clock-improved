import { JsonRpcProvider, Interface } from "ethers";
import { contractAbi } from "./contractAbi";

// BSC Testnet RPC (public)
const providerUrl = "https://data-seed-prebsc-1-s3.bnbchain.org:8545";
const bscScanApiKey = "HVYMP4JE3IHP4RMF5EYZD2RCSDBZHS4CQD"; // Demo key - replace with your own for production use
const contractAddress = "0x4ACFE507138b73393Bc97C8913d30f79892eF1f2";

// Fetch ALL transaction hashes from BscScan by paginating through results
// This retrieves the entire history of interactions with the contract
async function fetchTransactionHashes() {
  let allHashes = [];
  let page = 1;
  const offset = 10000; // Max recommended per page for BscScan txlist
  let hasMore = true;

  console.log("Fetching full transaction history from BscScan (paginated)...");

  while (hasMore) {
    const url = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=asc&apikey=${bscScanApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1" && data.result && data.result.length > 0) {
        const pageHashes = data.result.map((tx) => tx.hash);
        allHashes = allHashes.concat(pageHashes);
        console.log(`Page ${page}: fetched ${pageHashes.length} txs (total so far: ${allHashes.length})`);

        if (data.result.length < offset) {
          hasMore = false; // Last page
        } else {
          page++;
          // Small delay to respect rate limits (adjust if you have higher tier key)
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        // No more results or error (e.g. deprecated message or empty)
        if (data.message) {
          console.warn("BscScan response:", data.message);
        }
        hasMore = false;
      }
    } catch (error) {
      console.error(`Error on page ${page}:`, error);
      hasMore = false;
      throw error;
    }
  }

  console.log(`Total transactions fetched for contract history: ${allHashes.length}`);
  return allHashes;
}

// Decode event logs from receipt
function decodeLogs(receipt, abi) {
  const iface = new Interface(abi);
  
  return receipt.logs
    .map((log) => {
      try {
        const parsedLog = iface.parseLog(log);
        const timestampMs = Number(parsedLog.args.timestamp) * 1000;

        // Nice display format used in original
        const options = { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        };
        const localTimestamp = new Intl.DateTimeFormat("en-US", options).format(timestampMs);

        return {
          eventName: parsedLog.name,
          employee: parsedLog.args.employee,
          timestamp: localTimestamp,
          rawTimestamp: timestampMs,
          latitude: parsedLog.args.latitude.toString(),
          longitude: parsedLog.args.longitude.toString(),
          overtimeMinutes: parsedLog.name === "ClockOut" 
            ? Number(parsedLog.args.overtimeMinutes) 
            : 0,
        };
      } catch (error) {
        // Not a ClockIn/ClockOut event or decoding failed
        return null;
      }
    })
    .filter((log) => log !== null);
}

// Main exported function - fetches and decodes all events
export async function getTransactionReceiptEvents() {
  try {
    const provider = new JsonRpcProvider(providerUrl);
    const transactionHashes = await fetchTransactionHashes();

    if (transactionHashes.length === 0) {
      console.warn("No transactions found for the contract.");
      return [];
    }

    let allDecodedLogs = [];

    // Process in small batches to be gentle on public RPC
    const batchSize = 8;
    for (let i = 0; i < transactionHashes.length; i += batchSize) {
      const batch = transactionHashes.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (txHash) => {
          try {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (receipt) {
              return decodeLogs(receipt, contractAbi);
            }
            return [];
          } catch (e) {
            console.warn("Failed to get receipt for", txHash, e.message);
            return [];
          }
        })
      );

      allDecodedLogs = allDecodedLogs.concat(batchResults.flat());
    }

    // Deduplicate just in case
    const seen = new Set();
    const uniqueLogs = allDecodedLogs.filter(log => {
      const key = `${log.employee}-${log.rawTimestamp}-${log.eventName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueLogs;
  } catch (error) {
    console.error("Error fetching/decoding logs:", error);
    throw error;
  }
}
