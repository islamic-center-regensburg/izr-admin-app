import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/list-posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/events/list-events"!</div>;
}
