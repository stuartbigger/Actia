"use client";

import React, { createContext, useEffect, useState } from "react";
import { EthereumProvider } from "@uxuycom/web3-tg-sdk";

export const WalletContext = createContext<{
  address: string;
  chainId: string;
  isWalletConnected: boolean;
  switchChainId: (chain: string) => Promise<void>;
  sendTransaction: (to: string, data: string) => Promise<void>;
  getChainId?: () => Promise<string>;
  getAccounts?: () => Promise<string>;
  initializeWallet: () => Promise<void>;
}>({
  address: "",
  chainId: "",
  isWalletConnected: false,
  switchChainId: async () => {},
  sendTransaction: async () => {},
  initializeWallet: async () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ethereum, setEthereum] = useState<EthereumProvider>();

  const initializeWallet = async () => {
    if (isWalletConnected) {
      return;
    }
    const WalletTgSdk = require("@uxuycom/web3-tg-sdk").WalletTgSdk;
    const { ethereum } = new WalletTgSdk();

    if (!ethereum.isConnected()) {
      console.log("Enablin EVM");
      try {
        const enabled = await ethereum.enable();
        console.log("Is Enabled: ", enabled);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("EVM already enabled");
    }

    setEthereum(ethereum);

    console.log("CONNECTED: " + ethereum.connected);
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
    ethereum.on("accountsChanged", (accounts: any[]) => {
      setAddress(accounts[0]);
      console.log("Active account changed:", accounts[0]);
    });
    ethereum.on("chainChanged", (changedChainId: any) => {
      setChainId(changedChainId);
      console.log("Network changed to:", changedChainId);
    });
    setIsWalletConnected(true);
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        initializeWallet();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const sendTransaction = async (to: string, data: string) => {
    if (!ethereum) {
      return;
    }
    const transactionParameters = {
      to,
      from: address,
      data
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log("Sent transaction: ", txHash);
    const receipt = await ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    console.log("Transaction receipt: ", receipt);

    return receipt;
  };

  const getChainId = async (): Promise<string> => {
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
  };

  const getAccounts = async (): Promise<string> => {
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
  };

  const switchChainId = async (chainId: string): Promise<void> => {
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
  };

  if (!isClient) {
    return null;
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
        initializeWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const dynamic = "client";
