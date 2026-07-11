export const contractAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "employee",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "latitude",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "longitude",
        "type": "int256"
      }
    ],
    "name": "ClockIn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "employee",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "latitude",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "longitude",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "overtimeMinutes",
        "type": "uint256"
      }
    ],
    "name": "ClockOut",
    "type": "event"
  },
];
