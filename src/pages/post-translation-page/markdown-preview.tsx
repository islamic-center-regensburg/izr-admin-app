import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "./markdown-preview-custom.css";

interface MarkdownPreviewProps {
	content: string;
	language?: "en" | "de" | "ar";
}

function MarkdownPreview({ content, language = "en" }: MarkdownPreviewProps) {
	if (!content.trim()) {
		const emptyMessage =
			language === "ar" ? "لا يوجد شيء للمعاينة" : "Nothing to preview";
		return (
			<div className="text-muted-foreground italic text-center py-8">
				{emptyMessage}
			</div>
		);
	}

	const isRTL = language === "ar";
	const hasArabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(
		content,
	);
	const useArabicTypography = isRTL || hasArabicChars;

	const components: Components = {
		// Headers
		h1: ({ children }) => (
			<h1 className={`preview-h1 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h1>
		),
		h2: ({ children }) => (
			<h2 className={`preview-h2 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className={`preview-h3 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h3>
		),
		h4: ({ children }) => (
			<h4 className={`preview-h4 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h4>
		),
		h5: ({ children }) => (
			<h5 className={`preview-h5 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h5>
		),
		h6: ({ children }) => (
			<h6 className={`preview-h6 ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</h6>
		),

		// Lists
		ul: ({ children }) => (
			<ul className={`preview-ul ${isRTL ? "rtl-list" : "ltr-list"}`}>
				{children}
			</ul>
		),
		ol: ({ children }) => (
			<ol
				className={`preview-ol ${isRTL ? "rtl-list arabic-numbers" : "ltr-list"}`}
			>
				{children}
			</ol>
		),
		li: ({ children }) => (
			<li className={`preview-li ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</li>
		),

		// Paragraphs
		p: ({ children }) => (
			<p className={`preview-p ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</p>
		),

		// Blockquotes
		blockquote: ({ children }) => (
			<blockquote
				className={`preview-blockquote ${isRTL ? "rtl-blockquote" : "ltr-blockquote"}`}
			>
				{children}
			</blockquote>
		),

		// Links
		a: ({ children, href }) => (
			<a
				href={href}
				className="preview-link"
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
		),

		// Tables
		table: ({ children }) => (
			<div className="preview-table-wrapper">
				<table className={`preview-table ${isRTL ? "rtl-table" : "ltr-table"}`}>
					{children}
				</table>
			</div>
		),
		thead: ({ children }) => (
			<thead className="preview-thead">{children}</thead>
		),
		tbody: ({ children }) => (
			<tbody className="preview-tbody">{children}</tbody>
		),
		tr: ({ children }) => <tr className="preview-tr">{children}</tr>,
		th: ({ children }) => (
			<th className={`preview-th ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</th>
		),
		td: ({ children }) => (
			<td className={`preview-td ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</td>
		),

		// Horizontal rule
		hr: () => <hr className="preview-hr" />,

		// Strong and emphasis
		strong: ({ children }) => (
			<strong className={`preview-strong ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</strong>
		),
		em: ({ children }) => (
			<em className={`preview-em ${isRTL ? "rtl-text" : "ltr-text"}`}>
				{children}
			</em>
		),

		// Code
		code(props) {
			const { children, className } = props;
			const match = /language-(\w+)/.exec(className || "");

			if (match) {
				return (
					<SyntaxHighlighter
						PreTag="div"
						language={match[1]}
						style={tomorrow}
						customStyle={{
							margin: "1rem 0",
							borderRadius: "0.375rem",
							fontSize: "0.875rem",
							direction: "ltr", // Code is always LTR
							textAlign: "left",
						}}
					>
						{String(children).replace(/\n$/, "")}
					</SyntaxHighlighter>
				);
			}

			return <code className="preview-inline-code">{children}</code>;
		},

		// Pre (for code blocks without language)
		pre: ({ children }) => <pre className="preview-pre">{children}</pre>,
	};

	return (
		<div
			className={`markdown-preview ${isRTL ? "rtl" : "ltr"} ${useArabicTypography ? "arabic-content" : ""}`}
			dir={isRTL ? "rtl" : "ltr"}
		>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content}
			</ReactMarkdown>
		</div>
	);
}

export default MarkdownPreview;
