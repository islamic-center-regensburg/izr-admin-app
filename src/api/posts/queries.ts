import { toast } from "sonner";
import {
	type GetAllPostsData,
	getAllPosts,
	getPost,
	type PaginatedResponsePostOut,
	type PostOut,
} from "../gen";
import { POSTS_QUERY_KEYS } from "./constants";

export const getPostsQueryOptions = (
	mosque_id: string | undefined,
	query: GetAllPostsData["query"],
) => {
	return {
		queryKey: POSTS_QUERY_KEYS.all({ mosque_id: mosque_id, ...query }),
		queryFn: async (): Promise<PaginatedResponsePostOut> => {
			try {
				const response = await getAllPosts({
					path: { mosque_id: mosque_id ?? "" },
					query,
				});
				if (!response.data) {
					toast.error("No posts data returned. Please try again later.");
					throw new Error("No posts data returned");
				}
				return response.data;
			} catch (error) {
				console.error("Error fetching posts:", error);
				toast.error("Failed to fetch posts. Please try again later.");
				throw error;
			}
		},
		enabled: !!mosque_id, // Only run this query if mosque_id is defined
	};
};

export const getPostByIdQueryOptions = (postId: string) => {
	return {
		queryKey: POSTS_QUERY_KEYS.byId(postId),
		queryFn: async (): Promise<PostOut> => {
			try {
				const response = await getPost({ path: { post_id: postId } });
				if (!response.data) {
					toast.error("No post data returned. Please try again later.");
					throw new Error("No post data returned");
				}
				return response.data;
			} catch (error) {
				console.error("Error fetching post:", error);
				toast.error("Failed to fetch post. Please try again later.");
				throw error;
			}
		},
	};
};
