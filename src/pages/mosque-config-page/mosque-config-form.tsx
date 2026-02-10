import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	CalculationMethod,
	CalendarMethod,
	LatitudeAdjustmentMethod,
	MidnightMode,
	PrayerConfigurationIn,
	PrayerConfigurationOut,
	PrayerTimeConfigurationUpdate,
	School,
	Shafaq,
} from "@/api/gen";
import {
	createPrayerConfigMutationOptions,
	updateMosqueMutationOptions,
} from "@/api/prayer_config/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMosque } from "@/contexts";

type PrayerConfigFormState = {
	calculation_method: string;
	school: string;
	midnight_mode: string;
	latitude_adjustment_method: string;
	tune: boolean;
	imsak_tune: string;
	fajr_tune: string;
	sunrise_tune: string;
	dhuhr_tune: string;
	asr_tune: string;
	maghrib_tune: string;
	isha_tune: string;
	midnight_tune: string;
	fajr_angle: string;
	maghrib_angle: string;
	isha_angle: string;
	shafaq: string;
	calendar_method: string;
	adjustment: string;
};

const buildFormState = (
	config?: PrayerConfigurationOut,
	defaultCalculationMethod?: string,
): PrayerConfigFormState => ({
	calculation_method:
		config?.calculation_method?.toString() || defaultCalculationMethod || "",
	school: config?.school?.toString() || "",
	midnight_mode: config?.midnight_mode?.toString() || "",
	latitude_adjustment_method:
		config?.latitude_adjustment_method?.toString() || "",
	tune: config?.tune ?? false,
	imsak_tune: config?.imsak_tune?.toString() || "",
	fajr_tune: config?.fajr_tune?.toString() || "",
	sunrise_tune: config?.sunrise_tune?.toString() || "",
	dhuhr_tune: config?.dhuhr_tune?.toString() || "",
	asr_tune: config?.asr_tune?.toString() || "",
	maghrib_tune: config?.maghrib_tune?.toString() || "",
	isha_tune: config?.isha_tune?.toString() || "",
	midnight_tune: config?.midnight_tune?.toString() || "",
	fajr_angle: config?.fajr_angle?.toString() || "",
	maghrib_angle: config?.maghrib_angle?.toString() || "",
	isha_angle: config?.isha_angle?.toString() || "",
	shafaq: config?.shafaq?.toString() || "",
	calendar_method: config?.calendar_method?.toString() || "",
	adjustment: config?.adjustment?.toString() || "",
});

const parseOptionalNumber = (value: string) => {
	if (value.trim() === "") {
		return undefined;
	}
	return Number(value);
};

const parseOptionalEnum = <T extends string | number>(
	value: string,
	transform?: (raw: string) => T,
) => {
	if (value.trim() === "") {
		return undefined;
	}
	return transform ? transform(value) : (value as T);
};

interface MosqueConfigFormProps {
	mode: "create" | "edit";
	existingConfig?: PrayerConfigurationOut;
	calculationMethods: Record<string, string>;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function MosqueConfigForm({
	mode,
	existingConfig,
	calculationMethods,
	onSuccess,
	onCancel,
}: MosqueConfigFormProps) {
	const { mosque } = useMosque();
	const defaultCalculationMethod = useMemo(() => {
		const [firstKey] = Object.keys(calculationMethods || {});
		return firstKey;
	}, [calculationMethods]);

	const [formData, setFormData] = useState<PrayerConfigFormState>(() =>
		buildFormState(existingConfig, defaultCalculationMethod),
	);

	useEffect(() => {
		setFormData(buildFormState(existingConfig, defaultCalculationMethod));
	}, [existingConfig, defaultCalculationMethod]);

	const createMutation = useMutation(
		createPrayerConfigMutationOptions({
			onSuccess: () => {
				toast.success("Prayer configuration created successfully!");
				setFormData(buildFormState(undefined, defaultCalculationMethod));
				if (onSuccess) onSuccess();
			},
			onError: (error) => {
				toast.error("Failed to create prayer configuration");
				console.error(error);
			},
		}),
	);

	const updateMutation = useMutation(
		updateMosqueMutationOptions({
			onSuccess: () => {
				toast.success("Prayer configuration updated successfully!");
				if (onSuccess) onSuccess();
			},
			onError: (error) => {
				toast.error("Failed to update prayer configuration");
				console.error(error);
			},
		}),
	);

	const handleInputChange = (
		field: keyof PrayerConfigFormState,
		value: string | boolean,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!mosque) {
			toast.error("Please select a mosque first");
			return;
		}

		if (!formData.calculation_method) {
			toast.error("Please select a calculation method");
			return;
		}

		const calculationMethod = Number(formData.calculation_method);
		const payloadBase = {
			calculation_method: calculationMethod as CalculationMethod,
			school: parseOptionalEnum(
				formData.school,
				(raw) => Number(raw) as School,
			),
			midnight_mode: parseOptionalEnum(
				formData.midnight_mode,
				(raw) => Number(raw) as MidnightMode,
			),
			latitude_adjustment_method: parseOptionalEnum(
				formData.latitude_adjustment_method,
				(raw) => Number(raw) as LatitudeAdjustmentMethod,
			),
			tune: formData.tune,
			imsak_tune: formData.tune
				? parseOptionalNumber(formData.imsak_tune)
				: undefined,
			fajr_tune: formData.tune
				? parseOptionalNumber(formData.fajr_tune)
				: undefined,
			sunrise_tune: formData.tune
				? parseOptionalNumber(formData.sunrise_tune)
				: undefined,
			dhuhr_tune: formData.tune
				? parseOptionalNumber(formData.dhuhr_tune)
				: undefined,
			asr_tune: formData.tune
				? parseOptionalNumber(formData.asr_tune)
				: undefined,
			maghrib_tune: formData.tune
				? parseOptionalNumber(formData.maghrib_tune)
				: undefined,
			isha_tune: formData.tune
				? parseOptionalNumber(formData.isha_tune)
				: undefined,
			midnight_tune: formData.tune
				? parseOptionalNumber(formData.midnight_tune)
				: undefined,
			fajr_angle: parseOptionalNumber(formData.fajr_angle),
			maghrib_angle: parseOptionalNumber(formData.maghrib_angle),
			isha_angle: parseOptionalNumber(formData.isha_angle),
			shafaq: parseOptionalEnum(formData.shafaq, (raw) => raw as Shafaq),
			calendar_method: parseOptionalEnum(
				formData.calendar_method,
				(raw) => raw as CalendarMethod,
			),
			adjustment: parseOptionalNumber(formData.adjustment),
		};

		if (mode === "edit" && existingConfig) {
			const updatePayload: PrayerTimeConfigurationUpdate = payloadBase;
			updateMutation.mutate({
				id: existingConfig.id,
				body: updatePayload,
			});
			return;
		}

		const createPayload: PrayerConfigurationIn = {
			...payloadBase,
			mosque_id: mosque.id,
		};

		createMutation.mutate({
			query: { mosque_id: mosque.id },
			body: createPayload,
		});
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="calculation_method">Calculation Method *</Label>
					<select
						id="calculation_method"
						value={formData.calculation_method}
						onChange={(e) =>
							handleInputChange("calculation_method", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Select method</option>
						{Object.entries(calculationMethods || {}).map(([key, label]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="school">School</Label>
					<select
						id="school"
						value={formData.school}
						onChange={(e) => handleInputChange("school", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Not set</option>
						<option value="0">Shafi</option>
						<option value="1">Hanafi</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="midnight_mode">Midnight Mode</Label>
					<select
						id="midnight_mode"
						value={formData.midnight_mode}
						onChange={(e) => handleInputChange("midnight_mode", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Not set</option>
						<option value="0">Standard</option>
						<option value="1">Jafari</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="latitude_adjustment_method">
						Latitude Adjustment Method
					</Label>
					<select
						id="latitude_adjustment_method"
						value={formData.latitude_adjustment_method}
						onChange={(e) =>
							handleInputChange("latitude_adjustment_method", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Not set</option>
						<option value="1">Middle of the Night</option>
						<option value="2">One Seventh</option>
						<option value="3">Angle Based</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="shafaq">Shafaq</Label>
					<select
						id="shafaq"
						value={formData.shafaq}
						onChange={(e) => handleInputChange("shafaq", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Not set</option>
						<option value="general">General</option>
						<option value="ahmer">Ahmer</option>
						<option value="abyad">Abyad</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="calendar_method">Calendar Method</Label>
					<select
						id="calendar_method"
						value={formData.calendar_method}
						onChange={(e) =>
							handleInputChange("calendar_method", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Not set</option>
						<option value="HJCoSA">HJCoSA</option>
						<option value="UAQ">UAQ</option>
						<option value="DIYANET">DIYANET</option>
						<option value="MATHEMATICAL">MATHEMATICAL</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="adjustment">Hijri Adjustment (days)</Label>
					<Input
						id="adjustment"
						type="number"
						value={formData.adjustment}
						onChange={(e) => handleInputChange("adjustment", e.target.value)}
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<input
					id="tune"
					type="checkbox"
					checked={formData.tune}
					onChange={(e) => handleInputChange("tune", e.target.checked)}
					className="h-4 w-4"
				/>
				<Label htmlFor="tune">Enable manual tune adjustments</Label>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="space-y-2">
					<Label htmlFor="imsak_tune">Imsak Tune (min)</Label>
					<Input
						id="imsak_tune"
						type="number"
						value={formData.imsak_tune}
						onChange={(e) => handleInputChange("imsak_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="fajr_tune">Fajr Tune (min)</Label>
					<Input
						id="fajr_tune"
						type="number"
						value={formData.fajr_tune}
						onChange={(e) => handleInputChange("fajr_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="sunrise_tune">Sunrise Tune (min)</Label>
					<Input
						id="sunrise_tune"
						type="number"
						value={formData.sunrise_tune}
						onChange={(e) => handleInputChange("sunrise_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="dhuhr_tune">Dhuhr Tune (min)</Label>
					<Input
						id="dhuhr_tune"
						type="number"
						value={formData.dhuhr_tune}
						onChange={(e) => handleInputChange("dhuhr_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="asr_tune">Asr Tune (min)</Label>
					<Input
						id="asr_tune"
						type="number"
						value={formData.asr_tune}
						onChange={(e) => handleInputChange("asr_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="maghrib_tune">Maghrib Tune (min)</Label>
					<Input
						id="maghrib_tune"
						type="number"
						value={formData.maghrib_tune}
						onChange={(e) => handleInputChange("maghrib_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="isha_tune">Isha Tune (min)</Label>
					<Input
						id="isha_tune"
						type="number"
						value={formData.isha_tune}
						onChange={(e) => handleInputChange("isha_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="midnight_tune">Midnight Tune (min)</Label>
					<Input
						id="midnight_tune"
						type="number"
						value={formData.midnight_tune}
						onChange={(e) => handleInputChange("midnight_tune", e.target.value)}
						disabled={!formData.tune}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="space-y-2">
					<Label htmlFor="fajr_angle">Fajr Angle</Label>
					<Input
						id="fajr_angle"
						type="number"
						step="0.1"
						value={formData.fajr_angle}
						onChange={(e) => handleInputChange("fajr_angle", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="maghrib_angle">Maghrib Angle</Label>
					<Input
						id="maghrib_angle"
						type="number"
						step="0.1"
						value={formData.maghrib_angle}
						onChange={(e) => handleInputChange("maghrib_angle", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="isha_angle">Isha Angle</Label>
					<Input
						id="isha_angle"
						type="number"
						step="0.1"
						value={formData.isha_angle}
						onChange={(e) => handleInputChange("isha_angle", e.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-3 justify-end">
				{mode === "edit" && onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Saving..."
						: mode === "edit"
							? "Update Configuration"
							: "Create Configuration"}
				</Button>
			</div>
		</form>
	);
}
