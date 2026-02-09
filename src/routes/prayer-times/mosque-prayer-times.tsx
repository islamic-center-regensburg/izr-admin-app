import { createFileRoute } from "@tanstack/react-router";
import { MosquePrayerTimes } from "@/pages/mosque-prayer-times/mosque-prayer-times";

export const Route = createFileRoute("/prayer-times/mosque-prayer-times")({
	component: MosquePrayerTimes,
});
