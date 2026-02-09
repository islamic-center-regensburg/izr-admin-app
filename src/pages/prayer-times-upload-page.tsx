import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { FileTypeEnum } from "@/api/gen";
import { uploadPrayerTimesMuationOptions } from "@/api/prayer_times_upload/mutations";
import { PrayerTimesUploadSchema } from "@/api/prayer_times_upload/validation";
import { FileDropzone } from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMosque } from "@/contexts";

export default function PrayerTimesUploadPage() {
	const { mosque } = useMosque();
	const currentYear = new Date().getFullYear();

	const [formData, setFormData] = useState({
		mosque_id: mosque?.id || "",
		year: currentYear,
		file_type: "csv" as FileTypeEnum,
		file: null as File | null,
	});

	const [errors, setErrors] = useState<
		Partial<Record<keyof typeof formData, string>>
	>({});

	const uploadMutation = useMutation(
		uploadPrayerTimesMuationOptions({
			onSuccess: () => {
				toast.success("Prayer times uploaded successfully!");
				setFormData({
					mosque_id: mosque?.id || "",
					year: currentYear,
					file_type: "csv" as FileTypeEnum,
					file: null,
				});
			},
			onError: (error) => {
				toast.error("Failed to upload prayer times");
				console.error(error);
			},
		}),
	);

	const handleFileSelect = (file: File | null) => {
		setFormData((prev) => ({
			...prev,
			file,
			// Auto-detect file type from extension
			file_type:
				file?.name.endsWith(".xls") || file?.name.endsWith(".xlsx")
					? "xls"
					: "csv",
		}));
		// Clear file error when a file is selected
		if (errors.file && file) {
			setErrors((prev) => ({ ...prev, file: undefined }));
		}
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value, 10);
		setFormData((prev) => ({ ...prev, year: value }));
		// Clear error for year field
		if (errors.year) {
			setErrors((prev) => ({ ...prev, year: undefined }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form data with Zod
		const result = PrayerTimesUploadSchema.safeParse(formData);

		if (!result.success) {
			// Set errors from Zod validation
			const newErrors: Partial<Record<keyof typeof formData, string>> = {};
			for (const error of result.error.errors) {
				const path = error.path[0] as keyof typeof formData;
				newErrors[path] = error.message;
			}
			setErrors(newErrors);
			toast.error("Please fix the validation errors");
			return;
		}

		// Clear errors on successful validation
		setErrors({});

		// Submit the form
		uploadMutation.mutate({
			body: {
				file: result.data.file,
			},
			query: {
				mosque_id: result.data.mosque_id,
				year: result.data.year,
				file_type: result.data.file_type,
			},
		});
	};

	return (
		<div className="w-full max-w-2xl mx-auto p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Upload Prayer Times</h1>
				<p className="text-muted-foreground mt-2">
					Upload a CSV or Excel file containing prayer times for the year
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Mosque ID (hidden, auto-filled from context) */}
				<input type="hidden" value={formData.mosque_id} />

				{/* Year */}
				<div className="space-y-2">
					<Label htmlFor="year">Year</Label>
					<Input
						id="year"
						name="year"
						type="number"
						value={formData.year}
						onChange={handleYearChange}
						min={2000}
						max={2100}
						className={errors.year ? "border-red-500" : ""}
					/>
					{errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
				</div>

				{/* File Upload */}
				<div className="space-y-2">
					<Label>Prayer Times File</Label>
					<FileDropzone
						onFileSelect={handleFileSelect}
						acceptedTypes={[".csv", ".xls", ".xlsx"]}
						disabled={uploadMutation.isPending}
						error={errors.file}
					/>
					<p className="text-xs text-muted-foreground">
						File type:{" "}
						<span className="font-medium">
							{formData.file_type.toUpperCase()}
						</span>
					</p>
				</div>

				{/* Submit Button */}
				<div className="flex gap-3 justify-end pt-4">
					<Button
						type="submit"
						disabled={uploadMutation.isPending || !formData.file}
					>
						{uploadMutation.isPending ? "Uploading..." : "Upload Prayer Times"}
					</Button>
				</div>
			</form>
		</div>
	);
}
