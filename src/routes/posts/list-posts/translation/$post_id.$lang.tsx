import { createFileRoute } from "@tanstack/react-router";
import PostTranslationPage from "@/pages/post-translation-page/post-translation-page";

export const Route = createFileRoute(
	"/posts/list-posts/translation/$post_id/$lang",
)({
	component: PostTranslationPage,
});
