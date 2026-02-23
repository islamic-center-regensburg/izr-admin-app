import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/posts/list-posts/translation/$lang/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/posts/list-posts/translation/$lang"!</div>;
}
