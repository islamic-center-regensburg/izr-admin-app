import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPrayerIqamaQueryOptions } from "../../api/prayer_iqama/queries";
import { useMosque } from "../../contexts";
import { PrayerIqamaForm } from "./prayer-iqama-form";
import { PrayerIqamaList } from "./prayer-iqama-list";

function PrayerIqama() {
	const { mosque } = useMosque();
	const [refetchKey, setRefetchKey] = useState(0);

	const {
		data: iqamas,
		isLoading,
		refetch,
	} = useQuery(getPrayerIqamaQueryOptions(mosque?.id || ""));

	const handleFormSuccess = () => {
		refetch();
		setRefetchKey((prev) => prev + 1);
	};

	if (!mosque) {
		return (
			<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
				Please select a mosque first.
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Prayer Iqama Times</h1>
				<p className="text-gray-600 mt-2">
					Configure iqama times for {mosque.name}
				</p>
			</div>

			<div className="flex flex-col gap-5">
				{/* List Section */}
				<div className="lg:col-span-2">
					<h2 className="text-xl font-semibold mb-4">
						Current Iqama Configuration
					</h2>
					<PrayerIqamaList
						iqamas={iqamas || []}
						isLoading={isLoading}
						onRefresh={refetch}
					/>
				</div>
				{/* Form Section */}
				<div className="lg:col-span-1">
					<h2 className="text-xl font-semibold mb-4">Add New Iqama Time</h2>
					<PrayerIqamaForm key={refetchKey} onSuccess={handleFormSuccess} />
				</div>
			</div>
		</div>
	);
}

export default PrayerIqama;
