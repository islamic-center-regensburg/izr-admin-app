import { type UploadPrayerTimesData, uploadPrayerTimes } from "../gen";
import type { MutationCallbackOptions } from "../utils/types";

export const uploadPrayerTimesMuationOptions = ({
	onError,
	onSuccess,
}: MutationCallbackOptions) => {
	return {
		mutationFn: async ({ body, query }: Partial<UploadPrayerTimesData>) => {
			const response = await uploadPrayerTimes({
				query: query as UploadPrayerTimesData["query"],
				body: body as UploadPrayerTimesData["body"],
			});

			if (response.error) {
				throw response.error;
			}
			return response.data;
		},

		onSuccess: () => {
			if (onSuccess) onSuccess();
		},

		onError: (error: unknown) => {
			console.error("Error uploading prayer times:", error);
			if (onError) onError(error);
		},
	};
};
