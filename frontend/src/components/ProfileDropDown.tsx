import { useEffect, useRef, useState } from 'react';
import defaultProfilePicture from '/images/default_profile_picture.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';


const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const name = useSelector((store: RootState) => store.auth.name);
    const username = useSelector((store: RootState) => store.auth.username);
    const profileImageUrl = useSelector((store: RootState) => store.auth.profileImageUrl);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signOut = async () => {
        await axios.get(`${BACKEND_URL}/api/v1/auth/logout`, { withCredentials: true });
        console.log("User logged out successfully");
        dispatch(logout());
        navigate("/signin");
    }


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // Add your dark mode logic here
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center transition-all duration-300 hover:scale-105 focus:outline-none"
                aria-label="Profile menu"
            >
                {/* Avatar Container with Glow Effect */}
                <div className="relative">
                    {/* Glow Ring */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-600 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500 blur-xs ${isOpen ? 'opacity-60 animate-pulse' : ''}`}></div>

                    {/* Avatar Image */}
                    <div className="relative h-13 w-13 rounded-full overflow-hidden border-2 border-white/20 backdrop-blur-sm">
                        <img
                            src={profileImageUrl || defaultProfilePicture}
                            alt="Profile"
                            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            <div className={` absolute right-0 mt-3 w-55 origin-top-right transition-all duration-300 z-50 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                {/* Dark Glassmorphism Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-700/30">
                    {/* Dark glass background layers */}
                    <div className="absolute inset-0 bg-gray-500/90 backdrop-blur-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/60 via-gray-50/80 to-white"></div>


                    <div className="relative">
                        {/* Header Section */}
                        <div className="relative p-4 bg-gradient-to-r from-gray-700 via-gray-500 to-black/30 backdrop-blur-xl border-b border-gray-700/30">
                            {/* Header glass overlay */}
                            <div className="relative flex items-center space-x-3">
                                <div className="text-white">
                                    <p className="font-semibold text-lg text-white">{name}</p>
                                    <p className="text-gray-300 text-sm">@{username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="relative p-1  backdrop-blur-sm">
                            {/* Menu items background glass effect */}
                            <div className="absolute inset-0 bg-gray-200 backdrop-blur-sm"></div>

                            <div className="relative space-y-1">
                                {/* View Profile */}
                                <Link to={`/@${username}`} >
                                    <button className="w-full flex items-center px-2 py-2 text-black hover:bg-gray-700/50 hover:text-gray-100 hover:backdrop-blur-xl rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent  to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                        <svg className="relative h-4.5 w-4.5  mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="relative font-medium">View Profile</span>
                                    </button>
                                </Link>

                                {/* Settings */}
                                <Link to={`/@${username}/editProfile`}>
                                    <button className="w-full flex items-center px-2 py-2  text-black hover:bg-gray-700/50 hover:text-gray-100 hover:backdrop-blur-2xl rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                        <svg className="relative h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="relative font-medium">Settings</span>
                                    </button>
                                </Link>

                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="w-full flex items-center justify-between px-3 py-2 text-black hover:bg-gray-700/50 hover:text-gray-100 hover:backdrop-blur-2xl rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    <div className="relative flex items-center">
                                        <svg className={`h-5 w-5 mr-3 transition-all duration-300 ${isDarkMode ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {isDarkMode ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            )}
                                        </svg>
                                        <span className="font-medium text-black group-hover:text-gray-100">{isDarkMode ? 'Light' : 'Dark-Coming'}</span>
                                    </div>
                                    {/* Enhanced glass toggle switch */}
                                    <div className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-600/80' : 'bg-gray-500/80'} backdrop-blur-sm border border-gray-600/30`}>
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white/90 backdrop-blur-sm rounded-full transition-transform duration-300 shadow-lg ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </button>

                                {/* Enhanced divider */}
                                <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
                                </div>

                                {/* Sign Out with enhanced glass */}
                                <button 
                                onClick={signOut}
                                className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-600/80 hover:text-red-100 hover:backdrop-blur-2xl rounded-xl rounded-b-2xl transition-all duration-200 group relative overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-800/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    <svg className="relative h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="relative font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown;