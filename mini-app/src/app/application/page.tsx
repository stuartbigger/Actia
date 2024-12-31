"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Play, Pause, Send, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { buyTxParams, ChallengeType, getChallenge, sellTxParams } from "@/util/contractCalls";
import { WalletContext } from "@/components/WalletContext/WalletContext";

export default function SpotifyStyleTelegramMusicBetting() {
  const [selectedTrack, setSelectedTrack] = useState<number>(-1);
  const [challenge, setChallenge] = useState<ChallengeType>();
  const [betAmount, setBetAmount] = useState<string>("0.2");
  const [messages, setMessages] = useState<string[]>([]);
  const [playingTrack, setPlayingTrack] = useState<number>(-1);
  const {sendTransaction} = useContext(WalletContext);

  const router = useRouter();

  const id = useSearchParams().get("id");

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (trackKey: number) => {
    const trackCid = challenge?.tracks.find(
      (track) => Number(track.id) === trackKey,
    )?.cid;
    const trackSrc = `https://ipfs.io/ipfs/${trackCid}`;

    if (playingTrack === trackKey) {
      setPlayingTrack(-1);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingTrack(trackKey);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = trackSrc;
        audioRef.current.play();
      }
    }
  };

  const handleBuy = async () => {
    if (challenge && selectedTrack !== -1 && betAmount) {
      console.log(challenge);
      const amount = BigInt(parseFloat(betAmount)*(10**18));
      const selectedTrackIdx = challenge?.tracks.findIndex( (track) => Number(track.id) === selectedTrack);
      if (selectedTrackIdx === -1) { 
          console.log("Cannot find track, ", selectedTrack);
          return; 
      }
      const selected = challenge.tracks[selectedTrackIdx];
      const txParams = buyTxParams(challenge.marketMaker, amount, BigInt(selectedTrackIdx), BigInt(0));
      console.log(challenge.marketMaker, amount, BigInt(selectedTrackIdx), BigInt(0), txParams)
      await sendTransaction(txParams);
      const message = `You bet ${betAmount} BNB on "${selected.trackName}" by ${selected.artist}`;
      setMessages([...messages, message]);
      setSelectedTrack(-1);
      setBetAmount("0.2");
    }
  };

  const handleSell = async () => {
    if (challenge && selectedTrack !== -1 && betAmount) {
      console.log(challenge);
      const amount = BigInt(parseFloat(betAmount)*(10**18));
      const selectedTrackIdx = challenge?.tracks.findIndex( (track) => Number(track.id) === selectedTrack);
      if (selectedTrackIdx === -1) { 
          console.log("Cannot find track, ", selectedTrack);
          return; 
      }
      const selected = challenge.tracks[selectedTrackIdx];
      const txParams = sellTxParams(challenge.marketMaker, amount, BigInt(selectedTrackIdx), amount);
      await sendTransaction(txParams);
      const message = `You bet ${betAmount} BNB on "${selected.trackName}" by ${selected.artist}`;
      setMessages([...messages, message]);
      setSelectedTrack(-1);
      setBetAmount("0.2");
    }
  };

  useEffect(() => {
    async function init() {
      if (!id) {
        router.push("/");
        return;
      }
      const challenge = await getChallenge(BigInt(id));
      setChallenge(challenge);
    }
    init();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#121212] text-white font-sans">
      <div className="bg-[#181818] text-white w-full lg:w-[300px] p-6 flex flex-col space-y-6 border-r-2 border-[#333333]">
        <h1 className="text-4xl font-bold text-[#1DB954] text-shadow-md">
          ACTIA Music Betting
        </h1>
        {challenge && challenge.tracks.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl text-gray-300 mt-2">
              Select a Track to Bet On
            </h2>
            {challenge?.tracks.map((track) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#3E3E3E] cursor-pointer ${
                  selectedTrack === Number(track.id)
                    ? "bg-[#1DB954] text-black"
                    : "bg-[#282828] text-white"
                }`}
                onClick={() => setSelectedTrack(Number(track.id))}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(Number(track.id));
                    }}
                    className={`w-12 h-12 text-black rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedTrack === Number(track.id)
                        ? "bg-[#1ed760]"
                        : "bg-[#1DB954] hover:bg-[#1ed760]"
                    }`}
                  >
                    {playingTrack === Number(track.id) ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">{track.trackName}</p>
                    <p className="text-sm opacity-75">{track.artist}</p>
                    <p
                      className={`text-sm ${selectedTrack === Number(track.id) ? "text-black" : "text-gray-400"}`}
                    >
                      Votes:{" "}
                      {
                        // TODO: Get votes
                        "0"
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrack(Number(track.id));
                  }}
                  className={`px-4 py-2 text-black rounded-full text-xs font-medium transition-colors ${
                    selectedTrack === Number(track.id)
                      ? "bg-[#1ed760]"
                      : "bg-[#1DB954] hover:bg-[#1ed760]"
                  }`}
                >
                  Bet in BNB
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-xl text-gray-300 mt-2">
            No tracks in challenge yet
          </h2>
        )}
        <audio ref={audioRef}>
          <source type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="flex-1 bg-[#181818] p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.map((message, index) => (
            <div key={index} className="flex justify-end">
              <div className="bg-[#282828] rounded-lg p-4 max-w-xs shadow-lg">
                {message}
              </div>
            </div>
          ))}
        </div>

        {selectedTrack !== -1 && (
          <div className="flex items-center space-x-4 bg-[#282828] p-4 rounded-lg">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter Bet Amount"
              className="flex-1 p-3 bg-[#3E3E3E] text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
            <button
              onClick={handleBuy}
              disabled={!betAmount}
              className="bg-[#1DB954] text-black p-3 rounded-full disabled:opacity-50 hover:bg-[#1ED760] transition-all"
            >
              <Send className="w-6 h-6" />
            </button>
            <button
              onClick={handleSell}
              disabled={!betAmount}
              className="bg-[#1DB954] text-black p-3 rounded-full disabled:opacity-50 hover:bg-[#1ED760] transition-all"
            >
              <TrendingUp className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
