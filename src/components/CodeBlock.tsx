import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  darkMode: boolean;
  language?: string;
}

export const CodeBlock = ({
  code,
  darkMode,
  language = "c",
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="absolute top-2 right-2 z-10 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-200 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400">
          {language}
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-white/80 dark:bg-black/80 hover:bg-orange-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
          title="Copy code">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={darkMode ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: darkMode ? "#6b7280" : "#9ca3af",
          textAlign: "right",
        }}
        wrapLines={true}
        wrapLongLines={true}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
