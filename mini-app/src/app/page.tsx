"use client";

import { Section } from "@telegram-apps/telegram-ui";
import { useTranslations } from "next-intl";

// import { LocaleSwitcher } from "@/components/LocaleSwitcher/LocaleSwitcher";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/WalletContext/WalletContext";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChallengeType,
  getChallenge,
  getCurrentChallenge,
  getCurrentChallengeId,
  TrackType,
} from "@/util/contractCalls";

function Track({ track }: { track: TrackType | undefined }) {
  if (!track) {
    return "TBD";
  }
  return (
    <div className="text-center">
      <p className="font-semibold text-lg">{track.trackName}</p>
      <p className="text-sm text-gray-400">{track.artist}</p>
    </div>
  );
}
export default function Home() {
  const t = useTranslations("i18n");
  const router = useRouter();
  const [week, setWeek] = useState<bigint>(BigInt(0));
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeType>();
  const [completedChallenges, setCompletedChallenges] = useState<
    ChallengeType[]
  >([]);

  useEffect(() => {
    async function init() {
      const week = await getCurrentChallengeId();
      console.log("Current Week: ", week);
      setWeek(week);
      const currentChallenge = await getCurrentChallenge();
      console.log("Current Challenge: ", currentChallenge);
      setCurrentChallenge(currentChallenge);
      const completedChallenge: ChallengeType[] = [];
      for (let i = 0; i <= week; i++) {
        const challenge = await getChallenge(BigInt(i));
        completedChallenge.push(challenge);
      }
      setCompletedChallenges(completedChallenge);
    }
    init();
  }, []);

  const handleRedirect = (id: string) => {
    router.push(`/application?id=${id}`);
  };

  const { address } = useContext(WalletContext);

  function getWinnerTrackName(challenge: ChallengeType): string {
    const winningTrackId = challenge.winnerTrackId;
    for (const track of challenge.tracks) {
      if (track.id === winningTrackId) {
        return track.trackName;
      }
    }
    return "TBD";
  }

  return (
    <div className="flex flex-col bg-[#121212] h-screen text-white">
      <div className=" p-6 border-b-2 border-[#333333]">
        <h1 className="text-4xl font-bold text-[#1DB954]">{t("title")}</h1>
        <p className="text-gray-300 mt-2">{t("description")}</p>
        {address ? (
          <Section>
            <p
              className="bg-[#121212] text-gray-300 mt-2 px-4 py-2 rounded-lg text-sm overflow-hidden whitespace-nowrap truncate border border-green-500 shadow-md"
              title={address} // Tooltip to show the full address on hover
            >
              Address: <span className="text-green-400">{address}</span>
            </p>
          </Section>
        ) : (
          <></>
        )}
      </div>

      <div className="flex-1 p-6 space-y-6">
        {currentChallenge ? (
          <div>
            {currentChallenge?.tracks.length < 2 && (
              <button
                className="bg-green-500 mb-2 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
                onClick={() => router.push("/upload")}
              >
                Join Game
              </button>
            )}
            <div
              onClick={() => handleRedirect(currentChallenge.id.toString())}
              className="cursor-pointer hover:bg-[#3E3E3E] bg-[#282828] p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-[#1DB954]">
                Ongoing Challenge: Week {week.toString()}
              </h2>
              <div className="flex justify-between items-center mt-4 ">
                <Track track={currentChallenge?.tracks.at(0)} />
                <p className="text-lg font-bold text-gray-300">VS</p>
                <Track track={currentChallenge?.tracks.at(1)} />
              </div>
            </div>
          </div>
        ) : (
          "Not yet started"
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1DB954]">
            Completed Challenges
          </h2>
          {completedChallenges.length === 0 ? (
            <p>No completed Challenges </p>
          ) : (
            completedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-[#282828] p-6 rounded-lg shadow-md flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-gray-300">
                      {challenge.id}
                    </p>
                    <p className="text-sm text-gray-400">
                      {challenge.tracks[0].trackName} by{" "}
                      {challenge.tracks[0].artist} VS{" "}
                      {challenge.tracks[1].trackName} by{" "}
                      {challenge.tracks[1].artist}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-[#1DB954]" />
                    <p className="font-semibold text-lg text-[#1DB954]">
                      Winner: {getWinnerTrackName(challenge)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 p-4 bg-[#1DB954] bg-opacity-20 rounded-md">
                  <p className="text-sm text-[#1DB954] font-medium">
                    Criteria: The winning track was chosen based on listener
                    engagement, playlist popularity, and overall vibes.
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
