import { useState } from 'react'
import SetupScreen from './screens/SetupScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ChatScreen from './screens/ChatScreen'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('claude_api_key') || '')
  const [view, setView] = useState('projects')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)

  const handleSaveKey = (key) => {
    localStorage.setItem('claude_api_key', key)
    setApiKey(key)
  }

  const openChat = (project, chat) => {
    setSelectedProject(project)
    setSelectedChat(chat)
    setView('chat')
  }

  const backToProjects = () => {
    setView('projects')
    setSelectedChat(null)
  }

  if (!apiKey) {
    return <SetupScreen onSave={handleSaveKey} />
  }

  if (view === 'chat' && selectedChat) {
    return (
      <ChatScreen
        apiKey={apiKey}
        project={selectedProject}
        chat={selectedChat}
        onBack={backToProjects}
        onUpdateChat={(updated) => setSelectedChat(updated)}
      />
    )
  }

  return (
    <ProjectsScreen
      onOpenChat={openChat}
      onChangeKey={() => setApiKey('')}
    />
  )
}
