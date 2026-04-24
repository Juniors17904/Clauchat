import { useState } from 'react'

export default function SetupScreen({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('La key debe empezar con sk-ant-...')
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#1a1a1a] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#d97757] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#e8e8e8]">Claude Chat</h1>
          <p className="text-sm text-[#888] mt-1">Ingresa tu API key de Anthropic</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError('') }}
              placeholder="sk-ant-api03-..."
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-[#e8e8e8] placeholder-[#555] text-sm focus:outline-none focus:border-[#d97757] transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-[#d97757] hover:bg-[#c86846] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors"
          >
            Continuar
          </button>
        </form>

        <p className="text-xs text-[#555] text-center mt-6">
          Tu key se guarda solo en este dispositivo
        </p>
      </div>
    </div>
  )
}
