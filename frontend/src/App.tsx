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
import Settings from './pages/Settings';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/signin" />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />

          <Route element={<MainLayout/>}>
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/publish' element={<Publish />} />
            <Route path='/settings' element={<Settings />} />
            <Route element={<ProfileLayout/>}>
              <Route path='/:email' element={<UserBlogs />} />
              <Route path='/:email/followers' element={<UserFollowers />} />
              <Route path='/:email/following' element={<UserFollowing />} />
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
