import React , { useState }from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData (prev => ({
            ...prev,[e.target.name]: e.target.value
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/chat/signup', formData);
            if (response.status !== 201) {
                throw new Error('Signup failed');
            } else {
                console.log("Signup successful:", response.data);
                navigate('/');
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Signup failed. Please try again.");
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
                        <input type="text" id="name" name="name" placeholder='name' value={formData.name} onChange={handleChange}
 className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors">Sign Up</button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;