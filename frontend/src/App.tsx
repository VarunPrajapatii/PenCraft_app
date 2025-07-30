import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blog from './pages/Blog';
import Error from './pages/Error';
import Blogs from './pages/Blogs';
import { Publish } from './pages/Publish';
import MainLayout from './pages/MainLayout';
import UserPublished from './components/profilePage/UserPublished';
import ProfileLayout from './pages/ProfileLayout';
import UserFollowers from './components/profilePage/UserFollowers';
import UserFollowing from './components/profilePage/UserFollowing';
import Landing from './pages/Landing';
import UserDrafts from './components/profilePage/UserDrafts';
import UserEditProfile from './components/profilePage/UserEditProfile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from './config';
import { useDispatch } from 'react-redux';
import { authenticate, logout } from './redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from './redux/types';
import FullScreenLoading from './components/shimmers/FullScreenLoading';
import ThemeProvider from './components/ThemeProvider';

function App() {
  function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/auth/me`, { withCredentials: true })
        .then(response => {
          dispatch(authenticate(response.data));
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <div><FullScreenLoading /></div>;

    return <>{children}</>;
  }

  function ProtectedRoute() {
    const user = useSelector((store: RootState) => store.auth.user);
    if (!user) {
      return <Navigate to="/" replace />;
    }
    // Render nested routes
    return <Outlet />;
  }

  function PublicRoute({ children }: { children: React.ReactNode }) {
    const user = useSelector((store: RootState) => store.auth.user);
    if (user) {
      return <Navigate to="/blogs" replace />;
    }
    return <>{children}</>;
  }


  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path='/signup' element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path='/signin' element={<PublicRoute><Signin /></PublicRoute>} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout/>}>
                <Route path='/blogs' element={<Blogs />} />
                <Route path='/blog/:id' element={<Blog />} />
                <Route path='/publish' element={<Publish />} />
                <Route path='/draftBlog/:blogId' element={<Blog />} />
                <Route path='/draftEdit/:blogId' element={<Publish />} />
                <Route element={<ProfileLayout/>}>
                  <Route path='/:username' element={<UserPublished />} />
                  <Route path='/:username/followers' element={<UserFollowers />} />
                  <Route path='/:username/following' element={<UserFollowing />} />
                  <Route path='/:username/drafts' element={<UserDrafts />} />
                  <Route path='/:username/editProfile' element={<UserEditProfile />} />
                </Route>
              </Route>
            </Route>

            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Navigate to="/error" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
