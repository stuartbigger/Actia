import { createPublicClient, encodeFunctionData, http } from "viem";
import deployedContracts from "../../../contracts/deployments/deployedContracts";
import { bscTestnet } from "viem/chains";

const chain = bscTestnet;

export const challengeManagerAddress =
  deployedContracts[chain.id].ChallengeManager.address;
const challengeManagerAbi = deployedContracts[chain.id].ChallengeManager.abi;

const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

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

export function joinChallengeTxData(
  trackName: string,
  artist: string,
  cid: string,
): string {
  const encodedCall = encodeFunctionData({
    abi: challengeManagerAbi,
    functionName: "joinChallenge",
    args: [trackName, artist, cid],
  });
  return encodedCall;
}
