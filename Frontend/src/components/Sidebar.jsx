import '../Styles/sidebar.css'
import { useContext, useEffect, useState } from 'react'
import { MyContext } from './MyContext'
import { v1 as uuidv1 } from 'uuid'
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;
// console.log(API_URL)

function Sidebar() {
    const { allThreads, setAllThreads, setNewChat, setPrompt, reply, setReply, currentThreadId, setCurrentThreadId, setPrevChats,
        setAllImages, theme, setTheme, isImgOpen, setIsImgOpen, isSidebarOpen } = useContext(MyContext)

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const toggleImageComponent = () => {
        // console.log("click")
        setIsImgOpen(!isImgOpen)
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const fetchThreads = async () => {
        try {
            const endpoint = role === 'admin' ? '/api/getAllThreads' : '/api/thread'
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const res = await response.json()
            // console.log("Threads API →", res)
            //title
            if (Array.isArray(res)) {
                const threadsData = res.map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title
                }))
                setAllThreads(threadsData)
            } else {
                console.error("Unexpected response (not an array):", res)
            }

        } catch (err) {
            console.log("getAllThreads --->", err)
        }
    }
    
    useEffect(() => {
        fetchThreads()
    }, [reply]);

    //generated Images
    const fetchImages = async () => {

        try {
            const endpoint = role === 'admin' ? "/api/allGenImagesAdmin" : "/api/allGenImages"
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const URLData = await response.json()
            // console.log("Images API →", URLData)
            // console.log(res)
            if (Array.isArray(URLData)) {
                const allIamges = URLData.map(img => `${API_URL}${img.content.imageUrl}`)
                setAllImages(allIamges)
            } else {
                console.error("Unexpected response (not an array):", URLData)
            }

        } catch (error) {
            console.log("getAllImages Error ", error)
        }
    }
    useEffect(() => {
        fetchImages()
    }, []);

    const createNewChat = () => {
        // console.log("Create New Thread----->")
        setNewChat(true)
        setPrompt('')
        setReply(null)
        setCurrentThreadId(uuidv1())
        setPrevChats([])
    }

    const handleChangeThread = async (newThreadId) => {
        setCurrentThreadId(newThreadId)
        try {
            const endpoint = role === "admin"
                ? `/api/getAllThreads/${newThreadId}`
                : `/api/thread/${newThreadId}`;

            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const res = await response.json()
            // console.log(res)
            // console.log(res.messages)
            setPrevChats(res.messages)
            setNewChat(false)
            setReply(null)

        } catch (err) {
            console.log("change thread --->", err)
        }

    }

    const handleDeleteThread = async (delThreadId) => {
        try {
            const endpoint = role === "admin"
                ? `/api/getAllThreads/${delThreadId}`
                : `/api/thread/${delThreadId}`;
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const res = await response.json();
            // console.log(res)
            setAllThreads(prev => prev.filter(thread => thread.threadId !== delThreadId))
            if (delThreadId === currentThreadId) {
                createNewChat()
            }
            console.log('delete successful')
        } catch (err) {
            console.log("delete thread", err)
        }
    }

    return (
        isSidebarOpen && (
            <section className='sidebar'>
                <button className='logo' onClick={(e) => {
                    createNewChat()
                    setIsImgOpen(false)
                }
                }>
                    <p>AskGPT</p>
                    <i className='fa-solid fa-pen-to-square'></i>
                </button>

                <button className='theme-toggle' onClick={toggleTheme}>
                    {theme === "dark" ? "☀️Light" : "🌑Dark"}
                </button>

                <div className='img-gallery-icon' onClick={toggleImageComponent}>
                    <i className="fa-solid fa-images"></i>
                </div>

                <ul className='thread'>
                    <p>Chats</p>
                    {
                        allThreads?.map((thread) => {
                            // console.log(thread.title)
                            return (
                                <div key={thread.threadId}>
                                    <li onClick={(e) => {
                                        handleChangeThread(thread.threadId)
                                        setIsImgOpen(false)

                                    }}
                                        className={thread.threadId === currentThreadId ? "highlighted" : ""}
                                    >
                                        {thread.title}
                                        <i className='fa-solid fa-trash'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteThread(thread.threadId)
                                            }}
                                        ></i>
                                    </li>
                                </div>
                            )
                        })
                    }
                </ul>

                <div className="sign">
                    <p>By AskGPT &hearts;</p>
                </div>
            </section>
        )
    )
}

export default Sidebar




