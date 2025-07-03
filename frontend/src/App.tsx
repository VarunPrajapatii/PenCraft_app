import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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

          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Navigate to="/error" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
