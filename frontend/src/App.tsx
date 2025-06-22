import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blog from './pages/Blog';
import Error from './pages/Error';
import Blogs from './pages/Blogs';
import { Publish } from './pages/Publish';
import MainLayout from './pages/MainLayout';
import UserBlogs from './components/profilePage/UserBlogs';
import ProfileLayout from './pages/ProfileLayout';
import UserFollowers from './components/profilePage/UserFollowers';
import UserFollowing from './components/profilePage/UserFollowing';
import LoggedInUserEditProfile from './components/profilePage/LoggedInUserEditProfile';
import Landing from './pages/Landing';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />

          <Route element={<MainLayout/>}>
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/publish' element={<Publish />} />
            <Route element={<ProfileLayout/>}>
              <Route path='/:email' element={<UserBlogs />} />
              <Route path='/:email/followers' element={<UserFollowers />} />
              <Route path='/:email/following' element={<UserFollowing />} />
              <Route path='/:email/editProfile' element={<LoggedInUserEditProfile />} />
            </Route>
          </Route>

          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Navigate to="/error" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
