import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CodeToggle,
	CreateLink,
	codeBlockPlugin,
	codeMirrorPlugin,
	diffSourcePlugin,
	frontmatterPlugin,
	headingsPlugin,
	InsertImage,
	InsertTable,
	InsertThematicBreak,
	imagePlugin,
	ListsToggle,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	markdownShortcutPlugin,
	quotePlugin,
	Separator,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./mdx-editor-custom.css";

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	language?: "en" | "de" | "ar";
}

function MarkdownEditor({
	value,
	onChange,
	placeholder,
	language = "en",
}: MarkdownEditorProps) {
	const isRTL = language === "ar";

	// Arabic-specific placeholder
	const getPlaceholder = () => {
		if (language === "ar") {
			return placeholder || "اكتب الوصف بتنسيق Markdown...";
		}
		return placeholder || "Enter description in markdown...";
	};

	return (
		<div
			className={`border rounded-md overflow-hidden mdx-editor-wrapper ${isRTL ? "rtl" : "ltr"}`}
			dir={isRTL ? "rtl" : "ltr"}
		>
			<MDXEditor
				markdown={value}
				onChange={onChange}
				placeholder={getPlaceholder()}
				plugins={[
					// Basic plugins
					headingsPlugin(),
					listsPlugin(),
					quotePlugin(),
					thematicBreakPlugin(),
					markdownShortcutPlugin(),

					// Link and image plugins
					linkPlugin(),
					linkDialogPlugin(),
					imagePlugin({
						imageAutocompleteSuggestions: [],
						imageUploadHandler: async () => {
							return "https://via.placeholder.com/300x200";
						},
					}),

					// Table plugin
					tablePlugin(),

					// Code plugins
					codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
					codeMirrorPlugin({
						codeBlockLanguages: {
							js: "JavaScript",
							css: "CSS",
							txt: "Text",
							tsx: "TypeScript",
							json: "JSON",
							html: "HTML",
							python: "Python",
							sql: "SQL",
							ar: "Arabic",
						},
					}),

					// Source mode plugin
					diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),

					// Frontmatter plugin
					frontmatterPlugin(),

					// Toolbar plugin
					toolbarPlugin({
						toolbarContents: () => (
							<>
								<UndoRedo />
								<Separator />
								<BoldItalicUnderlineToggles />
								<CodeToggle />
								<Separator />
								<BlockTypeSelect />
								<Separator />
								<CreateLink />
								<InsertImage />
								<Separator />
								<ListsToggle />
								<Separator />
								<InsertTable />
								<InsertThematicBreak />
							</>
						),
					}),
				]}
				contentEditableClassName={`mdx-content-editable ${isRTL ? "arabic-content" : ""}`}
			/>
		</div>
	);
}

export default MarkdownEditor;
