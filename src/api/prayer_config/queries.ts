import { toast } from "sonner";
import {
	type GetAllPrayerConfigsData,
	getAllPrayerConfigs,
	type PaginatedResponsePrayerConfigurationOut,
} from "../gen";
import { PRAYER_CONFIG_QUERY_KEYS } from "./constants";

export const getPrayerConfigsQueryOptions = ({
	query,
}: Partial<GetAllPrayerConfigsData> = {}) => {
	return {
		queryKey: PRAYER_CONFIG_QUERY_KEYS.all({ query }),
		queryFn: async (): Promise<PaginatedResponsePrayerConfigurationOut> => {
			try {
				const response = await getAllPrayerConfigs(
					query ? { query } : undefined,
				);
				if (!response.data) {
					toast.error(
						"No prayer configs data returned. Please try again later.",
					);
					throw new Error("No prayer configs data returned");
				}
				return response.data;
			} catch (error) {
				console.error("Error fetching prayer configs:", error);
				toast.error("Failed to fetch prayer configs. Please try again later.");
				throw error;
			}
		},
	};
};
