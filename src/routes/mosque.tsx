import { createFileRoute } from "@tanstack/react-router";
import MosquePage from "@/pages/MosquePage";

export const Route = createFileRoute("/mosque")({
	component: MosquePage,
});
