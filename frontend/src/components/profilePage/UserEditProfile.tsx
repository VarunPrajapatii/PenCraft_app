import { useState } from 'react';
import { useChangePassword, useChangeUsername } from '../../hooks/hooks';

const UserEditProfile = () => {
  // input data states
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // eye button states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // error states 
  const [usernameError, setUsernameError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const {usernameChangeLoading, changeUsername} = useChangeUsername();
  const {passwordChangeLoading, changePassword} = useChangePassword();

  const handleUsernameChange = async () => {
    setUsernameError('');
    
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    if (username.length < 5) {
      setUsernameError('Username must be at least 5 characters');
      return;
    }

    try {
      const result = await changeUsername(username);
      console.log("results: " , result);
      
      if (!result.canChangeUsername && !result.success) {
        setUsernameError(result.message || 'You can only change your username once every 60 days!');
        setUsername('');
      } else if (result.canChangeUsername && !result.success) {
        setUsernameError(result.message || 'Username already exists!');
      } else if(result.success) {
        alert('Username changed successfully!');
        setUsername('');
      } else {
        setUsernameError(result.message || 'Failed to change username. Please try again.');
      }
    } catch (error) {
      setUsernameError('trycatch: Failed to change username. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    setCurrentPasswordError('');
    setNewPasswordError('');

    if (!currentPassword.trim()) {
      setCurrentPasswordError('Current password is required');
      return;
    }

    if (!newPassword.trim()) {
      setNewPasswordError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError('New password must be at least 6 characters');
      return;
    }

    if (currentPassword === newPassword) {
      setNewPasswordError('New password must be different from current password');
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else if (!result.isPasswordCorrect) {
        setCurrentPasswordError('Current password is incorrect');
      } else {
        setNewPasswordError('Failed to change password. Please try again.');
      }
    } catch (error) {
      setCurrentPasswordError('Current password is incorrect');
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h1>
      
      {/* Username Change Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Username</h2>
        
        <div className="space-y-4">
          <div className="relative mb-4">
            <input
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="text"
              placeholder=""
              value={username}
              className={`peer w-full rounded-lg border bg-gray-100 p-2.5 text-sm text-gray-900 ${usernameError ? 'border-red-500' : ''}`}
              required
            />
            <span
              className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white ${usernameError ? 'text-red-600' : 'text-gray-900'}`}
            >
              New Username
            </span>
            {usernameError && (
              <div className="text-red-700 text-sm font-semibold mt-1">{usernameError}</div>
            )}
          </div>

          <button
            type="button"
            onClick={handleUsernameChange}
            disabled={usernameChangeLoading}
            aria-label="Change username"
            className="group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200
                      px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                      font-semibold text-black shadow transition-all duration-200
                      hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                      hover:shadow-lg hover:scale-105
                      active:scale-95 active:shadow
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {usernameChangeLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 lg:mr-2"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
            <span className="hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
              {usernameChangeLoading ? 'Changing...' : 'Change Username'}
            </span>
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
        
        <div className="space-y-4">
          {/* Current Password */}
          <div className="relative mb-4">
            <input
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="current_password"
              type={showCurrentPassword ? "text" : "password"}
              placeholder=""
              value={currentPassword}
              className={`peer w-full rounded-lg border bg-gray-100 p-2.5 pr-12 text-sm text-gray-900 ${currentPasswordError ? 'border-red-500' : ''}`}
              required
            />
            <span
              className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white ${currentPasswordError ? 'text-red-600' : 'text-gray-900'}`}
            >
              Current Password
            </span>
            <button
              type="button"
              onClick={toggleCurrentPasswordVisibility}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
            {currentPasswordError && (
              <div className="text-red-700 text-sm font-semibold mt-1">{currentPasswordError}</div>
            )}
          </div>

          {/* New Password */}
          <div className="relative mb-4">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              id="new_password"
              type={showNewPassword ? "text" : "password"}
              placeholder=""
              value={newPassword}
              className={`peer w-full rounded-lg border bg-gray-100 p-2.5 pr-12 text-sm text-gray-900 ${newPasswordError ? 'border-red-500' : ''}`}
              required
            />
            <span
              className={`pointer-events-none absolute start-2.5 top-2.5 bg-gray-100 rounded-lg px-1 text-sm font-medium transition-all peer-focus:-translate-y-4 peer-focus:scale-90 peer-placeholder-shown:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-white ${newPasswordError ? 'text-red-600' : 'text-gray-900'}`}
            >
              New Password
            </span>
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
            {newPasswordError && (
              <div className="text-red-700 text-sm font-semibold mt-1">{newPasswordError}</div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={passwordChangeLoading}
            aria-label="Change password"
            className="group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200
                      px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                      font-semibold text-black shadow transition-all duration-200
                      hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                      hover:shadow-lg hover:scale-105
                      active:scale-95 active:shadow
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {passwordChangeLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 lg:mr-2"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
            )}
            <span className="hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
              {passwordChangeLoading ? 'Changing...' : 'Change Password'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditProfile;