import { useQueryClient } from "@tanstack/react-query";
import {
	type CreateEventData,
	type CreateTranslationForEventData,
	createEvent,
	createTranslationForEvent,
} from "../gen";
import type { MutationCallbackOptions } from "../utils/types";
import { EVENT_QUERY_KEYS } from "./constants";

export const createEventMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({ query }: CreateEventData) => {
			const response = await createEvent({ query: query });
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating event:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEYS.root] });
		},
	};
};

export const createEventTranslationMutationOptions = ({
	onSuccess,
	onError,
}: MutationCallbackOptions) => {
	const queryClient = useQueryClient();
	return {
		mutationFn: async ({
			query,
			body,
			path: event_id,
		}: CreateTranslationForEventData) => {
			const response = await createTranslationForEvent({
				query: query,
				body: body,
				path: event_id,
			});
			return response.data;
		},
		onSuccess: () => {
			if (onSuccess) onSuccess();
		},
		onError: (error: unknown) => {
			console.error("Error creating event translation:", error);
			if (onError) onError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEYS.root] });
		},
	};
};
