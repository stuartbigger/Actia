"use client";

import { Section } from "@telegram-apps/telegram-ui";
import { useTranslations } from "next-intl";

// import { LocaleSwitcher } from "@/components/LocaleSwitcher/LocaleSwitcher";

import { useContext, useEffect } from "react";
import { WalletContext } from "@/components/WalletContext/WalletContext";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface Challenge {
  id: number;
  week: string;
  track1: string;
  artist1: string;
  track2: string;
  artist2: string;
  winner: string;
}

const ongoingChallenge = {
  id: 1,
  week: "Week 12",
  track1: {
    title: "Hotel California",
    artist: "Eagles",
    votes: 1200,
  },
  track2: {
    title: "Let It Be",
    artist: "The Beatles",
    votes: 1500,
  },
};

const completedChallenges: Challenge[] = [
  {
    id: 1,
    week: "Week 11",
    track1: "Someone Like You",
    artist1: "Adele",
    track2: "Rolling in the Deep",
    artist2: "Adele",
    winner: "Rolling in the Deep",
  },
  {
    id: 2,
    week: "Week 10",
    track1: "Smells Like Teen Spirit",
    artist1: "Nirvana",
    track2: "Wonderwall",
    artist2: "Oasis",
    winner: "Smells Like Teen Spirit",
  },
];

export default function Home() {
  const t = useTranslations("i18n");
  const router = useRouter();

  const handleRedirect = (id: number) => {
    router.push(`/application?id=${id}`);
  };

  const { address, chainId, isWalletConnected, switchChainId } =
    useContext(WalletContext);

  useEffect(() => {
    // const bnbCHainId = "0x38";
    const bnbCHainId = "0x61"; // BNB testnet
    if (isWalletConnected && chainId !== bnbCHainId) {
      switchChainId(bnbCHainId);
    }
  }, [isWalletConnected, chainId]);

  return (
    <div className="flex flex-col bg-[#121212] text-white">
      <div className=" p-6 border-b-2 border-[#333333]">
        <h1 className="text-4xl font-bold text-[#1DB954]">{t("title")}</h1>
        <p className="text-gray-300 mt-2">{t("description")}</p>

        <Section>
          <p className="bg-[#121212] text-gray-300 mt-2">Address: {address}</p>
        </Section>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div
          onClick={() => handleRedirect(ongoingChallenge.id)}
          className="cursor-pointer hover:bg-[#3E3E3E] bg-[#282828] p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-[#1DB954]">
            Ongoing Challenge: {ongoingChallenge.week}
          </h2>
          <div className="flex justify-between items-center mt-4 ">
            <div className="text-center">
              <p className="font-semibold text-lg">
                {ongoingChallenge.track1.title}
              </p>
              <p className="text-sm text-gray-400">
                {ongoingChallenge.track1.artist}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Votes: {ongoingChallenge.track1.votes}
              </p>
            </div>
            <p className="text-lg font-bold text-gray-300">VS</p>
            <div className="text-center">
              <p className="font-semibold text-lg">
                {ongoingChallenge.track2.title}
              </p>
              <p className="text-sm text-gray-400">
                {ongoingChallenge.track2.artist}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Votes: {ongoingChallenge.track2.votes}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1DB954]">
            Completed Challenges
          </h2>
          {completedChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-[#282828] p-6 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-lg text-gray-300">
                  {challenge.week}
                </p>
                <p className="text-sm text-gray-400">
                  {challenge.track1} by {challenge.artist1} VS{" "}
                  {challenge.track2} by {challenge.artist2}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-[#1DB954]" />
                <p className="font-semibold text-lg text-[#1DB954]">
                  Winner: {challenge.winner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
