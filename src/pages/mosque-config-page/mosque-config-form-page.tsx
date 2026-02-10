import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getCalculationMethods } from "@/api/gen";
import { getPrayerConfigsQueryOptions } from "@/api/prayer_config/queries";
import { Button } from "@/components/ui/button";
import { useMosque } from "@/contexts";
import { MosqueConfigForm } from "./mosque-config-form";

interface MosqueConfigFormPageProps {
	configId: string;
}

export function MosqueConfigFormPage({ configId }: MosqueConfigFormPageProps) {
	const { mosque } = useMosque();
	const isCreateMode = configId === "new";

	const { data: calculationMethods } = useQuery({
		queryKey: ["prayer-configs", "calculation-methods"],
		queryFn: async () => {
			const response = await getCalculationMethods();
			return response.data || {};
		},
	});

	const configQuery = getPrayerConfigsQueryOptions({
		query: { id: isCreateMode ? undefined : configId },
	});

	const { data: configResponse, isLoading: isConfigLoading } = useQuery({
		...configQuery,
		enabled: !isCreateMode,
	});

	const config = configResponse?.data?.[0];

	if (!mosque) {
		return (
			<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
				Please select a mosque first.
			</div>
		);
	}

	if (!isCreateMode && isConfigLoading) {
		return (
			<div className="text-center py-8 text-gray-500">
				Loading configuration...
			</div>
		);
	}

	if (!isCreateMode && !config) {
		return (
			<div className="space-y-4">
				<Button asChild variant="outline">
					<Link to="/mosque/mosque-config">Back to configurations</Link>
				</Button>
				<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
					Config not found.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Button asChild variant="outline">
				<Link to="/mosque/mosque-config">Back to configurations</Link>
			</Button>

			<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
				<h1 className="text-2xl font-bold">
					{isCreateMode ? "Create Configuration" : "Edit Configuration"}
				</h1>
				<p className="text-gray-600 mt-2">
					{isCreateMode
						? `Add a new prayer configuration for ${mosque.name}.`
						: `Update configuration ${config?.id} for ${mosque.name}.`}
				</p>

				<div className="mt-6">
					<MosqueConfigForm
						mode={isCreateMode ? "create" : "edit"}
						existingConfig={config}
						calculationMethods={calculationMethods || {}}
					/>
				</div>
			</div>
		</div>
	);
}
