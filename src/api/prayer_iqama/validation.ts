import { z } from "zod";

export const PrayerIqamaFormSchema = z.object({
	mosque_id: z.string().min(1, "Mosque ID is required"),
	prayer_name: z.enum(["fajr", "dhuhr", "asr", "maghrib", "isha", "jumah"], {
		required_error: "Prayer name is required",
	}),
	mode: z.enum(["fixed", "offset"], {
		required_error: "Mode is required",
	}),
	offset_minutes: z
		.number()
		.int("Offset must be an integer")
		.min(-120, "Offset must be at least -120 minutes")
		.max(120, "Offset must be at most 120 minutes")
		.nullish(),
	fixed_time: z
		.string()
		.regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format")
		.nullish(),
});

export type PrayerIqamaFormData = z.infer<typeof PrayerIqamaFormSchema>;

export const PRAYER_NAMES = [
	"fajr",
	"dhuhr",
	"asr",
	"maghrib",
	"isha",
	"jumah",
] as const;

export const PRAYER_NAMES_DISPLAY: Record<string, string> = {
	fajr: "Fajr",
	dhuhr: "Dhuhr",
	asr: "Asr",
	maghrib: "Maghrib",
	isha: "Isha",
	jumah: "Jumah",
};
