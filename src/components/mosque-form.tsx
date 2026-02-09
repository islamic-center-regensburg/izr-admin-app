import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateMosqueMutationOptions } from "@/api/mosque/mutations";
import { MosqueFormSchema } from "@/api/mosque/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMosque } from "@/contexts";

export function MosqueForm() {
	const { mosque, isLoading } = useMosque();
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		city: "",
		country: "",
		latitude: 0,
		longitude: 0,
		timezone: "",
	});

	const [isEditing, setIsEditing] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof typeof formData, string>>
	>({});

	// Initialize form with mosque data
	useEffect(() => {
		if (mosque) {
			setFormData({
				name: mosque.name || "",
				address: mosque.address || "",
				city: mosque.city || "",
				country: mosque.country || "",
				latitude: mosque.latitude || 0,
				longitude: mosque.longitude || 0,
				timezone: mosque.timezone || "",
			});
		}
	}, [mosque]);

	const updateMutation = useMutation(
		updateMosqueMutationOptions({
			onSuccess: () => {
				toast.success("Mosque updated successfully!");
				setIsEditing(false);
			},
			onError: (error) => {
				toast.error("Failed to update mosque");
				console.error(error);
			},
		}),
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const processedValue =
			name === "latitude" || name === "longitude" ? parseFloat(value) : value;
		setFormData((prev) => ({
			...prev,
			[name]: processedValue,
		}));
		// Clear error for this field when user starts typing
		if (errors[name as keyof typeof formData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		if (!mosque) return;

		// Validate form data with Zod
		const result = MosqueFormSchema.safeParse(formData);

		if (!result.success) {
			// Set errors from Zod validation
			const newErrors: Partial<Record<keyof typeof formData, string>> = {};
			result.error.errors.forEach((error) => {
				const path = error.path[0] as keyof typeof formData;
				newErrors[path] = error.message;
			});
			setErrors(newErrors);
			toast.error("Please fix the validation errors");
			return;
		}

		// Clear errors on successful validation
		setErrors({});

		updateMutation.mutate({
			id: mosque.id,
			body: result.data,
		});
	};

	if (isLoading) {
		return <div className="text-center py-8">Loading mosque data...</div>;
	}

	if (!mosque) {
		return <div className="text-center py-8">No mosque found</div>;
	}

	return (
		<div className="w-full max-w-2xl mx-auto p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold">{mosque.name}</h1>
				{!isEditing && (
					<Button
						onClick={() => {
							setIsEditing(true);
							setErrors({});
						}}
						variant="outline"
					>
						Edit
					</Button>
				)}
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name}</p>
						)}
					</div>

					{/* City */}
					<div className="space-y-2">
						<Label htmlFor="city">City</Label>
						<Input
							id="city"
							name="city"
							value={formData.city}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.city ? "border-red-500" : ""}
						/>
						{errors.city && (
							<p className="text-sm text-red-500">{errors.city}</p>
						)}
					</div>

					{/* Address */}
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.address ? "border-red-500" : ""}
						/>
						{errors.address && (
							<p className="text-sm text-red-500">{errors.address}</p>
						)}
					</div>

					{/* Country */}
					<div className="space-y-2">
						<Label htmlFor="country">Country</Label>
						<Input
							id="country"
							name="country"
							value={formData.country}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.country ? "border-red-500" : ""}
						/>
						{errors.country && (
							<p className="text-sm text-red-500">{errors.country}</p>
						)}
					</div>

					{/* Timezone */}
					<div className="space-y-2">
						<Label htmlFor="timezone">Timezone</Label>
						<Input
							id="timezone"
							name="timezone"
							value={formData.timezone}
							onChange={handleInputChange}
							disabled={!isEditing}
							placeholder="e.g., Europe/Berlin"
							className={errors.timezone ? "border-red-500" : ""}
						/>
						{errors.timezone && (
							<p className="text-sm text-red-500">{errors.timezone}</p>
						)}
					</div>

					{/* Latitude */}
					<div className="space-y-2">
						<Label htmlFor="latitude">Latitude</Label>
						<Input
							id="latitude"
							name="latitude"
							type="number"
							step="0.000001"
							value={formData.latitude}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.latitude ? "border-red-500" : ""}
						/>
						{errors.latitude && (
							<p className="text-sm text-red-500">{errors.latitude}</p>
						)}
					</div>

					{/* Longitude */}
					<div className="space-y-2">
						<Label htmlFor="longitude">Longitude</Label>
						<Input
							id="longitude"
							name="longitude"
							type="number"
							step="0.000001"
							value={formData.longitude}
							onChange={handleInputChange}
							disabled={!isEditing}
							className={errors.longitude ? "border-red-500" : ""}
						/>
						{errors.longitude && (
							<p className="text-sm text-red-500">{errors.longitude}</p>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				{isEditing && (
					<div className="flex gap-3 justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsEditing(false);
								setErrors({});
							}}
							disabled={updateMutation.isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={updateMutation.isPending}>
							{updateMutation.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}
			</form>
		</div>
	);
}
