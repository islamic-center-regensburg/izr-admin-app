import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GetPrayerTimesForMosqueData } from "../../api/gen";
import { getPrayerTimesForMosqueQueryOptions } from "../../api/prayer_times/queries";
import { useMosque } from "../../contexts";
import { MosquePrayerTimesQueryForm } from "./mosque-prayer-times-query-form";
import { MosquePrayerTimesTable } from "./mosque-prayer-times-table";

export function MosquePrayerTimes() {
	const { mosque } = useMosque();
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const [queryParams, setQueryParams] = useState<
		GetPrayerTimesForMosqueData["query"]
	>({
		year: currentYear,
		month: currentMonth,
		day: null,
		hijri: false,
		source: undefined,
	});

	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const {
		data: prayerTimes,
		isLoading,
		refetch,
		error,
	} = useQuery(
		getPrayerTimesForMosqueQueryOptions({
			query: queryParams,
			mosque_id: mosque?.id || "",
		}),
	);

	const handleSubmit = () => {
		setIsFormSubmitted(true);
		refetch();
	};

	if (!mosque) {
		return (
			<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
				Please select a mosque first.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Prayer Times for {mosque.name}</h2>
				<p className="text-gray-600 mt-2">
					{mosque.address}, {mosque.city}, {mosque.country}
				</p>
			</div>

			<MosquePrayerTimesQueryForm
				queryParams={queryParams}
				setQueryParams={setQueryParams}
				onSubmit={handleSubmit}
			/>

			<MosquePrayerTimesTable
				prayerTimes={prayerTimes || []}
				isLoading={isLoading}
				error={error}
				isFormSubmitted={isFormSubmitted}
			/>
		</div>
	);
}
