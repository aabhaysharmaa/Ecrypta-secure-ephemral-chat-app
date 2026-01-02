"use client";

import { nanoid } from "nanoid";
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

export const useUsername = () => {
	const [username, setUserName] = useState("");

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
	return { username }
}