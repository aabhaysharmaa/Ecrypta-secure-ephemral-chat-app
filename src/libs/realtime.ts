// message , destroy
import { redis } from "@/libs/redis";
import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import * as z from "zod";
const messages = z.object({
	id: z.string(),
	sender: z.string(),
	text: z.string(),
	timestamp: z.number(),
	roomId: z.string(),
	token: z.string().optional()
})
const schema = {
	chat: {
		message: messages,
		destroy: z.object({
			isDestroyed: z.literal(true)
		})
	}
}

export const realtime = new Realtime({
	schema, redis
});

export type RealtimeEvents = InferRealtimeEvents<typeof realtime>

export type message = z.infer<typeof messages>