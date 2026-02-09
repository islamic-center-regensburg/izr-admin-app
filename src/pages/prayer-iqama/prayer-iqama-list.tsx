import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { PrayerIqamaOut } from "../../api/gen";
import { updatePrayerIqamaMutationOptions } from "../../api/prayer_iqama/mutations";
import { PRAYER_NAMES_DISPLAY } from "../../api/prayer_iqama/validation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface PrayerIqamaListProps {
	iqamas: PrayerIqamaOut[];
	isLoading: boolean;
	onRefresh?: () => void;
}

export function PrayerIqamaList({
	iqamas,
	isLoading,
	onRefresh,
}: PrayerIqamaListProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<Record<string, unknown>>({});

	const updateMutation = useMutation(
		updatePrayerIqamaMutationOptions({
			onSuccess: () => {
				toast.success("Iqama updated successfully!");
				setEditingId(null);
				if (onRefresh) onRefresh();
			},
			onError: (error) => {
				toast.error("Failed to update iqama");
				console.error(error);
			},
		}),
	);

	const handleEditStart = (iqama: PrayerIqamaOut) => {
		setEditingId(iqama.id);
		setEditData({
			mode: iqama.mode,
			offset_minutes: iqama.offset_minutes,
			fixed_time: iqama.fixed_time,
		});
	};

	const handleEditCancel = () => {
		setEditingId(null);
		setEditData({});
	};

	const handleEditSave = (iqama: PrayerIqamaOut) => {
		const body = {
			mosque_id: iqama.mosque_id,
			prayer_name: iqama.prayer_name,
			mode: (editData.mode as string) || iqama.mode,
			offset_minutes:
				editData.mode === "offset"
					? Number(editData.offset_minutes)
					: undefined,
			fixed_time:
				editData.mode === "fixed" ? (editData.fixed_time as string) : undefined,
		};

		updateMutation.mutate({
			path: { prayer_iqama_id: iqama.id },
			body: { ...body, mode: body.mode as "offset" | "fixed" },
		});
	};

	if (isLoading) {
		return (
			<div className="text-center py-8 text-gray-500">
				Loading iqama times...
			</div>
		);
	}

	if (iqamas.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No iqama times configured. Create one using the form above.
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border border-gray-300">
				<thead className="bg-gray-50">
					<tr>
						<th className="border border-gray-300 p-3 text-left font-semibold">
							Prayer
						</th>
						<th className="border border-gray-300 p-3 text-left font-semibold">
							Mode
						</th>
						<th className="border border-gray-300 p-3 text-left font-semibold">
							Value
						</th>
						<th className="border border-gray-300 p-3 text-left font-semibold">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{iqamas.map((iqama) => (
						<tr key={iqama.id} className="hover:bg-gray-50">
							<td className="border border-gray-300 p-3">
								{PRAYER_NAMES_DISPLAY[iqama.prayer_name]}
							</td>
							<td className="border border-gray-300 p-3">
								{editingId === iqama.id ? (
									<select
										value={(editData.mode as string) || iqama.mode}
										onChange={(e) =>
											setEditData((prev: Record<string, unknown>) => ({
												...prev,
												mode: e.target.value,
											}))
										}
										className="w-full px-2 py-1 border border-gray-300 rounded"
									>
										<option value="offset">Offset</option>
										<option value="fixed">Fixed</option>
									</select>
								) : (
									<span className="capitalize">{iqama.mode}</span>
								)}
							</td>
							<td className="border border-gray-300 p-3">
								{editingId === iqama.id ? (
									editData.mode === "offset" ? (
										<Input
											type="number"
											min="-120"
											max="120"
											value={
												(editData.offset_minutes as number) ??
												iqama.offset_minutes ??
												0
											}
											onChange={(e) =>
												setEditData((prev: Record<string, unknown>) => ({
													...prev,
													offset_minutes: e.target.value,
												}))
											}
											className="w-full"
										/>
									) : (
										<Input
											type="time"
											value={
												(editData.fixed_time as string) ??
												iqama.fixed_time ??
												"06:00"
											}
											onChange={(e) =>
												setEditData((prev: Record<string, unknown>) => ({
													...prev,
													fixed_time: e.target.value,
												}))
											}
											className="w-full"
										/>
									)
								) : iqama.mode === "offset" ? (
									<span>
										{iqama.offset_minutes !== undefined
											? `${iqama.offset_minutes} min`
											: "-"}
									</span>
								) : (
									<span>{iqama.fixed_time || "-"}</span>
								)}
							</td>
							<td className="border border-gray-300 p-3 space-x-2">
								{editingId === iqama.id ? (
									<>
										<Button
											size="sm"
											onClick={() => handleEditSave(iqama)}
											disabled={updateMutation.isPending}
											variant="default"
										>
											Save
										</Button>
										<Button
											size="sm"
											onClick={handleEditCancel}
											variant="outline"
										>
											Cancel
										</Button>
									</>
								) : (
									<Button
										size="sm"
										onClick={() => handleEditStart(iqama)}
										variant="outline"
									>
										Edit
									</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
