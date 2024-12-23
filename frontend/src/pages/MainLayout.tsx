import { AppBar } from '../components/AppBar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import { useLoggedInUserDetails } from '../hooks/hooks';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/slice/userProfileSlice';
import { useEffect } from 'react';

const MainLayout = () => {

  const dispatch = useDispatch();
  const { userProfileDetails } = useLoggedInUserDetails();

  useEffect(() => {
    if (userProfileDetails) {
      dispatch(setUserProfile(userProfileDetails));
    }
  }, [userProfileDetails, dispatch]);


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AppBar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default MainLayout