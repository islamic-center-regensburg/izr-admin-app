import { createFileRoute } from "@tanstack/react-router";
import MosquePage from "@/pages/mosque-page";

export const Route = createFileRoute("/mosque")({
	component: MosquePage,
});
