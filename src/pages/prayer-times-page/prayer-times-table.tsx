import type { PrayerTimesOut } from "../../api/gen";

interface PrayerTimesTableProps {
	prayerTimes: PrayerTimesOut[];
	isLoading: boolean;
	error: Error | null;
	isFormSubmitted: boolean;
}

export function PrayerTimesTable({
	prayerTimes,
	isLoading,
	error,
	isFormSubmitted,
}: PrayerTimesTableProps) {
	if (isLoading) {
		return <div className="text-center py-8">Loading prayer times...</div>;
	}

	if (error) {
		return (
			<div className="border border-red-300 rounded-lg p-4 bg-red-50 text-red-700">
				Error loading prayer times. Please try again.
			</div>
		);
	}

	if (isFormSubmitted && prayerTimes.length === 0) {
		return (
			<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
				No prayer times found for the selected parameters.
			</div>
		);
	}

	if (!prayerTimes || prayerTimes.length === 0) {
		return null;
	}

	return (
		<div className="border rounded-lg bg-white shadow-sm overflow-hidden">
			<h2 className="text-xl font-semibold p-6 border-b">
				Prayer Times Results
			</h2>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Gregorian Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Hijri Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Fajr
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Shuruq
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Dhuhr
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Asr
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Maghrib
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Isha
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{prayerTimes.map((prayerTime) => (
							<tr key={prayerTime.gregorian_date} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.gregorian_date}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.hijri_date}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.fajr}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.shuruq}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.dhuhr}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.asr}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.maghrib}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{prayerTime.isha}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
				Total: {prayerTimes.length} prayer time
				{prayerTimes.length !== 1 ? "s" : ""}
			</div>
		</div>
	);
}
