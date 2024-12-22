import { AppBar } from './AppBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { useLoggedInUserDetails } from '../hooks/hooks';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/slice/userProfileSlice';
import { useEffect } from 'react';

const Layout = () => {

  const dispatch = useDispatch();
  const { userProfileDetails } = useLoggedInUserDetails();

  useEffect(() => {
    if (userProfileDetails) {
      dispatch(setUserProfile(userProfileDetails));
    }
  }, [userProfileDetails, dispatch]);


  return (
    <>
        <AppBar />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout