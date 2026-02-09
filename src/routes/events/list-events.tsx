import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/list-events")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/events/list-events"!</div>;
}
