import { z } from "zod";

const ACCEPTED_FILE_TYPES = [
	"text/csv",
	"application/vnd.ms-excel", // .xls
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const PrayerTimesUploadSchema = z.object({
	mosque_id: z.string().min(1, "Mosque ID is required"),
	year: z
		.number()
		.int("Year must be an integer")
		.min(2000, "Year must be 2000 or later")
		.max(2100, "Year must be 2100 or earlier"),
	file_type: z.enum(["csv", "xls"], {
		required_error: "File type is required",
	}),
	file: z
		.instanceof(File, { message: "Please upload a file" })
		.refine(
			(file) => file.size <= MAX_FILE_SIZE,
			"File size must be less than 10MB",
		)
		.refine(
			(file) =>
				ACCEPTED_FILE_TYPES.includes(file.type) ||
				file.name.endsWith(".csv") ||
				file.name.endsWith(".xls") ||
				file.name.endsWith(".xlsx"),
			"Only CSV and Excel files are accepted",
		),
});

export type PrayerTimesUploadFormData = z.infer<typeof PrayerTimesUploadSchema>;
