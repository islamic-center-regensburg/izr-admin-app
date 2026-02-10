import { createFileRoute } from "@tanstack/react-router";
import MosqueConfigPage from "@/pages/mosque-config-page/mosque-config-page";
export const Route = createFileRoute("/mosque/mosque-config/")({
	component: MosqueConfigPage,
});
