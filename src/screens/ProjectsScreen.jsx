import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ProjectsScreen({ onOpenChat, onChangeKey }) {
  const [projects, setProjects] = useState([])
  const [openProjectId, setOpenProjectId] = useState(null)
  const [chats, setChats] = useState({})
  const [loading, setLoading] = useState(true)
  const [newProjectName, setNewProjectName] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const loadChats = async (projectId) => {
    if (chats[projectId]) return
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
    setChats(prev => ({ ...prev, [projectId]: data || [] }))
  }

  const toggleProject = async (projectId) => {
    if (openProjectId === projectId) {
      setOpenProjectId(null)
    } else {
      setOpenProjectId(projectId)
      await loadChats(projectId)
    }
  }

  const createProject = async () => {
    const name = newProjectName.trim()
    if (!name) return
    const { data } = await supabase
      .from('projects')
      .insert({ name })
      .select()
      .single()
    if (data) {
      setProjects(prev => [data, ...prev])
      setNewProjectName('')
      setShowNewProject(false)
      setOpenProjectId(data.id)
      setChats(prev => ({ ...prev, [data.id]: [] }))
    }
  }

  const createChat = async (project) => {
    const { data } = await supabase
      .from('chats')
      .insert({ project_id: project.id, title: 'Nueva conversación' })
      .select()
      .single()
    if (data) {
      setChats(prev => ({ ...prev, [project.id]: [data, ...(prev[project.id] || [])] }))
      onOpenChat(project, data)
    }
  }

  const deleteProject = async (e, projectId) => {
    e.stopPropagation()
    await supabase.from('projects').delete().eq('id', projectId)
    setProjects(prev => prev.filter(p => p.id !== projectId))
    if (openProjectId === projectId) setOpenProjectId(null)
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#d97757] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="text-[#e8e8e8] font-medium text-sm">Claude Chat</span>
        </div>
        <button
          onClick={onChangeKey}
          className="text-[#555] hover:text-[#888] text-xs transition-colors"
        >
          API Key
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#555] text-sm">
            Cargando...
          </div>
        ) : (
          <div className="py-2">
            {projects.length === 0 && !showNewProject && (
              <div className="text-center py-16 px-6">
                <p className="text-[#555] text-sm">Sin proyectos aún</p>
                <p className="text-[#444] text-xs mt-1">Crea uno para empezar</p>
              </div>
            )}

            {projects.map(project => (
              <div key={project.id}>
                <div
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#242424] cursor-pointer group transition-colors"
                  onClick={() => toggleProject(project.id)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3 h-3 fill-[#555] flex-shrink-0 transition-transform ${openProjectId === project.id ? 'rotate-90' : ''}`}
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#d97757] flex-shrink-0">
                    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                  </svg>
                  <span className="text-[#e8e8e8] text-sm flex-1 truncate">{project.name}</span>
                  <button
                    onClick={(e) => deleteProject(e, project.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-all text-xs px-1"
                  >
                    ✕
                  </button>
                </div>

                {openProjectId === project.id && (
                  <div className="ml-7 border-l border-[#2a2a2a]">
                    {(chats[project.id] || []).map(chat => (
                      <div
                        key={chat.id}
                        className="flex items-center gap-2 pl-4 pr-4 py-2 hover:bg-[#242424] cursor-pointer group transition-colors"
                        onClick={() => onOpenChat(project, chat)}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#555] flex-shrink-0">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        <span className="text-[#aaa] text-sm flex-1 truncate">{chat.title}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => createChat(project)}
                      className="flex items-center gap-2 pl-4 pr-4 py-2 text-[#d97757] hover:text-[#e8875f] text-sm w-full transition-colors"
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Nuevo chat</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New project input */}
      {showNewProject && (
        <div className="border-t border-[#2a2a2a] px-4 py-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') createProject()
              if (e.key === 'Escape') setShowNewProject(false)
            }}
            placeholder="Nombre del proyecto"
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-[#e8e8e8] placeholder-[#555] text-sm focus:outline-none focus:border-[#d97757] transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={createProject}
              disabled={!newProjectName.trim()}
              className="flex-1 bg-[#d97757] hover:bg-[#c86846] disabled:opacity-40 text-white rounded-lg py-1.5 text-sm transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => { setShowNewProject(false); setNewProjectName('') }}
              className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-[#888] rounded-lg py-1.5 text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      {!showNewProject && (
        <div className="border-t border-[#2a2a2a] px-4 py-3">
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#d97757] hover:bg-[#c86846] text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            <span className="text-base">+</span>
            Nuevo proyecto
          </button>
        </div>
      )}
    </div>
  )
}
