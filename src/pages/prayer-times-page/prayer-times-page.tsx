import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GetPrayerTimesData } from "../../api/gen";
import { getPrayerTimesQueryOptions } from "../../api/prayer_times/queries";
import { PrayerTimesQueryForm } from "./prayer-times-query-form";
import { PrayerTimesTable } from "./prayer-times-table";

function PrayerTimesPage() {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const [queryParams, setQueryParams] = useState<GetPrayerTimesData["query"]>({
		year: currentYear,
		month: currentMonth,
		day: null,
		hijri: false,
		latitude: undefined,
		longitude: undefined,
		timezone: undefined,
		hijri_adjustment: undefined,
		method: undefined,
	});

	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const {
		data: prayerTimes,
		isLoading,
		error,
	} = useQuery({
		...getPrayerTimesQueryOptions({ query: queryParams }),
		enabled: isFormSubmitted,
	});

	const handleSubmit = () => {
		setIsFormSubmitted(true);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">Prayer Times</h1>

			<PrayerTimesQueryForm
				queryParams={queryParams}
				setQueryParams={setQueryParams}
				onSubmit={handleSubmit}
			/>

			<PrayerTimesTable
				prayerTimes={prayerTimes || []}
				isLoading={isLoading}
				error={error}
				isFormSubmitted={isFormSubmitted}
			/>
		</div>
	);
}

export default PrayerTimesPage;
