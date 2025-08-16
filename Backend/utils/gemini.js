import 'dotenv/config'
const model = 'models/gemini-2.5-flash'
const apikey = process.env.GEMINI_API_KEY

const getGeminiAPIResponse = async (text) => {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: text
                        }
                    ]
                }
            ]
        })
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apikey}`, options)
        const data = await response.json()
        // console.log(data.candidates[0].content.parts[0].text)
        return data.candidates[0].content.parts[0].text //replay
    } catch (err) {
        console.log(err)
    }
} 
export default getGeminiAPIResponse;