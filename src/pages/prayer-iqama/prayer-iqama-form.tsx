import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { PrayerIqamaOut } from "../../api/gen";
import {
	createPrayerIqamaMutationOptions,
	updatePrayerIqamaMutationOptions,
} from "../../api/prayer_iqama/mutations";
import {
	PRAYER_NAMES,
	PRAYER_NAMES_DISPLAY,
	type PrayerIqamaFormData,
	PrayerIqamaFormSchema,
} from "../../api/prayer_iqama/validation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useMosque } from "../../contexts";

interface PrayerIqamaFormProps {
	existingIqama?: PrayerIqamaOut;
	onSuccess?: () => void;
}

export function PrayerIqamaForm({
	existingIqama,
	onSuccess,
}: PrayerIqamaFormProps) {
	const { mosque } = useMosque();
	const [formData, setFormData] = useState<PrayerIqamaFormData>({
		mosque_id: mosque?.id || "",
		prayer_name: existingIqama?.prayer_name || "fajr",
		mode: existingIqama?.mode || "offset",
		offset_minutes: existingIqama?.offset_minutes || 0,
		fixed_time: existingIqama?.fixed_time || "06:00",
	});

	const [errors, setErrors] = useState<
		Partial<Record<keyof PrayerIqamaFormData, string>>
	>({});

	const createMutation = useMutation(
		createPrayerIqamaMutationOptions({
			onSuccess: () => {
				toast.success("Prayer Iqama created successfully!");
				setFormData({
					mosque_id: mosque?.id || "",
					prayer_name: "fajr",
					mode: "offset",
					offset_minutes: 0,
					fixed_time: "06:00",
				});
				if (onSuccess) onSuccess();
			},
			onError: (error) => {
				toast.error("Failed to create prayer iqama");
				console.error(error);
			},
		}),
	);

	const updateMutation = useMutation(
		updatePrayerIqamaMutationOptions({
			onSuccess: () => {
				toast.success("Prayer Iqama updated successfully!");
				if (onSuccess) onSuccess();
			},
			onError: (error) => {
				toast.error("Failed to update prayer iqama");
				console.error(error);
			},
		}),
	);

	const handleInputChange = (
		field: keyof PrayerIqamaFormData,
		value: unknown,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear error for this field when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!mosque) {
			toast.error("Please select a mosque first");
			return;
		}

		// Validate form data with Zod
		const validationData = {
			...formData,
			mosque_id: mosque.id,
			offset_minutes:
				formData.mode === "offset"
					? Number(formData.offset_minutes)
					: undefined,
			fixed_time: formData.mode === "fixed" ? formData.fixed_time : undefined,
		};

		const result = PrayerIqamaFormSchema.safeParse(validationData);

		if (!result.success) {
			// Set errors from Zod validation
			const newErrors: Partial<Record<keyof PrayerIqamaFormData, string>> = {};
			result.error.errors.forEach((error) => {
				const path = error.path[0] as keyof PrayerIqamaFormData;
				newErrors[path] = error.message;
			});
			setErrors(newErrors);
			toast.error("Please fix the validation errors");
			return;
		}

		// Clear errors on successful validation
		setErrors({});

		if (existingIqama) {
			updateMutation.mutate({
				path: { prayer_iqama_id: existingIqama.id },
				body: result.data,
			});
		} else {
			createMutation.mutate({
				body: result.data,
			});
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex flex-col gap-2">
				<Label htmlFor="prayer_name">Prayer Name *</Label>
				<select
					id="prayer_name"
					value={formData.prayer_name}
					onChange={(e) => handleInputChange("prayer_name", e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				>
					{PRAYER_NAMES.map((name) => (
						<option key={name} value={name}>
							{PRAYER_NAMES_DISPLAY[name]}
						</option>
					))}
				</select>
				{errors.prayer_name && (
					<p className="text-sm text-red-500 mt-1">{errors.prayer_name}</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="mode">Mode *</Label>
				<select
					id="mode"
					value={formData.mode}
					onChange={(e) => handleInputChange("mode", e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="offset">Offset (minutes from prayer time)</option>
					<option value="fixed">Fixed (specific time)</option>
				</select>
				{errors.mode && (
					<p className="text-sm text-red-500 mt-1">{errors.mode}</p>
				)}
			</div>

			{formData.mode === "offset" && (
				<div>
					<Label htmlFor="offset_minutes">Offset Minutes *</Label>
					<p className="text-sm text-gray-500 mb-2">
						Positive numbers are after the prayer time (e.g., 5 means 5 minutes
						after prayer)
					</p>
					<Input
						id="offset_minutes"
						type="number"
						min="-120"
						max="120"
						value={formData.offset_minutes || 0}
						onChange={(e) =>
							handleInputChange("offset_minutes", e.target.value)
						}
						className={errors.offset_minutes ? "border-red-500" : ""}
					/>
					{errors.offset_minutes && (
						<p className="text-sm text-red-500 mt-1">{errors.offset_minutes}</p>
					)}
				</div>
			)}

			{formData.mode === "fixed" && (
				<div>
					<Label htmlFor="fixed_time">Fixed Time (HH:MM) *</Label>
					<Input
						id="fixed_time"
						type="time"
						value={formData.fixed_time || "06:00"}
						onChange={(e) => handleInputChange("fixed_time", e.target.value)}
						className={errors.fixed_time ? "border-red-500" : ""}
					/>
					{errors.fixed_time && (
						<p className="text-sm text-red-500 mt-1">{errors.fixed_time}</p>
					)}
				</div>
			)}

			<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
				{isLoading
					? "Saving..."
					: existingIqama
						? "Update Iqama"
						: "Create Iqama"}
			</Button>
		</form>
	);
}
