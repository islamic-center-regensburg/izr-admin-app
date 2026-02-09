import { createFileRoute } from "@tanstack/react-router";
import PrayerTimesPage from "@/pages/prayer-times-page/prayer-times-page";

export const Route = createFileRoute("/prayer-times/test-prayer-times")({
	component: PrayerTimesPage,
});
