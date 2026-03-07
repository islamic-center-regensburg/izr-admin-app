import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	createTranslationForPostMutationOptions,
	updateTranslationForPostMutationOptions,
} from "@/api/posts/mutations";
import { getPostByIdQueryOptions } from "@/api/posts/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "./markdown-editor";
import MarkdownPreview from "./markdown-preview";
import MediaUploadZone from "./media-upload-zone";

interface RouteParams {
	post_id: string;
	lang: string;
}

function PostTranslationPage() {
	const { post_id, lang } = useParams({
		from: "/posts/list-posts/translation/$post_id/$lang",
	}) as RouteParams;
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	// Fetch post data
	const {
		data: post,
		isLoading,
		error,
	} = useQuery(getPostByIdQueryOptions(post_id));

	// Find the translation for the current language
	const currentTranslation = post?.translations.find(
		(t: { language: string }) => t.language === lang,
	);

	// Create translation mutation
	const createMutation = useMutation(
		createTranslationForPostMutationOptions({
			onSuccess: () => {
				toast.success("Translation created successfully!");
				setIsEditing(false);
			},
			onError: () => {
				toast.error("Failed to create translation");
			},
		}),
	);

	// Update translation mutation
	const updateMutation = useMutation(
		updateTranslationForPostMutationOptions({
			onSuccess: () => {
				toast.success("Translation updated successfully!");
				setIsEditing(false);
			},
			onError: (error) => {
				toast.error("Failed to update translation");
				console.error(error);
			},
		}),
	);

	// Initialize form data
	useEffect(() => {
		if (currentTranslation) {
			setTitle(currentTranslation.title || "");
			setDescription(currentTranslation.description || "");
		} else {
			setTitle("");
			setDescription("");
			setIsEditing(true); // Auto-enable editing for new translations
		}
	}, [currentTranslation]);

	const handleSave = () => {
		if (currentTranslation?.id) {
			updateMutation.mutate({
				postId: post_id,
				translationId: currentTranslation.id,
				body: description,
				query: {
					title,
					language: lang as "en" | "de" | "ar",
				},
			});
		} else {
			createMutation.mutate({
				post_id: post_id,
				query: {
					title,
					language: lang as "en" | "de" | "ar",
				},
				body: description,
			});
		}
	};

	const handleCancel = () => {
		if (currentTranslation) {
			setTitle(currentTranslation.title || "");
			setDescription(currentTranslation.description || "");
			setIsEditing(false);
		} else {
			navigate({ to: "/posts/list-posts" });
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground">Loading post...</p>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-destructive">Error loading post.</p>
			</div>
		);
	}

	const isNewTranslation = !currentTranslation;
	const isSaving = updateMutation.isPending || createMutation.isPending;
	const isRTL = lang === "ar";

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-4 mb-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate({ to: "/posts/list-posts" })}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Posts
					</Button>
					<Badge variant="outline">{lang.toUpperCase()}</Badge>
					{isNewTranslation && (
						<Badge variant="secondary">New Translation</Badge>
					)}
				</div>

				<h1 className="text-2xl font-bold tracking-tight">
					{isNewTranslation ? "Create Translation" : "Edit Translation"}
				</h1>
				<p className="text-muted-foreground">
					Post ID: {post_id} • Language: {lang.toUpperCase()}
				</p>
			</div>

			{/* Content */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Translation Content</CardTitle>
						<div className="flex gap-2">
							{!isEditing && !isNewTranslation && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsEditing(true)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							)}
							{isEditing && (
								<>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCancel}
										disabled={isSaving}
									>
										Cancel
									</Button>
									<Button size="sm" onClick={handleSave} disabled={isSaving}>
										<Save className="h-4 w-4 mr-2" />
										{isSaving ? "Saving..." : "Save"}
									</Button>
								</>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Title Field */}
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						{isEditing ? (
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter title..."
								dir={isRTL ? "rtl" : "ltr"}
								className={isRTL ? "text-right font-[Kufi]" : ""}
							/>
						) : (
							<div
								className={`p-3 bg-muted rounded-md ${isRTL ? "text-right font-[Kufi]" : ""}`}
								dir={isRTL ? "rtl" : "ltr"}
							>
								{title || (
									<span className="text-muted-foreground italic">No title</span>
								)}
							</div>
						)}
					</div>

					{/* Description Field */}
					<div className="space-y-2">
						<Label>Description</Label>
						{isEditing ? (
							<MarkdownEditor
								value={description}
								onChange={setDescription}
								placeholder="Enter description in markdown..."
								language={lang as "en" | "de" | "ar"}
							/>
						) : (
							<div className="border rounded-md p-4 min-h-50 bg-muted/50">
								{description ? (
									<MarkdownPreview
										content={description}
										language={lang as "en" | "de" | "ar"}
									/>
								) : (
									<span className="text-muted-foreground italic">
										No description
									</span>
								)}
							</div>
						)}
					</div>

					{/* Media Upload */}
					<MediaUploadZone
						translationId={currentTranslation?.id}
						media={currentTranslation?.media}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default PostTranslationPage;
