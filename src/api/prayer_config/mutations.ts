import { useQueryClient } from "@tanstack/react-query";
import {
	addPrayerConfig,
	type PrayerConfigurationIn,
	type PrayerTimeConfigurationUpdate,
	updatePrayerConfig,
} from "../gen";
import type { MutationCallbackOptions } from "../utils/types";
import { PRAYER_CONFIG_QUERY_KEYS } from "./constants";

export const createPrayerConfigMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();

	return {
		mutationFn: async (mosque_id: string, body: PrayerConfigurationIn) => {
			const response = await addPrayerConfig({
				body: body,
				query: { mosque_id },
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating prayer configuration:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [PRAYER_CONFIG_QUERY_KEYS.root],
			});
		},
	};
};

interface updateMosqueMutationInterface {
	id: string;
	body: PrayerTimeConfigurationUpdate;
}
export const updateMosqueMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({ id, body }: updateMosqueMutationInterface) => {
			const response = await updatePrayerConfig({
				body: body,
				path: { prayer_config_id: id },
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error updating mosque:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [PRAYER_CONFIG_QUERY_KEYS.root],
			});
		},
	};
};
