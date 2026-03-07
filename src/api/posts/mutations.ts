import { useQueryClient } from "@tanstack/react-query";
import {
	type CreatePostData,
	type CreateTranslationForPostData,
	createPost,
	createTranslationForPost,
	type DeletePostMediaData,
	deletePost,
	deletePostMedia,
	deleteTranslationForPost,
	type UpdateTranslationForPostData,
	type UploadPostMediaData,
	updateTranslationForPost,
	uploadPostMedia,
} from "../gen";
import type { MutationCallbackOptions } from "../utils/types";
import { POSTS_QUERY_KEYS } from "./constants";

export const createPostMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async (query: CreatePostData["query"]) => {
			const response = await createPost({ query: query });
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating post:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const deletePostMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async (postId: string) => {
			const response = await deletePost({ path: { post_id: postId } });
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error deleting post:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const createTranslationForPostMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			post_id,
			query,
			body,
		}: {
			post_id: string;
			query: CreateTranslationForPostData["query"];
			body: string | undefined;
		}) => {
			const response = await createTranslationForPost({
				path: { post_id: post_id },
				body: body,
				query: query,
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating translation:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const updateTranslationForPostMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			postId,
			translationId,
			body,
			query,
		}: {
			postId: string;
			translationId: string;
			body: string | undefined;
			query: UpdateTranslationForPostData["query"];
		}) => {
			const response = await updateTranslationForPost({
				path: { post_id: postId, translation_id: translationId },
				body: body,
				query: query,
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error updating translation:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const deleteTranslationForPostMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			postId,
			translationId,
		}: {
			postId: string;
			translationId: string;
		}) => {
			const response = await deleteTranslationForPost({
				path: { post_id: postId, translation_id: translationId },
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error deleting translation:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const uploadPostMediaMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			translationId,
			body,
		}: {
			translationId: string;
			body: UploadPostMediaData["body"];
		}) => {
			const response = await uploadPostMedia({
				path: { translation_id: translationId },
				body: body,
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error uploading media:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};

export const deletePostMediaMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			translationId,
			query,
		}: {
			translationId: string;
			query: DeletePostMediaData["query"];
		}) => {
			const response = await deletePostMedia({
				path: { translation_id: translationId },
				query: query,
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error deleting media:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.root] });
		},
	};
};
