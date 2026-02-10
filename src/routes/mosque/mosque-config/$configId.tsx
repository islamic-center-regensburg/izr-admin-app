import { createFileRoute } from "@tanstack/react-router";
import MosqueConfigEditPage from "@/pages/mosque-config-edit-page/mosque-config-edit-page";

export const Route = createFileRoute("/mosque/mosque-config/$configId")({
	component: MosqueConfigEditPage,
});
