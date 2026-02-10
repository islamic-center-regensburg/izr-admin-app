import { createFileRoute } from "@tanstack/react-router";
import MosquePage from "@/pages/mosque-details-page/mosque-page";

export const Route = createFileRoute("/mosque/mosque-details")({
	component: MosquePage,
});
