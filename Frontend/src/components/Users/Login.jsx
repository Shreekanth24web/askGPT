import '../../Styles/signup.css';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';
const API_URL = import.meta.env.VITE_ASKGPT_API_URL || "http://localhost:8001";

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            })
        }
        try {
            const res = await fetch(`${API_URL}/user/login`, options)
            const data = await res.json()
            console.log("Response from server:", data);
            if (!res.ok) throw new Error(data.error || "Login failed");
            localStorage.setItem('token', data.token);

            if (data.user?.role) {
                localStorage.setItem("role", data.user.role);
                // console.log("Role saved:", data.user.role);
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(data.message || "Login successful!");
            navigate('/askgtp');

        } catch (error) {
            console.error("Error during login:", error);
            alert(error.message || "Login failed");
        }
    }

    return (
        <div className="container">

            <h1 className="text-head">
                Log in
            </h1>

            <div className='form-container'>
                <form method='POST' action="" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder='Enter your email'
                        name='email'
                        onChange={handleInputChange}
                        value={loginData.email}
                        required
                    />  <br />
                    <input
                        type="password"
                        placeholder='Enter your password'
                        onChange={handleInputChange}
                        name='password'
                        value={loginData.password}
                        required
                    /> <br />

                    <div className="btns">
                        <button className='login-btn' >Log in</button>
                        <Link to="/signup" className='signup-btn'>
                            Sign up
                        </Link>
                    </div>

                    <p>
                        if you don't have an account please signup
                    </p>
                </form>
            </div>

        </div >
    );
}

export default Login;