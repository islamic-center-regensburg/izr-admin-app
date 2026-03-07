import { Languages } from "lucide-react";
import type { PostOut } from "@/api/gen";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActionButtons from "./action-buttons";

const formatValidToDate = (value: string) => {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return "Invalid date";
	}

	return new Intl.DateTimeFormat("de-DE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(parsed);
};

interface PostListCardProps {
	post: PostOut;
	onDeletePost: (postId: string) => void;
}

function PostListCard({ post, onDeletePost }: PostListCardProps) {
	const enTranslation = post.translations.find((translation) => {
		return translation.language === "en";
	});

	return (
		<Card key={post.id} className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg">
						{enTranslation?.title || (
							<span className="text-muted-foreground italic">
								[No English Title]
							</span>
						)}
					</CardTitle>
					<Badge variant="outline" className="ml-2">
						ID: {post.id}
					</Badge>
				</div>
			</CardHeader>

			<CardContent>
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							Valid until: {formatValidToDate(post.valid_to)}
						</p>
						<div className="flex items-center gap-2">
							<Languages className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								Available translations:
							</span>
							<div className="flex gap-1">
								{post.translations.map((translation) => (
									<Badge
										key={translation.language}
										variant="secondary"
										className="text-xs"
									>
										{translation.language.toUpperCase()}
									</Badge>
								))}
							</div>
						</div>
					</div>

					<ActionButtons postId={post.id} onDelete={onDeletePost} />
				</div>
			</CardContent>
		</Card>
	);
}

export default PostListCard;
