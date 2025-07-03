import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData(prev => ({ 
            ...prev, [e.target.name]: e.target.value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/chat/login', formData);
            if (response.status !== 200) {
                throw new Error('Login failed');
            } else {
                console.log("Login successful:", response.data);
                localStorage.setItem('x-auth-token', response.data.sessionId);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" name='email' placeholder='Email' onChange={handleChange} value={formData.email} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" name='password' placeholder='Password' onChange={handleChange} value={formData.password} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors">Login</button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;