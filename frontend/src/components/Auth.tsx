import axios from 'axios'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../redux/types'
import { authenticate } from '../redux/slice/authSlice'
import { signupInput, signinInput } from '@varuntd/pencraft-common';

const Auth = ({type}: {type: "signup" | "signin"}) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [postInputs, setPostInputs] = useState({
    name: "",
    username: "",
    password: "",
  })
  const [usernameError, setUsernameError] = useState<string>("");
  const [showUsernameTooltip, setShowUsernameTooltip] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const access_token = useSelector((store: RootState) => store.auth.access_token);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if(event.key === "Enter" && submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  }

  async function sendRequest () {
    // Reset errors
    setUsernameError("");
    setNameError("");
    setPasswordError("");
    try {
      // Validate inputs using Zod
      if (type === "signup") {
        const result = signupInput.safeParse(postInputs);
        if (!result.success) {
          for (const issue of result.error.issues) {
            if (issue.path[0] === "username") setUsernameError(issue.message);
            if (issue.path[0] === "name") setNameError(issue.message);
            if (issue.path[0] === "password") setPasswordError(issue.message);
          }
          return;
        }
      } else {
        const result = signinInput.safeParse({
          username: postInputs.username,
          password: postInputs.password
        });
        if (!result.success) {
          for (const issue of result.error.issues) {
            if (issue.path[0] === "username") setUsernameError(issue.message);
            if (issue.path[0] === "password") setPasswordError(issue.message);
          }
          return;
        }
      }
      
      if (type === "signup") {
        const usernameCheckResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/check-username`, {
          username: postInputs.username
        });
        
        if (!usernameCheckResponse.data.available) {
          setUsernameError("Username already taken");
          return;
        }
      }
      
      const postInputsSignup = {name: postInputs.name, username: postInputs.username, password: postInputs.password};
      const postInputsSignin = {username: postInputs.username, password: postInputs.password};
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, type === "signup" ? postInputsSignup : postInputsSignin);
      
      
      const jwt = response.data.jwt;
      const userId = response.data.userId;
      const name = response.data.name;
      const profileImageUrl = response.data.profileImageUrl || null;
      const username = response.data.username;
      const authdata = {
          jwt,
          userId,
          name,
          username,
          profileImageUrl
      }
      
      dispatch(authenticate(authdata));
      navigate("/blogs")
    } catch (error) {
      console.error("Auth error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setUsernameError("Username already taken");
      } else {
        setUsernameError(`${type === "signup" ? "Error while signing up" : "Error while signing in"}`)
        setPasswordError(`${type === "signup" ? "Error while signing up" : "Error while signing in"}`)
      }
    }
  }


  return access_token ? (
    <Navigate to={"/blogs"} />
  ) : (
    <div className='h-screen flex justify-center flex-col ' onKeyDown={handleKeyPress} tabIndex={0}>
      <div className='flex  justify-center'>
        <div className='rounded-2xl p-10 sm:p-16 bg-white/10 backdrop-blur-xl shadow-lg'>
          <div className='px-3 sm:px-10'>
            <div className='text-3xl text-center text-white font-extrabold'>
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
              setNameError("");
            }} error={nameError} /> : null}
            <br />
            <UsernameInput 
              label='Username' 
              placeholder='kingkohli18' 
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  username: e.target.value
                })
                setUsernameError("");
              }}
              error={usernameError}
              showTooltip={showUsernameTooltip}
              setShowTooltip={setShowUsernameTooltip}
            />
            <br />
            <LabelledInput label='Password' type={"password"} placeholder='password' onChange={(e) => {
              setPostInputs({
                ...postInputs,
                password: e.target.value
              })
              setPasswordError("");
            }} error={passwordError} />
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
  error?: string;
}

interface UsernameInputProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
}


const LabelledInput: React.FC<LabelledInputProps> = ({ label, onChange, type, error }) => {
  return (
    <div className="relative mb-4">
      <input
        onChange={onChange}
        id={label.toLowerCase().replace(/\s+/g, '_')}
        type={type || "text"}
        placeholder=""
        className={`peer w-full rounded-lg border bg-gray-100 p-2.5 text-sm text-gray-900 ${error ? 'border-red-500' : ''}`}
        required
      />
      <span
        className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white ${error ? 'text-red-600' : 'text-gray-900'}`}
      >
        {label}
      </span>
      {error && (
        <div className="text-red-700 text-sm font-semibold mt-1">{error}</div>
      )}
    </div>
  );
};


const UsernameInput: React.FC<UsernameInputProps> = ({ label, onChange, error, showTooltip, setShowTooltip }) => {
  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            onChange={onChange}
            id={label.toLowerCase().replace(/\s+/g, '_')}
            type="text"
            placeholder=""
            className={`peer w-full rounded-lg border bg-gray-100 p-2.5 text-sm text-gray-900 ${error ? 'border-red-500' : ''}`}
            required
          />
          <span
            className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white ${error ? 'text-red-600' : 'text-gray-900'}`}
          >
            {label}
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="flex items-center justify-center w-5 h-5 text-xs text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            i
          </button>
          {showTooltip && (
            <div className="absolute bottom-6 sm:left-1/2 transform -translate-x-1/2 w-37 sm:w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg z-10">
              <div className="font-semibold mb-1">Username Requirements:</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Start with a letter</li>
                <li>Only letters, numbers, and underscores</li>
                <li>Cannot start/end with underscore</li>
                <li>No consecutive underscores</li>
                <li>5-30 characters long</li>
              </ul>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="text-red-700 text-sm font-semibold mt-1">{error}</div>
      )}
    </div>
  );
};


export default Auth
