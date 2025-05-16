
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const memoizedContent = useMemo(() => content, [content]);

  if (!content) {
    return null;
  }

  return (
    <ReactMarkdown
      className={`markdown-content ${className}`}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const inline = !match;
          
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Add custom styling for other markdown elements
        h1: (props) => <h1 className="text-2xl font-bold mb-3" {...props} />,
        h2: (props) => <h2 className="text-xl font-bold mb-2" {...props} />,
        h3: (props) => <h3 className="text-lg font-bold mb-2" {...props} />,
        p: (props) => <p className="mb-4" {...props} />,
        ul: (props) => <ul className="list-disc ml-5 mb-4" {...props} />,
        ol: (props) => <ol className="list-decimal ml-5 mb-4" {...props} />,
        blockquote: (props) => (
          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />
        ),
        a: (props) => (
          <a className="text-primary underline hover:text-primary/80" {...props} />
        ),
      }}
    >
      {memoizedContent}
    </ReactMarkdown>
  );
}
