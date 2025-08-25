import '../../Styles/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const API_URL = import.meta.env.VITE_ASKGPT_API_URL;

import { useState } from 'react';
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
        if (!signupData.name || !signupData.email || !signupData.password) {
            Swal.fire({
                position: "top",
                icon: "warning",
                title: "Please fill your signup details",
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
            body: JSON.stringify(signupData)
        }
        try {
            const res = await fetch(`${API_URL}/user/signup`, options)
            //    console.log(res)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Signup failed");
            //  console.log("Response from server:", data);
            localStorage.setItem('token', data.token);

            if (data.user?.role) {
                localStorage.setItem("role", data.user.role);
                // console.log("Role saved:", data.user.role);
            }
            localStorage.setItem('user', JSON.stringify(data.user));

            Swal.fire({
                title: 'Signup Successfully 🎉',
                // text: data.message || 'Welcome back!',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background: '#212121',
                color: '#fff'

            }).then(() => {
                navigate('/login');
            })

        } catch (error) {
            console.error("Error during signup:", error);
            Swal.fire({
                title: 'Signup Failed ❌',
                text: error.message || 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
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

                    />  <br />
                    <input
                        type="email"
                        placeholder='Enter your email'
                        name='email'
                        onChange={handleInputChange}
                        value={signupData.email}

                    />  <br />
                    <input
                        type="password"
                        placeholder='Create your password'
                        name='password'
                        onChange={handleInputChange}
                        value={signupData.password}

                    /> <br />

                    <div className="btns">
                        <button className='signup-btn'>Sign up</button>

                        <Link to="/login" className='login-btn' >
                            Login
                        </Link>

                    </div>
                    <p>
                        if you Already have an account please login*
                    </p>
                </form>
            </div>

        </div>
    );
}

export default Signup;