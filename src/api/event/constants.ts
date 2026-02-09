import type { GetAllEventsData } from "../gen";
import { buildQueryKey, buildQueryKeyWithPath } from "../utils/buildQueryKey";

const ROOT_QUERY_KEY: string = "events";
export const EVENT_QUERY_KEYS = {
	root: ROOT_QUERY_KEY,
	all: ({ query }: { query: GetAllEventsData["query"] }) =>
		buildQueryKey(ROOT_QUERY_KEY, query),
	byId: (id: string, query: GetAllEventsData["query"]) =>
		buildQueryKeyWithPath(
			ROOT_QUERY_KEY,
			{
				path: "event_id",
				value: id,
			},
			query,
		),
};
