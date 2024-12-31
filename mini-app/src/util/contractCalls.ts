import {
  createPublicClient,
  encodeFunctionData,
  http,
} from "viem";
import deployedContracts from "../../../contracts/deployments/deployedContracts";
import { bscTestnet } from "viem/chains";
import FixedPositionMarketMaker from "./FixedProductMarketMaker";

const chain = bscTestnet;

const challengeManagerAddress =
  deployedContracts[chain.id].ChallengeManager.address;
const challengeManagerAbi = deployedContracts[chain.id].ChallengeManager.abi;

const fixedProductMarketMakerAbi = FixedPositionMarketMaker.abi;

const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

export type TxParams = {
  to?: string;
  from?: string;
  data?: string;
};

export type TrackType = {
  id: bigint;
  trackName: string;
  artist: string;
  cid: string;
};

export type ChallengeType = {
  id: bigint;
  startingTime: bigint;
  endingTime: bigint;
  winnerTrackId: bigint;
  marketMaker: `0x${string}`;
  gameId: `0x${string}`;
  conditionId: `0x${string}`;
  positionIds: readonly bigint[];
  partitions: readonly bigint[];
  collectionIds: readonly `0x${string}`[];
  players: readonly `0x${string}`[];
  tracks: readonly TrackType[];
  criteria: string;
};

export async function getCurrentChallengeId(): Promise<bigint> {
  const challengeId = await publicClient.readContract({
    address: challengeManagerAddress,
    abi: challengeManagerAbi,
    functionName: "currentChallengeId",
  });
  return challengeId;
}

export async function getCurrentChallenge(): Promise<ChallengeType> {
  const challenge = await publicClient.readContract({
    address: challengeManagerAddress,
    abi: challengeManagerAbi,
    functionName: "getCurrentChallenge",
  });
  return challenge;
}

export async function getChallenge(challegeId: bigint): Promise<ChallengeType> {
  const challenge = await publicClient.readContract({
    address: challengeManagerAddress,
    abi: challengeManagerAbi,
    functionName: "getChallenge",
    args: [challegeId],
  });
  return challenge;
}

export function joinChallengeTxParams(
  trackName: string,
  artist: string,
  cid: string,
): TxParams {
  const encodedData = encodeFunctionData({
    abi: challengeManagerAbi,
    functionName: "joinChallenge",
    args: [trackName, artist, cid],
  });
  return {
    to: challengeManagerAddress,
    data: encodedData,
  };
}

export function buyTxParams(
  marketMakerAddress: string,
  investmentAmount: bigint,
  outcomeIndex: bigint,
  minOutcomeTokensToBuy: bigint,
): TxParams {
  const encodedData = encodeFunctionData({
    abi: fixedProductMarketMakerAbi,
    functionName: "buy",
    args: [investmentAmount, outcomeIndex, minOutcomeTokensToBuy],
  });
  return {
    to: marketMakerAddress,
    data: encodedData,
  };
}

export function sellTxParams(
  marketMakerAddress: string,
  returnAmount: bigint,
  outcomeIndex: bigint,
  maxOutcomeTokensToSell: bigint,
): TxParams {
  const encodedData = encodeFunctionData({
    abi: fixedProductMarketMakerAbi,
    functionName: "sell",
    args: [returnAmount, outcomeIndex, maxOutcomeTokensToSell],
  });
  return {
    to: marketMakerAddress,
    data: encodedData,
  };
}

export async function calcBuyAmount(marketMakerAddress: `0x${string}`, outcomeIndex: bigint) {
  const buyAmount = await publicClient.readContract({
    address: marketMakerAddress,
    abi: fixedProductMarketMakerAbi,
    functionName: "calcBuyAmount",
    args: [BigInt(1*(10**18)), outcomeIndex]
  });
  console.log(buyAmount);
  return buyAmount;
}

export async function calcSellAmount(marketMakerAddress: `0x${string}`, outcomeIndex: bigint) {
  const sellAmount = await publicClient.readContract({
    address: marketMakerAddress,
    abi: fixedProductMarketMakerAbi,
    functionName: "calcSellAmount",
    args: [BigInt(1*(10**18)), outcomeIndex]
  });
  console.log(sellAmount);
  return sellAmount;
}

