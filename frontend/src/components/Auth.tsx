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
      const postInputsSignup = {name: postInputs.name, email: postInputs.email, password: postInputs.password};
      const postInputsSignin = {email: postInputs.email, password: postInputs.password};
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, type === "signup" ? postInputsSignup : postInputsSignin);
      const jwt = response.data.jwt;
      const userId = response.data.userId;
      const name = response.data.name;
      const profileImageUrl = response.data.profileImageUrl || null;
      const email = response.data.email;
      const authdata = {
        jwt,
        userId,
        name,
        email,
        profileImageUrl
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
        <div className='rounded-2xl p-16 bg-white/10 backdrop-blur-xl shadow-lg'>
          <div className='px-10'>
            <div className='text-4xl text-white font-extrabold'>
              {type === 'signup' ? "Create an account" : "Signin to PenCraft"}
            </div>
            <div className='text-black font-semibold py-2 text-center'>
              {type === 'signin' ? "Don't have an account?" : "Already have an account?" }
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
              className="mt-8 w-full bg-gray-800 text-white border border-gray-300 focus:outline-none hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
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


const LabelledInput: React.FC<LabelledInputProps> = ({ label, onChange, type }) => {
  return (
    <div className="relative mb-4">
      <input
        onChange={onChange}
        id={label.toLowerCase().replace(/\s+/g, '_')}
        type={type || "text"}
        placeholder=""
        className="peer w-full rounded-lg border  bg-gray-100 p-2.5 text-sm text-gray-900"
        required
      />
      <span
        className="pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium text-gray-900 transition-all peer-focus:-translate-y-4 peer-focus:scale-90   peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white"
      >
        {label}
      </span>
    </div>
  );
};


export default Auth
