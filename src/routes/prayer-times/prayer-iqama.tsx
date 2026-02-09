import { createFileRoute } from "@tanstack/react-router";
import PrayerIqama from "@/pages/prayer-iqama/prayer-iqama";

export const Route = createFileRoute("/prayer-times/prayer-iqama")({
	component: PrayerIqama,
});
