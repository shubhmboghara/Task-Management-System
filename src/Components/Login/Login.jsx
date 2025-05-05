import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Login = () => {

   const { Login } = useAuth()

   const [emailphone, setEmailphone] = useState('')

   const [password, setPassword] = useState('')
   const navigate = useNavigate()
   const [username, setUsername] = useState("")
   const [errormessage, setErrorMessage] = useState("")


   const hanleLogin = (e) => {
      e.preventDefault()
      const isEmail = /\S+@\S+\.\S+/.test(emailphone)
      const isPhone = /^[0-9]{10}$/.test(emailphone)

      if (!emailphone.trim() || !password.trim() || !username.trim()) {
         setErrorMessage('Please fill out all fields.');
         return;
      }
      else {
         setErrorMessage("")
      }

      if(!isEmail && !isPhone){
         setErrorMessage('Enter a valid email address or phone number.');
         return
      }
       setErrorMessage("")
       Login(emailphone, password, username, navigate)

   }


   return (

      <div className='bg-[#000015] w-full min-h-screen items-center flex justify-center text-white'>
         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 border rounded-xl  w-full max-w-sm shadow-lg bg-[#0a0a3b] border-[#1c1c6b]"
            style={{
               boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
            }}>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <form onSubmit={hanleLogin} className="flex flex-col space-y-4">

               <input
                  type='text'
                  placeholder='Username'
                  className="border border-gray-300 px-4 py-2 rounded-md"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

               <input
                  type="text"
                  placeholder="Email or phone number"
                  value={emailphone}
                  className="border border-gray-300 px-4 py-2 rounded-md"
                  onChange={(e) => setEmailphone(e.target.value)} 
                  required
               />

             
               <input
                  type="password"
                  placeholder="Password"
                  className="border border-gray-300 px-4 py-2 rounded-md"
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               {errormessage && (
                  <div className="text-red-500 text-center">{errormessage}</div>
               )}


               <span className=' p-2 flex  justify-between'>

                  <Link to="/signup">
                     <button
                        type="button"
                        className="flex items-center gap-2 bg-gray-600  px-4 py-2 rounded-md hover:bg-gray-700  transition text-white"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-5 w-5"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Sigup</span>
                     </button>
                  </Link>

                  <button
                     type="submit"
                     className="bg-[#1a2b95] e py-2 rounded-md hover:bg-blue-700 transition p-7"

                  >
                     Login
                  </button>
               </span>

            </form>


         </div>

      </div>
   )

}


export default Login