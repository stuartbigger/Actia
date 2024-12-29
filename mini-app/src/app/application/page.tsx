"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Send } from "lucide-react";

const track = {
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

export default function SpotifyStyleTelegramMusicBetting() {
  const [selectedTrack, setSelectedTrack] = useState<
    "track1" | "track2" | null
  >(null);
  const [betAmount, setBetAmount] = useState<string>("0.2");
  const [messages, setMessages] = useState<string[]>([]);
  const [playingTrack, setPlayingTrack] = useState<"track1" | "track2" | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (trackKey: "track1" | "track2") => {
    setPlayingTrack(playingTrack === trackKey ? null : trackKey);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleBet = () => {
    if (selectedTrack && betAmount) {
      const selected = track[selectedTrack];
      const message = `You bet ${betAmount} BNB on "${selected.title}" by ${selected.artist}`;
      setMessages([...messages, message]);
      setSelectedTrack(null);
      setBetAmount("0.2");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#121212] text-white font-sans">
      <div className="bg-[#181818] text-white w-full lg:w-[300px] p-6 flex flex-col space-y-6 border-r-2 border-[#333333]">
        <h1 className="text-4xl font-bold text-[#1DB954] text-shadow-md">
          ACTIA Music Betting
        </h1>
        <h2 className="text-xl text-gray-300 mt-2">Select a Track to Bet On</h2>
        {["track1", "track2"].map((trackKey) => (
          <div
            key={trackKey}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#3E3E3E] cursor-pointer ${
              selectedTrack === trackKey
                ? "bg-[#1DB954] text-black"
                : "bg-[#282828] text-white"
            }`}
            onClick={() => setSelectedTrack(trackKey as "track1" | "track2")}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(trackKey as "track1" | "track2");
                }}
                className={`w-12 h-12 text-black rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedTrack === trackKey
                    ? "bg-[#1ed760]"
                    : "bg-[#1DB954] hover:bg-[#1ed760]"
                }`}
              >
                {playingTrack === trackKey ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <div className="flex flex-col">
                <p className="font-semibold text-lg">
                  {track[trackKey as "track1" | "track2"].title}
                </p>
                <p className="text-sm opacity-75">
                  {track[trackKey as "track1" | "track2"].artist}
                </p>
                <p
                  className={`text-sm ${selectedTrack === trackKey ? "text-black" : "text-gray-400"}`}
                >
                  Votes: {track[trackKey as "track1" | "track2"].votes}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTrack(trackKey as "track1" | "track2");
              }}
              className={`px-4 py-2 text-black rounded-full text-xs font-medium transition-colors ${
                selectedTrack === trackKey
                  ? "bg-[#1ed760]"
                  : "bg-[#1DB954] hover:bg-[#1ed760]"
              }`}
            >
              Bet in BNB
            </button>
          </div>
        ))}
        <audio ref={audioRef}>
          <source
            src="https://ipfs.io/ipfs/QmQ7gKRNTQVZ1RVodK2nmFfGp8jsi1nmeDNzNBM3XbphGD/adiye.mp3"
            type="audio/mpeg"
          />
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

        {selectedTrack && (
          <div className="flex items-center space-x-4 bg-[#282828] p-4 rounded-lg">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter Bet Amount"
              className="flex-1 p-3 bg-[#3E3E3E] text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
            <button
              onClick={handleBet}
              disabled={!betAmount}
              className="bg-[#1DB954] text-black p-3 rounded-full disabled:opacity-50 hover:bg-[#1ED760] transition-all"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
