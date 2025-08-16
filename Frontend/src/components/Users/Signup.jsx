import '../../Styles/signup.css';
import { Link, useNavigate } from 'react-router-dom';
const API_URL = process.env.ASKGPT_API_URL || "http://localhost:8001";

 
import {  useState } from 'react';
function Signup() {
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupData)
        }
        try {
            const res = await fetch(`${API_URL}/user/signup`, options)
            //    console.log(res)
            const data = await res.json()
            //  console.log("Response from server:", data);
            alert(data.message || "Signup successful!");
            navigate('/login');

        } catch (error) {
            console.error("Error during signup:", error);
            alert(error.message || "Signup failed");
        }

    }
    return (
        <div className="container">

            <h1 className="text-head">
                Signup
            </h1>

            <div className='form-container'>
                <form method='POST' action="" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Enter your name'
                        name='name'
                        onChange={handleInputChange}
                        value={signupData.name}
                        required
                    />  <br />
                    <input
                        type="email"
                        placeholder='Enter your email'
                        name='email'
                        onChange={handleInputChange}
                        value={signupData.email}
                        required
                    />  <br />
                    <input
                        type="password"
                        placeholder='Create your password'
                        name='password'
                        onChange={handleInputChange}
                        value={signupData.password}
                        required
                    /> <br />

                    <div className="btns">
                        <button className='signup-btn'>Sign up</button>

                        <Link to="/login" className='login-btn' >
                            Login
                        </Link>

                    </div>
                    <p>
                        if you Already have an account please login
                    </p>
                </form>
            </div>

        </div>
    );
}

export default Signup;