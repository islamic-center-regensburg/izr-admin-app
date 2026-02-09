import { useQueryClient } from "@tanstack/react-query";
import {
	type CreatePrayerIqamaData,
	createPrayerIqama,
	type UpdatePrayerIqamaData,
	updatePrayerIqama,
} from "../gen";
import type { MutationCallbackOptions } from "../utils/types";
import { PRAYER_IQAMA_QUERY_KEYS } from "./constants";

export const createPrayerIqamaMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({ body }: Partial<CreatePrayerIqamaData>) => {
			const response = await createPrayerIqama({
				body: body as CreatePrayerIqamaData["body"],
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating prayer iqama:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [PRAYER_IQAMA_QUERY_KEYS.root],
			});
		},
	};
};

export const updatePrayerIqamaMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({ body, path }: Partial<UpdatePrayerIqamaData>) => {
			const response = await updatePrayerIqama({
				body: body as UpdatePrayerIqamaData["body"],
				path: path as UpdatePrayerIqamaData["path"],
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error updating prayer iqama:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [PRAYER_IQAMA_QUERY_KEYS.root],
			});
		},
	};
};
