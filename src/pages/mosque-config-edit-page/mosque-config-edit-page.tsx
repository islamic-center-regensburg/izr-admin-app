import { useParams } from "@tanstack/react-router";
import { MosqueConfigFormPage } from "../mosque-config-page/mosque-config-form-page";

function MosqueConfigEditPage() {
	const { configId } = useParams({ from: "/mosque/mosque-config/$configId" });
	console.log("config id", configId);
	return <MosqueConfigFormPage configId={configId} />;
}

export default MosqueConfigEditPage;
