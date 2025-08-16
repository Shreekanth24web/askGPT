import { useContext } from "react";
import { MyContext } from "./MyContext";
import '../Styles/generatedImages.css'
const API_URL = process.env.ASKGPT_API_URL || "http://localhost:8001";


function GeneratedImages() {
    const { allImages, setAllImages } = useContext(MyContext)
    // console.log(allImages)

   const deleteImage = async (url) => {
    console.log("url---->",url)
    const fileName = url.split('/').pop(); // Extract just the filename
    console.log("Deleting:", fileName);

    try {
        const response = await fetch(
            `${API_URL}/api/allGenImages/${fileName}`,
            { method: "DELETE" }
        );

        const res = await response.json();
        console.log(res);

        if (response.ok) {
            setAllImages(prev => prev.filter(img => !img.includes(fileName)));
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

                        return (
                            <div className="image-container" key={idx}>
                                <img src={url} alt="AskGPT_Generated_IMG_ERR" />
                                <div className="icons">
                                    <a href={url} target="_blank" download={fileName} >

                                        <i className="fa-solid fa-download img-action"></i>
                                    </a>
                                    <i className="fa-solid fa-delete-left img-action" onClick={() => deleteImage(fileName)}></i>
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