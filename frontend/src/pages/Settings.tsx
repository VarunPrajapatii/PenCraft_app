import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL } from '../config';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';

const Settings = () => {
  // Correct type for `authCheck`
  const [authCheck, setAuthCheck] = useState<boolean | null>(null); // null: loading, true: authenticated, false: not authenticated
  const dispatch = useDispatch();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('pencraft_token');
    const user = JSON.parse(localStorage.getItem('pencraft_user') || 'null');
    console.log("Token:", token, "User:", user);

    if (token && user && !hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      axios
        .post(`${BACKEND_URL}/api/v1/auth/checkAuth`, {
          pencraft_token: token,
          pencraft_user: user,
        }, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("Auth response:", response);
          if (response.status === 200) {
            setAuthCheck(true);
          } else {
            setAuthCheck(false);
          }
        })
        .catch((error) => {
          setAuthCheck(false);
          console.error("Error in checking auth", error);
        });
    } else {
      setAuthCheck(false);
    }
  }, []);

  if (authCheck === null) {
    return <div>Loading...</div>
  }

  if (authCheck === false) {
    if (!hasCheckedAuth.current) {
      dispatch(logout());
    }
    return <div>not authenticated</div>
  }

  return (
    <div>
      <div className="mx-[5%]">
        <div className="text-5xl font-bold mt-[5%]">Settings</div>
        <div className="pt-8 pb-2 text-xl text-gray-600 border-b-2">
          {/* Add your settings content here */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
