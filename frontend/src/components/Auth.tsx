import axios from 'axios'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
  const [loading, setLoading] = useState<boolean>(false);

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.auth.user);

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
    setLoading(true);
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
          setLoading(false);
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
            setLoading(false);
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
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, 
        type === "signup" ? postInputsSignup : postInputsSignin,
        { withCredentials: true }
      );
      
      
      const userId = response.data.userId;
      const name = response.data.name;
      const profileImageUrl = response.data.profileImageUrl || null;
      const username = response.data.username;
      const authdata = {
          userId,
          name,
          username,
          profileImageUrl
      }
      
      dispatch(authenticate(authdata));
      setLoading(false);
      
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


  return user ? (
    <Navigate to={"/blogs"} />
  ) : (
    <div className='font-subtitle h-screen max-w-lg flex justify-center flex-col ' onKeyDown={handleKeyPress} tabIndex={0}>
      <div className='flex  justify-center text-center'>
        <div className='rounded-2xl p-10 sm:p-16 bg-white/10 dark:bg-black/20 backdrop-blur-xl shadow-lg'>
          <div className='px-3 sm:px-10'>
            <div className='font-title text-3xl text-center text-white dark:text-gray-100 font-extrabold'>
              {type === 'signup' ? "Create an account" : "Signin to PenCraft"}
            </div>
            <div className='font-body text-black dark:text-white font-semibold py-2 text-center'>
              {type === 'signin' ? "Don't have an account?" : "Already have an account?" }
              <Link className='pl-2 underline hover:text-blue-600 dark:hover:text-blue-400' to={type === "signin" ? "/signup" : "/signin" }>
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
          <div className='font-subtitle '>
            <button
              onClick={sendRequest}
              ref={submitButtonRef}
              type="button"
              aria-label={type === 'signup' ? 'Sign up' : 'Sign in'}
              disabled={loading}
              className={`mt-8 w-full md:w-[50%] group relative inline-flex items-center justify-center cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700
                px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                font-semibold text-black dark:text-white shadow transition-all duration-200
                hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                dark:hover:from-blue-500/30 dark:hover:to-red-500/30
                hover:shadow-lg hover:scale-105
                active:scale-95 active:shadow
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-red-500
                ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-blue-700 dark:border-blue-400 lg:mr-2"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                  className="md:inline-block size-4 sm:size-6 mr-1 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700 dark:group-hover:text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              )}
              <span className="block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700 dark:group-hover:text-red-400">
                {type === 'signup' ? 'Sign up' : 'Sign in'}
              </span>
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
    <div className="font-subtitle relative mb-4">
      <input
        onChange={onChange}
        id={label.toLowerCase().replace(/\s+/g, '_')}
        type={type || "text"}
        placeholder=""
        className={`peer w-full rounded-lg border bg-gray-100 dark:bg-gray-700 p-2.5 text-sm focus:outline-none text-gray-900 dark:text-gray-100 ${error ? 'border-red-500' : 'dark:border-gray-600'}`}
        required
      />
      <span
        className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-800 ${error ? 'text-red-600' : 'text-gray-900 dark:text-gray-300'}`}
      >
        {label}
      </span>
      {error && (
        <div className="text-red-700 dark:text-red-400 text-sm font-semibold mt-1">{error}</div>
      )}
    </div>
  );
};


const UsernameInput: React.FC<UsernameInputProps> = ({ label, onChange, error, showTooltip, setShowTooltip }) => {
  return (
    <div className="font-subtitle relative mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            onChange={onChange}
            id={label.toLowerCase().replace(/\s+/g, '_')}
            type="text"
            placeholder=""
            className={`peer w-full rounded-lg border bg-gray-100 dark:bg-gray-700 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none ${error ? 'border-red-500' : 'dark:border-gray-600'}`}
            required
          />
          <span
            className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-800 ${error ? 'text-red-600' : 'text-gray-900 dark:text-gray-300'}`}
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
            className="flex items-center justify-center w-5 h-5 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none"
          >
            i
          </button>
          {showTooltip && (
            <div className="absolute bottom-6 sm:left-1/2 transform -translate-x-1/2 w-37 sm:w-64 p-3 text-xs text-white dark:text-gray-200 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg z-10">
              <div className="font-semibold mb-1">Username Requirements:</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Start with a letter</li>
                <li>Only letters, numbers, and underscores</li>
                <li>Cannot start/end with underscore</li>
                <li>No consecutive underscores</li>
                <li>5-30 characters long</li>
              </ul>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800 dark:border-t-gray-700"></div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="text-red-700 dark:text-red-400 text-sm font-semibold mt-1">{error}</div>
      )}
    </div>
  );
};


export default Auth
