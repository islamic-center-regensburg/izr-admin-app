import { useQuery } from "@tanstack/react-query";
import { getPostsQueryOptions } from "@/api/posts/queries";
import { Card, CardContent } from "@/components/ui/card";
import { useMosque } from "@/contexts";
import CreatePostSheet from "./create-post-sheet";
import PostListCard from "./post-list-card";

function PostsListPage() {
	const { mosque } = useMosque();
	const mosqueId = mosque?.id;

	const { data, isLoading, error } = useQuery(
		getPostsQueryOptions(mosqueId, {}),
	);

	const handleDeletePost = (postId: string) => {
		console.log(`Deleting post ${postId}`);
	};

	if (!mosqueId) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground">No mosque selected.</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground">Loading posts...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-destructive">Error loading posts.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Posts List</h2>
					<p className="text-muted-foreground">
						Manage your mosque posts and translations
					</p>
				</div>

				<CreatePostSheet mosqueId={mosqueId} />
			</div>

			<div className="grid gap-4">
				{data?.data.map((post) => (
					<PostListCard
						key={post.id}
						post={post}
						onDeletePost={handleDeletePost}
					/>
				))}
			</div>

			{data?.data.length === 0 && (
				<Card className="w-full">
					<CardContent className="flex items-center justify-center h-32">
						<p className="text-muted-foreground">No posts found.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default PostsListPage;
