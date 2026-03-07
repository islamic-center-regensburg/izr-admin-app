import { createFileRoute } from "@tanstack/react-router";
import PostsListPage from "@/pages/posts-list-page/posts-list-page";

export const Route = createFileRoute("/posts/list-posts/")({
	component: PostsListPage,
});
