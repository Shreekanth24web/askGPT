import '../../Styles/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2'
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;

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
        // console.log("Login data:", loginData);
        if (!loginData.email || !loginData.password) {
            Swal.fire({
                // background:'#212121',
                // color:'#fff',
                position: "top",
                icon: "warning",
                title: "Please fill your login details",
                showConfirmButton: false,
                timer: 2700,
                toast: true,
                timerProgressBar: true
            });
            return;
        }

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
            // console.log("Response from server:", data);
            if (!res.ok) throw new Error(data.error || "Login failed");
            localStorage.setItem('token', data.token);

            if (data.user?.role) {
                localStorage.setItem("role", data.user.role);
                // console.log("Role saved:", data.user.role);
            }
            localStorage.setItem('user', JSON.stringify(data.user));

            Swal.fire({
                title: 'Logged in Successfully 🎉',
                // text: data.message || 'Welcome back!',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background:'#212121',
                color:'#fff'

            }).then(() => {
                navigate('/askgpt');
            })

        } catch (error) {
            console.error("Error during login:", error);
            Swal.fire({
                title: 'Login Failed ❌',
                text: error.message || 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });

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
                    />  <br />
                    <input
                        type="password"
                        placeholder='Enter your password'
                        onChange={handleInputChange}
                        name='password'
                        value={loginData.password}
                    /> <br />

                    <div className="btns">
                        <button className='login-btn' >Log in</button>
                        <Link to="/signup" className='signup-btn'>
                            Sign up
                        </Link>
                    </div>

                    <p>
                        if you don't have an account please signup*
                    </p>
                </form>
            </div>

        </div >
    );
}

export default Login;