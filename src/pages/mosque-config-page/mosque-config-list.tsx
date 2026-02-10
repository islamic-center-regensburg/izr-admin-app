import { Link } from "@tanstack/react-router";
import type { PrayerConfigurationOut } from "@/api/gen";
import { Button } from "@/components/ui/button";

interface MosqueConfigListProps {
	configs: PrayerConfigurationOut[];
	isLoading: boolean;
	calculationMethods: Record<string, string>;
	activeConfig: string | undefined;
	setActiveConfig: (configId: string) => void;
}

const formatValue = (value: string | number | null | undefined) =>
	value === null || value === undefined || value === "" ? "-" : value;

export function MosqueConfigList({
	configs,
	isLoading,
	calculationMethods,
	activeConfig,
	setActiveConfig,
}: MosqueConfigListProps) {
	if (isLoading) {
		return (
			<div className="text-center py-8 text-gray-500">
				Loading prayer configurations...
			</div>
		);
	}

	if (configs.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No prayer configurations found for this mosque.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4">
			{configs.map((config) => {
				const calculationMethodLabel =
					calculationMethods[config.calculation_method.toString()] ||
					config.calculation_method;

				return (
					<div
						key={config.id}
						className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4"
					>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h3 className="text-lg font-semibold">
									Config ID : <span className="font-light">{config.id}</span>
								</h3>
								<p className="text-sm text-gray-500">
									Calculation method: {calculationMethodLabel}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
							<div>
								<span className="font-medium text-gray-900">School:</span>{" "}
								{formatValue(config.school)}
							</div>
							<div>
								<span className="font-medium text-gray-900">
									Midnight mode:
								</span>{" "}
								{formatValue(config.midnight_mode)}
							</div>
							<div>
								<span className="font-medium text-gray-900">Tune:</span>{" "}
								{config.tune ? "Enabled" : "Disabled"}
							</div>
							<div>
								<span className="font-medium text-gray-900">Fajr:</span>{" "}
								{formatValue(config.fajr_tune)}
							</div>
							<div>
								<span className="font-medium text-gray-900">Isha:</span>{" "}
								{formatValue(config.isha_tune)}
							</div>
							<div>
								<span className="font-medium text-gray-900">Shafaq:</span>{" "}
								{formatValue(config.shafaq)}
							</div>
						</div>
						<div className="flex flex-row ml-auto gap-2">
							<Button asChild size="sm" variant="outline">
								<Link
									to="/mosque/mosque-config/$configId"
									params={{ configId: config.id }}
								>
									Configure
								</Link>
							</Button>
							{config.id !== activeConfig && (
								<Button onClick={() => setActiveConfig(config.id)} size="sm">
									Set Active
								</Button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
