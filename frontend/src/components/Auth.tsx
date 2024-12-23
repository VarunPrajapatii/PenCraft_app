import { SignupInput } from '@varuntd/pencraft-common'
import axios from 'axios'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../redux/types'
import { authenticate } from '../redux/slice/authSlice'

const Auth = ({type}: {type: "signup" | "signin"}) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const access_token = useSelector((store: RootState) => store.auth.access_token);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if(event.key === "Enter" && submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  }

  async function sendRequest () {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, postInputs);
      const jwt = await response.data.jwt;
      const userId = await response.data.userId;
      const authdata = {
        jwt,
        userId
      }
      dispatch(authenticate(authdata));
      navigate("/blogs")
    } catch (error) {
      alert(`${type === "signup" ? "Error while signing up" : "Error while signing in"}`)
    }
  }


  return access_token ? (
    <Navigate to={"/blogs"} />
  ) : (
    <div className='h-scren flex justify-center flex-col ' onKeyDown={handleKeyPress} tabIndex={0}>
      <div className='flex  justify-center'>
        <div className='bg-gray-700 rounded-2xl p-16'>
          <div className='px-10'>
            <div className='text-4xl text-white font-extrabold'>
              Create an account
            </div>
            <div className='text-slate-400 py-2 text-center'>
              {type === 'signin' ? "Don't have an account?" : "Already have account?" }
              <Link className='pl-2 underline' to={type === "signin" ? "/signup" : "/signin" }>
                {type === "signin" ? "Sign up" : "Sign in" }
              </Link>
            </div>
          </div>
          <div className='pt-8'>
            {type === "signup" ? <LabelledInput label='Name' placeholder='Virat Kohli' onChange={(e) => {
              setPostInputs({
                ...postInputs,
                name: e.target.value
              })
            }} /> : null}
            <br />
            <LabelledInput label='Email' placeholder='kingkohli@mail.com' onChange={(e) => {
              setPostInputs({
                ...postInputs,
                email: e.target.value
              })
            }} />
            <br />
            <LabelledInput label='Password' type={"password"} placeholder='password' onChange={(e) => {
              setPostInputs({
                ...postInputs,
                password: e.target.value
              })
            }} />
          </div>
          <div className=''>
            <button 
              onClick={sendRequest}
              ref={submitButtonRef}
              type="button" 
              className="mt-8 w-full bg-gray-900 text-white border border-gray-300 focus:outline-none hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              {type === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


interface LabelledInputProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}


const LabelledInput: React.FC<LabelledInputProps> = ({ label, placeholder, onChange, type }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-white">{label}</label>
      <input 
        onChange={onChange} 
        id="first_name" 
        type={type || "text"}
        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
        placeholder={placeholder} required 
      />
    </div>
  )
}


export default Auth
