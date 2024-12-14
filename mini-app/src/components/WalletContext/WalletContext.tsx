"use client";

import React, { createContext, useEffect, useState } from "react";
import { EthereumProvider, WalletTgSdk } from "@uxuycom/web3-tg-sdk";

export const WalletContext = createContext<{
  address: string;
  chainId: string;
  isWalletConnected: boolean;
  switchChainId: (chain: string) => Promise<void>;
  sendTransaction?: (to: string, value: number) => Promise<void>;
  getChainId?: () => Promise<string>;
  getAccounts?: () => Promise<string>;
}>({
  address: "",
  chainId: "",
  isWalletConnected: false,
  switchChainId: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ethereum, setEthereum] = useState<EthereumProvider>();

  useEffect(() => {
    async function initializeWallet() {
      if (isWalletConnected) {
        return;
      }
      const { ethereum } = new WalletTgSdk();
      await ethereum.enable();
      setEthereum(ethereum);

      let accounts = await ethereum.request({ method: "eth_accounts" });
      if (!accounts[0]) {
        await ethereum.request({ method: "eth_requestAccounts" });
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });
      accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
      setAddress(accounts[0]);
      setChainId(chainId);

      ethereum.removeAllListeners();
      ethereum.on("accountsChanged", (accounts) => {
        setAddress(accounts[0]);
        console.log("Active account changed:", accounts[0]);
      });
      ethereum.on("chainChanged", (changedChainId) => {
        setChainId(changedChainId);
        console.log("Network changed to:", changedChainId);
      });
      setIsWalletConnected(true);
    }

    initializeWallet();
  }, [isWalletConnected]);

  async function sendTransaction(to: string, value: number) {
    if (!ethereum) {
      return;
    }
    const transactionParameters = {
      to,
      from: address,
      value, // Value in wei
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    const receipt = await ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });

    return receipt;
  }

  async function getChainId(): Promise<string> {
    if (!ethereum) {
      return "";
    }
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Current chain ID:", chainId);
      setChainId(chainId);
      return chainId;
    } catch (error) {
      console.error("Failed to get chain ID:", error);
    }
    return "";
  }

  async function getAccounts(): Promise<string> {
    if (!ethereum) {
      return "";
    }
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Current address:", accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Failed to get address:", error);
    }
    return "";
  }

  async function switchChainId(chainId: string): Promise<void> {
    if (!ethereum) {
      return;
    }
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      await getChainId();
    } catch (switchError) {
      console.error("Failed to switch chain:", switchError);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isWalletConnected,
        switchChainId,
        sendTransaction,
        getChainId,
        getAccounts,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
