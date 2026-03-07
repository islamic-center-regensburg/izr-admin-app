import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { MediaOut } from "@/api/gen";
import {
	deletePostMediaMutationOptions,
	uploadPostMediaMutationOptions,
} from "@/api/posts/mutations";
import { Button } from "@/components/ui/button";

interface MediaUploadZoneProps {
	translationId?: string;
	media?: Array<MediaOut> | null;
}

interface PendingPreview {
	id: string;
	url: string;
	name: string;
}

interface SelectedImagePreview {
	url: string;
	name: string;
}

const ACCEPTED_FILES = "image/*,video/*";

function MediaUploadZone({ translationId, media }: MediaUploadZoneProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [pendingPreviews, setPendingPreviews] = useState<Array<PendingPreview>>(
		[],
	);
	const [selectedImage, setSelectedImage] =
		useState<SelectedImagePreview | null>(null);

	const uploadMutation = useMutation(
		uploadPostMediaMutationOptions({
			onSuccess: () => {
				toast.success("Media uploaded successfully");
			},
			onError: (error) => {
				toast.error(`Failed to upload media: ${String(error)}`);
			},
		}),
	);

	const deleteMutation = useMutation(
		deletePostMediaMutationOptions({
			onSuccess: () => {
				toast.success("Media deleted");
			},
			onError: (error) => {
				toast.error(`Failed to delete media: ${String(error)}`);
			},
		}),
	);

	const hasSavedMedia = (media?.length ?? 0) > 0;
	const isBusy = uploadMutation.isPending || deleteMutation.isPending;

	const canUpload = Boolean(translationId);

	const allPreviewItems = useMemo(() => {
		const savedItems = (media ?? []).map((item) => ({
			id: item.object,
			url: item.url,
			name: item.object.split("/").pop() ?? "media",
			object: item.object,
			isSaved: true,
		}));

		const pendingItems = pendingPreviews.map((item) => ({
			id: item.id,
			url: item.url,
			name: item.name,
			object: "",
			isSaved: false,
		}));

		return [...savedItems, ...pendingItems];
	}, [media, pendingPreviews]);

	useEffect(() => {
		if (!selectedImage) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedImage(null);
			}
		};

		window.addEventListener("keydown", handleEscape);

		return () => {
			window.removeEventListener("keydown", handleEscape);
		};
	}, [selectedImage]);

	const clearPendingPreviews = () => {
		for (const preview of pendingPreviews) {
			URL.revokeObjectURL(preview.url);
		}
		setPendingPreviews([]);
	};

	const uploadFiles = async (files: Array<File>) => {
		if (!translationId) {
			toast.error("Save the translation first, then upload media.");
			return;
		}

		if (files.length === 0) {
			return;
		}

		const previews = files.map((file) => ({
			id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
			url: URL.createObjectURL(file),
			name: file.name,
		}));
		setPendingPreviews(previews);

		try {
			await uploadMutation.mutateAsync({
				translationId,
				body: {
					media: files,
				},
			});
		} finally {
			clearPendingPreviews();
		}
	};

	const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		await uploadFiles(files);
		event.target.value = "";
	};

	const handleDrop = async (event: DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsDragOver(false);
		const files = Array.from(event.dataTransfer.files ?? []);
		await uploadFiles(files);
	};

	const handleDeleteMedia = async (filePath: string) => {
		if (!translationId) {
			return;
		}

		await deleteMutation.mutateAsync({
			translationId,
			query: {
				file_path: filePath,
			},
		});
	};

	return (
		<div className="space-y-3">
			<div>
				<p className="text-sm font-medium">Media</p>
				<p className="text-xs text-muted-foreground">
					Upload images or videos for this translation.
				</p>
			</div>

			<button
				type="button"
				onClick={() => canUpload && inputRef.current?.click()}
				onKeyDown={(event) => {
					if (!canUpload) return;
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						inputRef.current?.click();
					}
				}}
				onDragOver={(event) => {
					event.preventDefault();
					if (canUpload) {
						setIsDragOver(true);
					}
				}}
				onDragLeave={() => setIsDragOver(false)}
				onDrop={handleDrop}
				className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
					isDragOver
						? "border-primary bg-primary/5"
						: "border-border bg-muted/30"
				} ${canUpload ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
				disabled={!canUpload || isBusy}
			>
				<div className="flex flex-col items-center text-center gap-2">
					<UploadCloud className="h-6 w-6 text-muted-foreground" />
					<p className="text-sm font-medium">
						{canUpload
							? "Drag and drop files here or click to browse"
							: "Save translation first to upload media"}
					</p>
					<p className="text-xs text-muted-foreground">
						Accepted: images and videos
					</p>
				</div>
			</button>

			<input
				ref={inputRef}
				type="file"
				accept={ACCEPTED_FILES}
				multiple
				className="hidden"
				onChange={handleFileSelection}
				disabled={!canUpload || isBusy}
			/>

			{allPreviewItems.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					{allPreviewItems.map((item) => (
						<div
							key={item.id}
							className="rounded-md border bg-background overflow-hidden"
						>
							<div className="aspect-video bg-muted/40 flex items-center justify-center overflow-hidden">
								{item.url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
									<video
										src={item.url}
										controls
										className="h-full w-full object-cover"
									>
										<track kind="captions" srcLang="en" label="captions" />
									</video>
								) : (
									<button
										type="button"
										onClick={() =>
											setSelectedImage({
												url: item.url,
												name: item.name,
											})
										}
										className="h-full w-full"
										aria-label={`Preview ${item.name}`}
									>
										<img
											src={item.url}
											alt={item.name}
											className="h-full w-full object-cover cursor-zoom-in"
											onError={(event) => {
												event.currentTarget.style.display = "none";
											}}
										/>
									</button>
								)}
							</div>
							<div className="p-2 space-y-2">
								<p className="text-xs truncate" title={item.name}>
									{item.name}
								</p>
								<div className="flex justify-end">
									{item.isSaved ? (
										<Button
											size="xs"
											variant="destructive"
											onClick={(event) => {
												event.stopPropagation();
												handleDeleteMedia(item.object);
											}}
											disabled={isBusy}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									) : (
										<Button size="xs" variant="outline" disabled>
											<ImagePlus className="h-3 w-3 mr-1" />
											Uploading...
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedImage && (
				<div
					className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
					onMouseDown={() => setSelectedImage(null)}
				>
					<div
						className="relative max-w-5xl w-full max-h-[90vh]"
						onMouseDown={(event) => event.stopPropagation()}
					>
						<Button
							type="button"
							variant="secondary"
							size="icon-sm"
							className="absolute top-2 right-2 z-10"
							onClick={() => setSelectedImage(null)}
						>
							<X className="h-4 w-4" />
						</Button>
						<img
							src={selectedImage.url}
							alt={selectedImage.name}
							className="w-full h-full max-h-[90vh] object-contain rounded-md"
						/>
					</div>
				</div>
			)}

			{!hasSavedMedia && pendingPreviews.length === 0 && (
				<p className="text-xs text-muted-foreground">No media uploaded yet.</p>
			)}
		</div>
	);
}

export default MediaUploadZone;
