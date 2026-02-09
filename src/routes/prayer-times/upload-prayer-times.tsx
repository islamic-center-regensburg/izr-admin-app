import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prayer-times/upload-prayer-times")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/prayer-times/upload-prayer-times"!</div>;
}
