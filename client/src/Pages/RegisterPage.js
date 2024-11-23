import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react';
import api from '../API/api.js'

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-800 border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500 
        text-gray-200 placeholder-gray-400"
    />
    <Icon className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
  </div>
);

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const Register = async (e) => {

      e.preventDefault()

      if(username === '' || password === '' || confirmPassword === '') {
        alert('Empty Input Fields')
      }
      else if(password !== confirmPassword) {
        alert('Passwords Does Not Match')
      }
      else {
        const userData = {
          "username": username,
          "email": username+"@gmail.com",
          "dob": "1000-01-01",
          "password": password
          }
        try {
          const response = await api.post('/user/register', userData)
          if(response.status) {
            navigate('/chat', { state : { username } })
          }
          else {
            alert("Error, Could Not Create Account")
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  
    return (
      <div className="min-h-screen h-screen w-full bg-gray-900 grid grid-cols-3">

        <div className="col-span-2 bg-gray-800 rounded-r-3xl p-8">

        </div>
  

        <div className="p-8 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Welcome to iShowChat</h1>
            <p className="text-gray-400 mb-8">Create your account to get started</p>
  
            <form className="space-y-4">
              <Input
                icon={User}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
  
              <Input
                icon={Lock}
                type="password"
                placeholder="Retype Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
  
              <button 
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 
                  text-gray-100 rounded-lg font-medium
                  transition-colors duration-200"
                onClick={Register}
              >
                Create Account
              </button>
            </form>
  
            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
};

export default RegisterPage