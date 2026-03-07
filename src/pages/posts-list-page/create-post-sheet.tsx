import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { PostContentType } from "@/api/gen";
import { createPostMutationOptions } from "@/api/posts/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const CONTENT_TYPES: PostContentType[] = ["event", "info", "announcement"];

interface CreatePostSheetProps {
	mosqueId?: string;
}

function CreatePostSheet({ mosqueId }: CreatePostSheetProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [validToDate, setValidToDate] = useState("");
	const [contentType, setContentType] = useState<PostContentType>("info");

	const createPostMutation = useMutation(
		createPostMutationOptions({
			onSuccess: () => {
				toast.success("Post created");
			},
			onError: (mutationError) => {
				toast.error(`Failed to create post: ${String(mutationError)}`);
			},
		}),
	);

	const isCreating = createPostMutation.isPending;

	const resetForm = () => {
		setValidToDate("");
		setContentType("info");
	};

	const handleClose = () => {
		setIsOpen(false);
		resetForm();
	};

	const handleCreatePost = async () => {
		if (!mosqueId) {
			toast.error("No mosque selected");
			return;
		}

		try {
			await createPostMutation.mutateAsync({
				mosque_id: mosqueId,
				content_type: contentType,
				valid_to: validToDate || null,
			});

			handleClose();
			toast.success("New post created successfully");
		} catch (createError) {
			toast.error(`Could not create new post: ${String(createError)}`);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button>Create New Post</Button>
			</SheetTrigger>
			<SheetContent side="right" className="sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Create New Post</SheetTitle>
					<SheetDescription>
						Set the validation day and content type.
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-4 px-4">
					<div className="space-y-2">
						<Label htmlFor="new-post-valid-to">Validation day</Label>
						<Input
							id="new-post-valid-to"
							type="date"
							value={validToDate}
							onChange={(event) => setValidToDate(event.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="new-post-content-type">Content type</Label>
						<select
							id="new-post-content-type"
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-1"
							value={contentType}
							onChange={(event) =>
								setContentType(event.target.value as PostContentType)
							}
						>
							{CONTENT_TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>
				</div>

				<SheetFooter>
					<Button variant="outline" onClick={handleClose} disabled={isCreating}>
						Cancel
					</Button>
					<Button onClick={handleCreatePost} disabled={isCreating}>
						{isCreating ? "Creating..." : "Create"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

export default CreatePostSheet;
