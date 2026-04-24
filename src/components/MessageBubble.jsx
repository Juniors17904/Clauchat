import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const code = String(children).replace(/\n$/, '')

  if (inline || !match) {
    return (
      <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-[#e8c47a] text-[0.85em] font-mono" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-[#2a2a2a]">
      {language && (
        <div className="bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#555] border-b border-[#2a2a2a] flex items-center justify-between">
          <span>{language}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(code)}
            className="text-[#444] hover:text-[#888] transition-colors text-xs"
          >
            Copiar
          </button>
        </div>
      )}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || 'text'}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, background: '#0d0d0d', fontSize: '0.82em' }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function MessageBubble({ message, streaming }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[85%] bg-[#2a2a2a] rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-[#e8e8e8] text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-full bg-[#d97757] flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose-claude text-sm text-[#e8e8e8] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {streaming && (
          <span className="inline-block w-1.5 h-4 bg-[#d97757] rounded-sm ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  )
}
