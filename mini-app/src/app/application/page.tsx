"use client";

import React, { useState } from "react";
import { Play, Pause, Send } from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  sharesOwned: number;
  betAmount: number;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    sharesOwned: 10,
    betAmount: 0.05,
  },
  {
    id: 2,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    sharesOwned: 2,
    betAmount: 0.02,
  },
  {
    id: 3,
    title: "Imagine",
    artist: "John Lennon",
    sharesOwned: 5,
    betAmount: 0.03,
  },
];

export default function SpotifyStyleTelegramMusicBetting() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    setBetAmount(track.betAmount.toString());
  };

  const handleBet = () => {
    if (selectedTrack && betAmount) {
      const message = `You bet ${betAmount} BNB on "${selectedTrack.title}" by ${selectedTrack.artist}`;
      setMessages([...messages, message]);
      setSelectedTrack(null);
      setBetAmount("");
    }
  };

  const togglePlay = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#121212] text-white font-sans">
      <div className="bg-[#181818] text-white w-full lg:w-[300px] p-6 flex flex-col space-y-6 border-r-2 border-[#333333]">
        <h1 className="text-4xl font-bold text-[#1DB954] text-shadow-md">
          BNB Spotify Music Betting
        </h1>
        <h2 className="text-xl text-gray-300 mt-2">Select a Track to Bet On</h2>
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#3E3E3E] cursor-pointer ${selectedTrack?.id === track.id ? "bg-[#1DB954] text-black" : "bg-[#282828] text-white"}`}
            onClick={() => handleTrackSelect(track)}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => togglePlay(track.id)}
                className={`w-12 h-12 text-black rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedTrack?.id === track.id
                    ? "bg-[#1ed760]"
                    : "bg-[#1DB954] hover:bg-[#1ed760]"
                }`}
              >
                {playingTrack === track.id ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <div className="flex flex-col">
                <p className="font-semibold text-lg">{track.title}</p>
                <p className="text-sm opacity-75">{track.artist}</p>
                <p
                  className={`text-sm ${selectedTrack?.id === track.id ? "text-black" : "text-gray-400"}`}
                >
                  Shares Owned: {track.sharesOwned}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTrackSelect(track);
              }}
              className={`px-4 py-2 text-black rounded-full text-xs font-medium transition-colors ${
                selectedTrack?.id === track.id
                  ? "bg-[#1ed760]"
                  : "bg-[#1DB954] hover:bg-[#1ed760]"
              }`}
            >
              Bet {track.betAmount} BNB
            </button>
          </div>
        ))}
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
