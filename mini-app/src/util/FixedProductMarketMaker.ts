const FixedPositionMarketMaker = {
  abi: [
    {
      type: "function",
      name: "addFunding",
      inputs: [
        {
          name: "addedFunds",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "distributionHint",
          type: "uint256[]",
          internalType: "uint256[]"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "allowance",
      inputs: [
        {
          name: "owner",
          type: "address",
          internalType: "address"
        },
        {
          name: "spender",
          type: "address",
          internalType: "address"
        }
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "approve",
      inputs: [
        {
          name: "spender",
          type: "address",
          internalType: "address"
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "balanceOf",
      inputs: [
        {
          name: "account",
          type: "address",
          internalType: "address"
        }
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "buy",
      inputs: [
        {
          name: "investmentAmount",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "minOutcomeTokensToBuy",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "calcBuyAmount",
      inputs: [
        {
          name: "investmentAmount",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "calcSellAmount",
      inputs: [
        {
          name: "returnAmount",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "outcomeTokenSellAmount",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "collateralToken",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IERC20"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "collectedFees",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "conditionIds",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "conditionalTokens",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract ConditionalTokens"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "decreaseAllowance",
      inputs: [
        {
          name: "spender",
          type: "address",
          internalType: "address"
        },
        {
          name: "subtractedValue",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "fee",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "feesWithdrawableBy",
      inputs: [
        {
          name: "account",
          type: "address",
          internalType: "address"
        }
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "increaseAllowance",
      inputs: [
        {
          name: "spender",
          type: "address",
          internalType: "address"
        },
        {
          name: "addedValue",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "onERC1155BatchReceived",
      inputs: [
        {
          name: "operator",
          type: "address",
          internalType: "address"
        },
        {
          name: "from",
          type: "address",
          internalType: "address"
        },
        {
          name: "",
          type: "uint256[]",
          internalType: "uint256[]"
        },
        {
          name: "",
          type: "uint256[]",
          internalType: "uint256[]"
        },
        {
          name: "",
          type: "bytes",
          internalType: "bytes"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bytes4",
          internalType: "bytes4"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "onERC1155Received",
      inputs: [
        {
          name: "operator",
          type: "address",
          internalType: "address"
        },
        {
          name: "",
          type: "address",
          internalType: "address"
        },
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "",
          type: "bytes",
          internalType: "bytes"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bytes4",
          internalType: "bytes4"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "removeFunding",
      inputs: [
        {
          name: "sharesToBurn",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "sell",
      inputs: [
        {
          name: "returnAmount",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          internalType: "uint256"
        },
        {
          name: "maxOutcomeTokensToSell",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [
        {
          name: "interfaceId",
          type: "bytes4",
          internalType: "bytes4"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "totalSupply",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "transfer",
      inputs: [
        {
          name: "recipient",
          type: "address",
          internalType: "address"
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "transferFrom",
      inputs: [
        {
          name: "sender",
          type: "address",
          internalType: "address"
        },
        {
          name: "recipient",
          type: "address",
          internalType: "address"
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool"
        }
      ],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "withdrawFees",
      inputs: [
        {
          name: "account",
          type: "address",
          internalType: "address"
        }
      ],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "spender",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "value",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    },
    {
      type: "event",
      name: "FPMMBuy",
      inputs: [
        {
          name: "buyer",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "investmentAmount",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "feeAmount",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          indexed: true,
          internalType: "uint256"
        },
        {
          name: "outcomeTokensBought",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    },
    {
      type: "event",
      name: "FPMMFundingAdded",
      inputs: [
        {
          name: "funder",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "amountsAdded",
          type: "uint256[]",
          indexed: false,
          internalType: "uint256[]"
        },
        {
          name: "sharesMinted",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    },
    {
      type: "event",
      name: "FPMMFundingRemoved",
      inputs: [
        {
          name: "funder",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "amountsRemoved",
          type: "uint256[]",
          indexed: false,
          internalType: "uint256[]"
        },
        {
          name: "collateralRemovedFromFeePool",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "sharesBurnt",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    },
    {
      type: "event",
      name: "FPMMSell",
      inputs: [
        {
          name: "seller",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "returnAmount",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "feeAmount",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "outcomeIndex",
          type: "uint256",
          indexed: true,
          internalType: "uint256"
        },
        {
          name: "outcomeTokensSold",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        {
          name: "from",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "to",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "value",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    }
  ]
} as const;

export default FixedPositionMarketMaker;
