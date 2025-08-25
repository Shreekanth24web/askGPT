import '../Styles/chatwindow.css'
import Chat from './Chat.jsx'
import { useContext, useState, useEffect } from 'react'
import { MyContext } from './MyContext.jsx'
import { PropagateLoader } from 'react-spinners'
import GeneratedImages from './GeneratedImages.jsx'
import { useNavigate } from 'react-router'
const API_URL = import.meta.env.VITE_ASKGPT_API_URL  
console.log(`API Url--->",${API_URL}`)

function ChatWindow() {
    const navigate = useNavigate()
    const { prompt, setPrompt, reply, setReply, currentThreadId, setPrevChats, setNewChat, isOpen, setIsOpen, allImages, setAllImages, isImgOpen, setIsImgOpen,isSidebarOpen, setIsSidebarOpen } = useContext(MyContext)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null) 

    const toggleSidebar = () => { 
        setIsSidebarOpen(!isSidebarOpen)
    }

    const dropDoentoggle = () => { 
        setIsOpen(!isOpen)
    }

    const getReply = async () => {
        const token = localStorage.getItem('token')
        const keywords = ["generate", "generate image", "design", "create image", "photo", "draw", "image"];
        const lowerPrompt = prompt.toLowerCase()
        if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
            await getImage(lowerPrompt);
            return;
        }
        setLoading(true)
        setNewChat(false)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currentThreadId
            })
        }
        try {
            const response = await fetch(`${API_URL}/api/chat`, options)
            if (!response.ok) throw new Error("Failed to fetch response");
            const res = await response.json()
            // console.log(res.reply)
            setReply(res.reply || "No reply from model")

        } catch (error) {
            console.log("getReply --->", error)
        }
        setLoading(false)
    }

    const getImage = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        const imgOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ threadId: currentThreadId, imagePrompt: prompt }),
        };

        try {
            const response = await fetch(`${API_URL}/api/generate-image`, imgOptions);

            const res = await response.json();
            // console.log("🖼️ Image response:", res);
            if (res.image.imageUrl) {
                // Store image
                setAllImages(prev => [...prev, res.image]);

                // Use actual image path in reply
                // ![Generated Image](/assets/Image_2025-08-07_11-46-28.png)
                const imageReply = `Here is the generated image:\n\n![Generated Image](${API_URL}${res.image.imageUrl})`;
                console.log('image path---->', res.image.imageUrl)
                console.log('imageReply------>', imageReply)

                setReply(imageReply);
            } else {
                setReply("Failed to generate image.");
            }

        } catch (error) {
            console.log("getImage error --->", error);
            setReply("Error occurred while generating image.");
        }
        setLoading(false);
    };


    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: 'user',
                    content: prompt
                }, {
                    role: 'model',
                    content: reply
                }]
            ))
        }
        setPrompt('')
    }, [reply])


    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            setProfile(JSON.parse(user))
        }
    }, [])

    const handleLogout = () => {
        console.log("------logout----")
        localStorage.clear()
        // setNewChat(true) 
        setIsOpen(false)
        navigate('/', { replace: true })
        window.location.reload() 
    }

    return (
        <div className='chatWindow'>
            {isImgOpen ?
                <GeneratedImages /> :
                <div className='chatWindow'>

                    <div className="navbar">

                        <span onClick={toggleSidebar}>AskGPT <i className="fa-solid fa-chevron-down"></i></span>

                        <div className="userIconDiv" onClick={dropDoentoggle}>
                            <span className='userIcon'>
                                <i className='fa-solid fa-user'></i>
                            </span>
                            {
                                profile &&
                                <p className="avatar">{profile.name}</p>
                            }
                        </div>

                    </div>
                    {isOpen &&
                        <div className='dropdown'>
                            <div className="dropdownItem">
                                <i className="fa-solid fa-gear"></i>
                                &nbsp; Settings
                            </div>
                            <div className="dropdownItem">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                &nbsp; Upgrade plan
                            </div>
                            <div className="dropdownItem" onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                &nbsp; Logout
                            </div>
                        </div>
                    }
                    <Chat />
                    <div className='loder'>

                        <PropagateLoader className='loder' size={15} loading={loading}>

                        </PropagateLoader>
                    </div>

                    <div className="chatInput">
                        <div className="inputBox">

                            <input
                                placeholder='Ask anything'
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                            />
                            <div id="submit" onClick={getReply}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </div>

                        </div>
                        <p className="info">
                            AskGPT can make mistakes. Check important info. See Cookie Preferences.
                        </p>
                    </div>

                </div>
            }

        </div >
    )
}

export default ChatWindow




