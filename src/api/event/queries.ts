import { toast } from "sonner";
import { type GetAllEventsData, getAllEvents } from "../gen";
import { EVENT_QUERY_KEYS } from "./constants";

interface GetAllEventsForMosqueQueryOptionsInterface {
	mosque_id: string;
	query: GetAllEventsData["query"];
}

export const getAllEventsForMosqueQueryOptions = ({
	mosque_id,
	query,
}: GetAllEventsForMosqueQueryOptionsInterface) => {
	return {
		queryKey: EVENT_QUERY_KEYS.byId(mosque_id, query),
		queryFn: async () => {
			const response = await getAllEvents({
				query: query,
				path: { mosque_id },
			});
			if (!response.data) {
				toast.error("No events data returned. Please try again later.");
				throw new Error("No events data returned");
			}
			return response;
		},
		enabled: Boolean(mosque_id),
	};
};
