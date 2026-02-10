import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { getCalculationMethods } from "@/api/gen";
import { updateMosqueMutationOptions } from "@/api/mosque/mutations";
import { getPrayerConfigsQueryOptions } from "@/api/prayer_config/queries";
import { Button } from "@/components/ui/button";
import { useMosque } from "@/contexts";
import { MosqueConfigList } from "./mosque-config-list";

function MosqueConfigPage() {
	const { mosque } = useMosque();

	const { data: prayerConfigs, isLoading } = useQuery(
		getPrayerConfigsQueryOptions({
			query: { mosque_id: mosque?.id || undefined },
		}),
	);

	const { data: calculationMethods } = useQuery({
		queryKey: ["prayer-configs", "calculation-methods"],
		queryFn: async () => {
			const response = await getCalculationMethods();
			return response.data || {};
		},
	});

	const mosqueMutation = useMutation(
		updateMosqueMutationOptions({
			onSuccess: () => toast.success("Config Id set Successfully"),
			onError: (error) =>
				toast.error(`Config Id could not be set, error : ${error}`),
		}),
	);

	const handleSetActiveConfig = (configId: string) => {
		if (mosque?.id) {
			mosqueMutation.mutate({
				id: mosque?.id,
				body: { prayer_config_id: configId },
			});
		}
	};

	if (!mosque) {
		return (
			<div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-600">
				Please select a mosque first.
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Prayer Configuration</h1>
					<p className="text-gray-600 mt-2">
						Select a configuration to edit for {mosque.name}
					</p>
				</div>
				<Button asChild>
					<Link
						to="/mosque/mosque-config/$configId"
						params={{ configId: "new" }}
					>
						Create configuration
					</Link>
				</Button>
			</div>

			<MosqueConfigList
				configs={prayerConfigs?.data || []}
				isLoading={isLoading}
				calculationMethods={calculationMethods || {}}
				activeConfig={mosque.prayer_config_id ?? ""}
				setActiveConfig={handleSetActiveConfig}
			/>
		</div>
	);
}

export default MosqueConfigPage;
