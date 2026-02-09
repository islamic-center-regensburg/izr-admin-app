import { useMosque } from "@/contexts";

/**
 * Example component showing how to use the mosque context
 */
export function ExampleMosqueComponent() {
	const { mosque, isLoading, error } = useMosque();

	if (isLoading) {
		return <div>Loading mosque...</div>;
	}

	if (error) {
		return <div>Error loading mosque: {error.message}</div>;
	}

	if (!mosque) {
		return <div>No mosque found</div>;
	}

	return (
		<div>
			<h2>{mosque.name}</h2>
			<p>Mosque ID: {mosque.id}</p>
			{/* Add more mosque details as needed */}
		</div>
	);
}
