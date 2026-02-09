import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MosqueProvider } from "@/contexts/mosque-context";

export function getContext() {
	const queryClient = new QueryClient();
	const mosque_name = "Islamisches Zentrum Regensburg";

	return {
		queryClient,
		mosque_name,
	};
}

export function Provider({
	children,
	queryClient,
	mosque_name,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
	mosque_name: string;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<MosqueProvider mosque_name={mosque_name}>{children}</MosqueProvider>
		</QueryClientProvider>
	);
}
