import type { MutationOptions } from "@tanstack/react-query";
import {
	type PrayerTimeUploadOut,
	type UploadPrayerTimesData,
	uploadPrayerTimes,
} from "../gen";
import type { MutationCallbackOptions } from "../utils/types";

export const uploadPrayerTimesMuationOptions = ({
	onError,
	onSuccess,
}: MutationCallbackOptions): MutationOptions<
	PrayerTimeUploadOut | undefined,
	Error,
	UploadPrayerTimesData
> => {
	return {
		mutationFn: async ({ body, query }: UploadPrayerTimesData) => {
			const response = await uploadPrayerTimes({ body, query });
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
