import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePostMutationOptions } from "@/api/posts/mutations";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
	postId: string;
	onDelete?: (postId: string) => void;
}

function ActionButtons({ postId, onDelete }: ActionButtonsProps) {
	const navigate = useNavigate();
	const deleteMutation = useMutation(
		deletePostMutationOptions({
			onSuccess: () => toast.success("Post deleted successfully"),
			onError: (error) => toast.error(`Error deleting post: ${error}`),
		}),
	);

	const handleLanguageClick = (lang: string) => {
		navigate({
			to: "/posts/list-posts/translation/$post_id/$lang",
			params: { post_id: postId, lang },
		});
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(postId);
		}
		deleteMutation.mutate(postId);
	};

	return (
		<div className="flex items-center gap-2">
			{["en", "de", "ar"].map((lang) => (
				<Button
					key={lang}
					variant="outline"
					size="sm"
					onClick={() => handleLanguageClick(lang)}
				>
					{lang.toUpperCase()}
				</Button>
			))}

			<Button
				variant="destructive"
				size="sm"
				className="ml-2"
				onClick={handleDelete}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default ActionButtons;
