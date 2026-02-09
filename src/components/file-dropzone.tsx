import { Upload, X } from "lucide-react";
import { type DragEvent, useCallback, useState } from "react";
import { Button } from "./ui/button";

interface FileDropzoneProps {
	onFileSelect: (file: File | null) => void;
	acceptedTypes?: string[];
	maxSize?: number;
	disabled?: boolean;
	error?: string;
}

export function FileDropzone({
	onFileSelect,
	acceptedTypes = [".csv", ".xls", ".xlsx"],
	maxSize = 10 * 1024 * 1024, // 10MB
	disabled = false,
	error,
}: FileDropzoneProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(true);
			}
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const validateFile = (file: File): string | null => {
		// Check file size
		if (file.size > maxSize) {
			return `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`;
		}

		// Check file extension
		const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
		if (!acceptedTypes.includes(extension)) {
			return `Only ${acceptedTypes.join(", ")} files are accepted`;
		}

		return null;
	};

	const handleFile = (file: File) => {
		const validationError = validateFile(file);
		if (validationError) {
			onFileSelect(null);
			return;
		}

		setSelectedFile(file);
		onFileSelect(file);
	};

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragOver(false);

			if (disabled) return;

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				handleFile(files[0]);
			}
		},
		[disabled],
	);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	};

	const handleRemove = () => {
		setSelectedFile(null);
		onFileSelect(null);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div className="w-full">
			{!selectedFile ? (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`
						relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
						${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
						${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}
						${error ? "border-red-500" : ""}
					`}
				>
					<input
						type="file"
						accept={acceptedTypes.join(",")}
						onChange={handleFileInput}
						disabled={disabled}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
					/>
					<div className="flex flex-col items-center gap-2">
						<Upload className="w-10 h-10 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium">
								Drop your file here, or{" "}
								<span className="text-primary">browse</span>
							</p>
							<p className="text-xs text-muted-foreground">
								{acceptedTypes.join(", ")} up to{" "}
								{(maxSize / (1024 * 1024)).toFixed(0)}MB
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded">
							<Upload className="w-5 h-5 text-primary" />
						</div>
						<div className="flex flex-col">
							<p className="text-sm font-medium">{selectedFile.name}</p>
							<p className="text-xs text-muted-foreground">
								{formatFileSize(selectedFile.size)}
							</p>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleRemove}
						disabled={disabled}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			)}
			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
		</div>
	);
}
