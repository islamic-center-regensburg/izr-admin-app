import type { GetAllPostsData } from "../gen";
import { buildQueryKey, buildQueryKeyWithPath } from "../utils/buildQueryKey";

const ROOT_QUERY_KEY = "posts";
export const POSTS_QUERY_KEYS = {
	root: ROOT_QUERY_KEY,
	all: ({
		mosque_id,
		...query
	}: Partial<GetAllPostsData> & { mosque_id?: string }) =>
		buildQueryKey(ROOT_QUERY_KEY, { mosque_id, ...query }),
	byId: (id: string) =>
		buildQueryKeyWithPath(ROOT_QUERY_KEY, { path: "post_id", value: id }),
};
