"use client";

import React, { useContext, useState } from "react";
import { Joystick, Upload, Send, Music } from "lucide-react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { challengeManagerAddress, joinChallengeTxData } from "@/util/contractCalls";
import { WalletContext } from "@/components/WalletContext/WalletContext";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {sendTransaction} = useContext(WalletContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const uploadData = async (p0: File) => {
    const storage = new ThirdwebStorage({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    });
    const uri = await storage.upload({
      files: [p0],
    });
    console.log("uri : ", uri);
    const fetchableUrl = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("Fetchable URL: ", fetchableUrl);
    const response = await fetch(fetchableUrl);
    const data = await response.json();
    const innerUri: string = data.files[0];
    const CID = innerUri.replace("ipfs://", "");
    console.log("Inner CID: ", CID);
    return CID;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    if (!file) {return;}
    e.preventDefault();
    console.log("Submitted:", { title, author, file });
    const cid = await uploadData(file);
    const txData = joinChallengeTxData(title, author, cid);
    await sendTransaction(challengeManagerAddress, txData);
    setTitle("");
    setAuthor("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
      <header className="p-6 border-[#282828]">
        <h1 className="text-4xl font-bold text-[#1DB954] flex items-center">
          <Music className="w-8 h-8 mr-2" />
          Upload Track
        </h1>
      </header>

      <main className="flex-1 p-6 flex justify-center items-start">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-[#181818] p-8 rounded-lg shadow-xl"
        >
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-[#B3B3B3]"
            >
              Track Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#282828] text-white border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#727272]"
              placeholder="Enter track title"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="author"
              className="text-sm font-medium text-[#B3B3B3]"
            >
              Track Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 bg-[#282828] text-white border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#727272]"
              placeholder="Enter author's name"
              required
            />
          </div>

          <div className="space-y-2 pt-12 ">
            <label
              htmlFor="file"
              className="text-sm font-medium text-[#B3B3B3]"
            >
              Upload File
            </label>
            <div className="relative">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".mp3,.wav"
                required
              />

              <label
                htmlFor="file"
                className="flex items-center justify-center w-full p-3 bg-[#282828] text-white border border-[#333333] rounded-md cursor-pointer hover:bg-[#3E3E3E] transition-colors"
              >
                <Upload className="w-5 h-5 mr-2 text-[#1DB954]" />
                {file ? file.name : "Choose a file"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1DB954] text-black p-3 rounded-full font-medium hover:bg-[#1ED760] transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
