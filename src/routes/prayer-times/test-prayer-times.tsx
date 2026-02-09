import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prayer-times/test-prayer-times")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/prayer-times/test-prayer-times"!</div>;
}
