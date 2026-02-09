import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/create-event")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/events/create-event"!</div>;
}
