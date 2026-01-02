"use client"
import { useUsername } from "@/hooks/user-username";
import { client } from "@/libs/client";
import { useRealtime } from "@/libs/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const formatTimeRemaining = (seconds: number) => {
	// 121 Seconds
	const mins = Math.floor(seconds / 60);
	const sec = seconds % 60
	return `${mins}:${sec.toString().padStart(2, "0")}`
}


const RoomId = () => {
	const [copyStatus, setCopyStatus] = useState("COPY");
	const { username } = useUsername();
	const router = useRouter();
	const params = useParams();

	const { roomId } = params;
	if (typeof roomId !== "string") {
		throw new Error("Invalid roomId")
	}

	const copyLink = () => {
		const url = window.location.href
		navigator.clipboard.writeText(url)
		setCopyStatus("COPIED")
		setTimeout(() => setCopyStatus("COPY"), 2000)
	};
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

	const { data: ttlData } = useQuery({
		queryKey: ['ttl'],
		queryFn: async () => {
			const res = await client.room.ttl.get({ query: { roomId } })
			setInput("")
			return res.data
		}
	})

	const { data: messages, refetch } = useQuery({
		queryKey: ['messages', roomId],
		queryFn: async () => {
			const res = await client.messages.get({ query: { roomId } });
			return res.data
		}
	})
	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: async ({ text }: { text: string }) => {
			await client.messages.post({ sender: username, text }, { query: { roomId } })
		}
	})
	useRealtime({
		channels: [roomId], events: ["chat.message", "chat.destroy"], onData: ({ event }) => {
			if (event === "chat.message") {
				refetch()
			}
			if (event === "chat.destroy") {
				router.push("/?destroyed=true")
			}
		}
	})

	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const handleSubmit = () => {
		sendMessage({ text: input })
		inputRef.current?.focus()
		setInput("");
	}

	useEffect(() => {
		if (ttlData?.ttl !== undefined) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setTimeRemaining(ttlData.ttl)
		}
	}, [ttlData])

	useEffect(() => {

		if (timeRemaining === null || timeRemaining < 0) return

		if (timeRemaining === 0) {
			router.push("/?destroyed=true")
			return
		}
		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev === 0 || !prev) {
					clearInterval(interval)
					return 0;
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(interval)
	}, [router, timeRemaining])
	return (
		<main className="flex flex-col h-screen max-h-screen overflow-hidden">
			<header className="border-b border border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
				<div className="flex items-center gap-4">
					<div className="flex flex-col">
						<span className="text-sm text-zinc-500 uppercase">ROOM ID</span>
						<div className="flex items-center gap-2">
							<span className="font-bold text-green-500">
								{roomId}
							</span>
							<button onClick={copyLink} className="text-[12px] mx-4 bg-zinc-800 cursor-pointer hover:bg-zinc-700 px-2 py0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors">{copyStatus}</button>
						</div>
					</div>
					<div className="h-8 w-px bg-zinc-800" />
					<div className="flex flex-col">
						<span className="text-xs text-zinc-500 uppercase">
							Self-Destruct
						</span>
						<span className={`text-sm flex items-center font-bold gap-2 ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}>
							{timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
						</span>
					</div>
				</div>
				<button className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-colors group flex items-center gap-2 disabled:opacity-50">
					<span className="group-hover:animate-pulse">💣</span>
					DESTROY NOW
				</button>
			</header>
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
				{/* Messages */}
				{messages?.messages.length === 0 && (
					<div className="flex items-center justify-center h-full">
						<p className="font-mono text-zinc-600 text-sm">No Messages yet,start the conversation</p>
					</div>
				)}

				{messages?.messages.map((msg) => (
					<div className="flex flex-col items-start" key={msg.id}>
						<div className="max-w-[80%] group">
							<div className="flex items-baseline gap-3 mb-1 flex-col">
								<span className={`text-xs font-bold ${msg.sender === username ? "text-green-500" : "text-blue-500"}`}>
									{msg.sender === username ? "YOU" : msg.sender}
								</span>
								<p className="text-zinc-300 text-sm leading-relaxed break-all">
									{msg.text}
									<span className="text-zinc-600 text-[10px] ml-4">{format(msg.timestamp, "HH:MM")}</span>
								</p>

							</div>
						</div>
					</div>
				))}
			</div>
			<div className="p-4 border-t border-zinc-800 bg-zinc900/30">
				<div className="flex gap-4">
					<div className="flex-1 relative group">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">{">"}</span>
						<input placeholder="Type Message..." value={input} onKeyDown={(e) => {
							if (e.key === "Enter" && input.trim()) {
								sendMessage({ text: input })
								inputRef.current?.focus()
							}
						}} onChange={(e) => setInput(e.target.value)} type="text" autoFocus className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100  placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm" />
					</div>
					<button onClick={handleSubmit}
						disabled={!input.trim() || isPending} className="bg-zinc-800 text-zinc-400 cursor-pointer hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed  px-6 text-sm font-bold">SEND</button>
				</div>
			</div>
		</main>
	)
}

export default RoomId
