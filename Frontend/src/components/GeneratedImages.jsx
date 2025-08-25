import { useContext } from "react";
import { MyContext } from "./MyContext";
import '../Styles/generatedImages.css'
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;

function GeneratedImages() {
    const { allImages, setAllImages } = useContext(MyContext)

    const deleteImage = async (fileName) => {
        const token = localStorage.getItem('token')
        const options = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        try {
            const response = await fetch(
                `${API_URL}/api/allGenImages/${fileName}`,
                options
            );
            // console.log("response--->", response)

            const res = await response.json();
            // console.log('res---', res);

            if (response.ok) {
                setAllImages(prev => prev.filter(img => !img.includes(fileName)));
                console.log("Image deleted successfully");
            } else {
                console.log("Delete failed:", res.error);
            }
        } catch (error) {
            console.error(error);
            console.log("Error deleting image");
        }
    };


    return (

        <div className="genImg">
            <h1>GeneratedImages</h1>
            <div className="gallery">
                {
                    allImages.map((url, idx) => {
                        const fileName = url.split('/').pop() || "image.jpg";
                        // console.log("delete btn fileName--->", fileName)
                        return (
                            <div className="image-container" key={idx}>
                                <img src={url} alt="AskGPT_Generated_IMG_ERR" />
                                <div className="icons">
                                    <a href={url} target="_blank" download={fileName} >

                                        <i className="fa-solid fa-download img-action"></i>
                                    </a>
                                    <i className="fa-solid fa-delete-left img-action" onClick={(e) => deleteImage(fileName)}></i>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default GeneratedImages;