import type React from "react";
import { toast } from "sonner";
import type { GetPrayerTimesData } from "../../api/gen";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface PrayerTimesQueryFormProps {
	queryParams: GetPrayerTimesData["query"];
	setQueryParams: React.Dispatch<
		React.SetStateAction<GetPrayerTimesData["query"]>
	>;
	onSubmit: () => void;
}

export function PrayerTimesQueryForm({
	queryParams,
	setQueryParams,
	onSubmit,
}: PrayerTimesQueryFormProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!queryParams.year) {
			toast.error("Year is required");
			return;
		}

		onSubmit();
	};

	const handleInputChange = (
		field: keyof GetPrayerTimesData["query"],
		value: string,
	) => {
		const numValue = value === "" ? undefined : Number(value);

		setQueryParams((prev) => ({
			...prev,
			[field]: numValue,
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-xl font-semibold mb-4">Query Parameters</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="year">Year *</Label>
					<Input
						id="year"
						type="number"
						required
						value={queryParams.year || ""}
						onChange={(e) => handleInputChange("year", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="month">Month</Label>
					<Input
						id="month"
						type="number"
						min="1"
						max="12"
						placeholder="1-12"
						value={queryParams.month || ""}
						onChange={(e) => handleInputChange("month", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="day">Day</Label>
					<Input
						id="day"
						type="number"
						min="1"
						max="31"
						placeholder="1-31"
						value={queryParams.day || ""}
						onChange={(e) => handleInputChange("day", e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="latitude">Latitude</Label>
					<Input
						id="latitude"
						type="number"
						step="any"
						placeholder="e.g., 49.0134"
						value={queryParams.latitude || ""}
						onChange={(e) => handleInputChange("latitude", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="longitude">Longitude</Label>
					<Input
						id="longitude"
						type="number"
						step="any"
						placeholder="e.g., 12.1016"
						value={queryParams.longitude || ""}
						onChange={(e) => handleInputChange("longitude", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="timezone">Timezone</Label>
					<Input
						id="timezone"
						type="text"
						placeholder="e.g., Europe/Berlin"
						value={queryParams.timezone || ""}
						onChange={(e) =>
							setQueryParams((prev) => ({
								...prev,
								timezone: e.target.value || undefined,
							}))
						}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="hijri_adjustment">Hijri Adjustment</Label>
					<Input
						id="hijri_adjustment"
						type="number"
						placeholder="e.g., 0"
						value={queryParams.hijri_adjustment || ""}
						onChange={(e) =>
							handleInputChange("hijri_adjustment", e.target.value)
						}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="method">Calculation Method</Label>
					<Input
						id="method"
						type="number"
						placeholder="e.g., 3"
						value={queryParams.method || ""}
						onChange={(e) => handleInputChange("method", e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="hijri">Hijri</Label>
					<div className="flex items-center h-10">
						<input
							id="hijri"
							type="checkbox"
							checked={queryParams.hijri || false}
							onChange={(e) =>
								setQueryParams((prev) => ({
									...prev,
									hijri: e.target.checked,
								}))
							}
							className="w-4 h-4 rounded"
						/>
					</div>
				</div>
			</div>

			<Button type="submit" className="w-full md:w-auto">
				Fetch Prayer Times
			</Button>
		</form>
	);
}
