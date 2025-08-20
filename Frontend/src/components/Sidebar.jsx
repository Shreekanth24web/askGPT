import '../Styles/sidebar.css'
import { useContext, useEffect, useState } from 'react'
import { MyContext } from './MyContext'
import { v1 as uuidv1 } from 'uuid'
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;
// console.log(API_URL)

function Sidebar() {
    const { allThreads, setAllThreads, setNewChat, setPrompt, setReply, currentThreadId, setCurrentThreadId, setPrevChats,
        setAllImages, theme, setTheme, isImgOpen, setIsImgOpen, isSidebarOpen } = useContext(MyContext)

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }


    const toggleImageComponent = () => {
        // console.log("click")
        setIsImgOpen(!isImgOpen)
    }

    const getAllThreads = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/thread`, {
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

    // admin
    const getAllThreadsAdmin = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/getAllThreads`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const res = await response.json()
            // console.log("Admin Threads API →", res)
            //title
            if (Array.isArray(res)) {
                const allThreadsData = res.map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title
                }))
                setAllThreads(allThreadsData)
            } else {
                console.error(" getAllThreadsAdmin Unexpected response (not an array):", res)
            }

        } catch (err) {
            console.log("getAllThreadsAdmin --->", err)
        }
    }

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
            getAllThreadsAdmin();
        } else {
            getAllThreads();
        }
    }, []);


    //generated Images
    const getAllImages = async () => {
        const token = localStorage.getItem("token");
        try {

            const response = await fetch(`${API_URL}/api/allGenImages`, {
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
    const getAllImagesAdmin = async () => {
        const token = localStorage.getItem("token");
        try {

            const response = await fetch(`${API_URL}/api/allGenImagesAdmin`, {
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
        const role = localStorage.getItem("role");
        if (role === "admin") {
            getAllImagesAdmin();
        } else {
            getAllImages();
        }
    }, []);

    const createNewChat = () => {
        setNewChat(true)
        setPrompt('')
        setReply(null)
        setCurrentThreadId(uuidv1())
        setPrevChats([])
    }

    const changeThread = async (newThreadId) => {
        setCurrentThreadId(newThreadId)
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
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
    const changeAllThread = async (newAllThreadId) => {
        setCurrentThreadId(newAllThreadId)
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/getAllThreads/${newAllThreadId}`, {
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

    const handleChangeThread = (threadId) => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
            changeAllThread(threadId);
        } else {
            changeThread(threadId);
        }
    }

    const deleteThread = async (delThreadId) => {
        // console.log("delete btn clicked....")
        // console.log(delThreadId)
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/thread/${delThreadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const res = await response.json();
            // console.log(res)

            setAllThreads(prev => prev.filter(thread => thread.threadId !== delThreadId))
            if (delThreadId === currentThreadId) {
                createNewChat()
            }

        } catch (err) {
            console.log("delete thread", err)
        }
    }

    return (
        isSidebarOpen && (
            <section className='sidebar'>
                <button className='logo' onClick={createNewChat}>
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
                                                deleteThread(thread.threadId)
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




