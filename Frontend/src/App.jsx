
import './App.css'
import ChatWindow from './components/ChatWindow'
import Sidebar from './components/Sidebar'
import { MyContext } from './components/MyContext'
import { useState } from 'react'
import { v1 as uuidv1 } from 'uuid'
import Login from './components/Users/Login'
import Signup from './components/Users/Signup' 
import { Routes, Route,Navigate  } from 'react-router-dom'

function App() {
  const [prompt, setPrompt] = useState('')
  const [reply, setReply] = useState(null)
  const [currentThreadId, setCurrentThreadId] = useState(uuidv1())
  const [prevChats, setPrevChats] = useState([]) //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true)
  const [allThreads, setAllThreads] = useState([])
  const [allThreadsAdmin, setAllThreadsAdmin] = useState([])
  const [allImages, setAllImages] = useState([])
  const [theme, setTheme] = useState('dark')
  const [isOpen, setIsOpen] = useState(false)
  const [isImgOpen, setIsImgOpen] = useState(false)
 

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currentThreadId, setCurrentThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    allThreadsAdmin, setAllThreadsAdmin,
    theme, setTheme,
    isOpen, setIsOpen,
    allImages, setAllImages,
    isImgOpen, setIsImgOpen,
     
  }


  return (
    <div className={`app ${theme}`}>
      <MyContext.Provider value={providerValues}>

        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected UI after login */}
          <Route path="/askgpt" element={
            <>
              <Sidebar />
              <ChatWindow />
            </>
          } />
        </Routes>

      </MyContext.Provider>
    </div >
  )
}

export default App
