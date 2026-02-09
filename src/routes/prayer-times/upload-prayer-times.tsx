import { createFileRoute } from "@tanstack/react-router";
import PrayerTimesUploadPage from "@/pages/prayer-times-upload-page/prayer-times-upload-page";

export const Route = createFileRoute("/prayer-times/upload-prayer-times")({
	component: PrayerTimesUploadPage,
});
