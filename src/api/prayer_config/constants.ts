import type { GetAllMosquesData } from "../gen";
import { buildQueryKey, buildQueryKeyWithPath } from "../utils/buildQueryKey";

const ROOT_QUERY_KEY: string = "prayer-config";
export const PRAYER_CONFIG_QUERY_KEYS = {
	root: ROOT_QUERY_KEY,
	all: ({ query }: Partial<GetAllMosquesData>) =>
		buildQueryKey(ROOT_QUERY_KEY, query),
	byId: (id: string) =>
		buildQueryKeyWithPath(ROOT_QUERY_KEY, {
			path: "prayer_config_id",
			value: id,
		}),
};
