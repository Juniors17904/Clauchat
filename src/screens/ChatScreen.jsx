import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import MessageBubble from '../components/MessageBubble'
import TypingIndicator from '../components/TypingIndicator'

export default function ChatScreen({ apiKey, project, chat, onBack, onUpdateChat }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [chat.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const updateChatTitle = async (firstMessage) => {
    if (chat.title !== 'Nueva conversación') return
    const title = firstMessage.slice(0, 60).trim()
    await supabase
      .from('chats')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', chat.id)
    onUpdateChat({ ...chat, title })
  }

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || isStreaming) return

    setInput('')
    setIsStreaming(true)
    setStreamingContent('')

    // Save user message
    const { data: userMsg } = await supabase
      .from('messages')
      .insert({ chat_id: chat.id, role: 'user', content })
      .select()
      .single()

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    if (messages.length === 0) {
      updateChatTitle(content)
    }

    // Build messages for API
    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8096,
          stream: true,
          messages: apiMessages,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'Error en la API')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullContent += parsed.delta.text
              setStreamingContent(fullContent)
            }
          } catch {}
        }
      }

      // Save assistant message
      const { data: assistantMsg } = await supabase
        .from('messages')
        .insert({ chat_id: chat.id, role: 'assistant', content: fullContent })
        .select()
        .single()

      setMessages(prev => [...prev, assistantMsg])
      setStreamingContent('')

      // Update chat timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chat.id)

    } catch (err) {
      const errorContent = `Error: ${err.message}`
      const { data: errMsg } = await supabase
        .from('messages')
        .insert({ chat_id: chat.id, role: 'assistant', content: errorContent })
        .select()
        .single()
      setMessages(prev => [...prev, errMsg])
      setStreamingContent('')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const adjustTextarea = (e) => {
    setInput(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] flex-shrink-0">
        <button
          onClick={onBack}
          className="text-[#555] hover:text-[#888] transition-colors p-1"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[#e8e8e8] text-sm font-medium truncate">{chat.title}</p>
          <p className="text-[#555] text-xs truncate">{project.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="w-10 h-10 rounded-full bg-[#d97757] flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <p className="text-[#888] text-sm">¿En qué puedo ayudarte?</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && streamingContent && (
          <MessageBubble
            message={{ role: 'assistant', content: streamingContent }}
            streaming
          />
        )}

        {isStreaming && !streamingContent && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[#2a2a2a]">
        <div className="flex items-end gap-2 bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-2 focus-within:border-[#555] transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={adjustTextarea}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-[#e8e8e8] placeholder-[#555] text-sm resize-none focus:outline-none leading-6 max-h-48 disabled:opacity-50"
            style={{ height: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#d97757] hover:bg-[#c86846] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
        <p className="text-[#444] text-xs text-center mt-1.5">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  )
}
