import '../Styles/chat.css'
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './MyContext';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
// import "highlight.js/styles/github.css"
import "highlight.js/styles/vs2015.css";
import ErrorBoundary from './ErrorBoundary';
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;


function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null)

    //display reply letter by letter
    useEffect(() => {

        if (typeof reply !== 'string') {
            setLatestReply(null);
            return;
        }


        if (!prevChats?.length) return;
        const content = reply.split(""); //individual letter   
        let idnx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idnx + 1).join(""));
            idnx++;
            if (idnx >= content.length) clearInterval(interval)
        }, 15);

        return () => clearInterval(interval);

    }, [prevChats, reply])



    return (

        <>
            {newChat && <h1>Start a New Chat !</h1>}

            <div className="chats">

                {
                    prevChats?.slice(0, -1).map((chat, idx) => {
                        // console.log(chat)
                        return (
                            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                                {
                                    chat.role === "user" ?
                                        <p className='userMessage'>{chat.content}</p>
                                        :
                                        <ErrorBoundary>

                                            <ReactMarkdown rehypePlugins={rehypeHighlight}
                                                components={{
                                                    img: ({ node, ...props }) => {
                                                        const fileName = props.src?.split('/').pop() || "image.jpg";
                                                        const newSrc = `${API_URL}/assets/${fileName}`

                                                        return (
                                                            <span>
                                                                <img
                                                                    {...props}
                                                                    src={newSrc}
                                                                    alt="Generated_Image"
                                                                    style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
                                                                />
                                                                <a href={newSrc} target='_blank' download className="downloadBtn">
                                                                    <i className="fa-solid fa-circle-down"></i>
                                                                </a>
                                                            </span>
                                                        );
                                                    }
                                                }}
                                            >
                                                {
                                                    typeof chat.content === "string"
                                                        ? chat.content // render plain text or markdown
                                                        : chat.isImage && chat.content.imageUrl
                                                            ? `![Generated](${API_URL}/assets/${chat.content.imageUrl})` // dynamically insert image markdown
                                                            : ""
                                                }

                                            </ReactMarkdown>
                                        </ErrorBoundary>
                                }
                            </div>
                        )

                    })
                }

                {
                    prevChats.length > 0 && (

                        (() => {
                            const lastChat = prevChats[prevChats.length - 1];

                            if (lastChat.role === "user") {

                                return (
                                    <div className="userDiv">
                                        <p className="userMessage">{lastChat.content}</p>
                                    </div>
                                );
                            }
                            // GPT messages
                            return (
                                <div className="gptDiv">
                                    <ErrorBoundary>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                img: ({ node, ...props }) => {
                                                    const fileName = props.src?.split("/").pop() || "image.jpg";
                                                    const newSrc = `${API_URL}/assets/${fileName}`;
                                                    return (
                                                        <span>
                                                            <img {...props} src={newSrc} alt="Generated_Image" style={{ maxWidth: "100%", borderRadius: "8px" }} />
                                                            <a href={newSrc} target="_blank" download className="downloadBtn">
                                                                <i className="fa-solid fa-circle-down"></i>
                                                            </a>
                                                        </span>
                                                    );
                                                }
                                            }}
                                        >
                                            {
                                                lastChat.isImage && lastChat.content.imageUrl
                                                    ? `![Generated](${API_URL}/assets/${lastChat.content.imageUrl})`
                                                    : latestReply !== null
                                                        ? latestReply  // animated text
                                                        : lastChat.content // full static text
                                            }
                                        </ReactMarkdown>
                                    </ErrorBoundary>
                                </div>
                            );
                        })()
                    )
                }

            </div >
        </>
    );
}

export default Chat;