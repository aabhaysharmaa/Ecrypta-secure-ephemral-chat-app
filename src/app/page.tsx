"use client";

import { client } from "@/libs/client";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const ANIMALS = [
  "shadow_wolf",
  "sky_hawk",
  "night_fox",
  "iron_bear",
  "storm_eagle",
  "crimson_tiger",
  "phantom_panther",
  "silver_serpent"
];

const STORAGE_KEY = "chat_username";
const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `anonymous-${word}-${nanoid(8)}`
}
const Home = () => {
  const [username, setUserName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserName(stored);
        return
      }
      const generateRandomUserName = generateUsername();
      localStorage.setItem(STORAGE_KEY, generateRandomUserName);
      setUserName(generateRandomUserName)
    }
    main()
  }, [])

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      console.log("RES :", res)
      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`)
      }
      console.log("Entered IN the room")
    }
  });
  const handleSubmit = () => {
    createRoom();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}Private_chat
          </h1>
          <p className="text-sm text-zinc-500">A Private, self-destructing chat room. </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500">Your Identity</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                  {username}
                </div>
              </div>
            </div>
            <button className="w-full  bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50" onClick={handleSubmit}>CREATE A SECURE ROOM</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
