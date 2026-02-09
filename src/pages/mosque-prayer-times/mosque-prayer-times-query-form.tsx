import type React from "react";
import { toast } from "sonner";
import type { GetPrayerTimesForMosqueData } from "../../api/gen";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface MosquePrayerTimesQueryFormProps {
	queryParams: GetPrayerTimesForMosqueData["query"];
	setQueryParams: React.Dispatch<
		React.SetStateAction<GetPrayerTimesForMosqueData["query"]>
	>;
	onSubmit: () => void;
}

export function MosquePrayerTimesQueryForm({
	queryParams,
	setQueryParams,
	onSubmit,
}: MosquePrayerTimesQueryFormProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting form with params:", queryParams);
		if (!queryParams.year) {
			toast.error("Year is required");
			return;
		}

		onSubmit();
	};

	const handleInputChange = (
		field: keyof GetPrayerTimesForMosqueData["query"],
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

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="source">Source</Label>
					<select
						id="source"
						value={queryParams.source || ""}
						onChange={(e) =>
							setQueryParams((prev) => ({
								...prev,
								source: (e.target.value || undefined) as
									| "api"
									| "stored"
									| undefined,
							}))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Select source (optional)</option>
						<option value="api">API</option>
						<option value="stored">Stored</option>
					</select>
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

			<Button onClick={handleSubmit} type="submit" className="w-full md:w-auto">
				Fetch Prayer Times
			</Button>
		</form>
	);
}
