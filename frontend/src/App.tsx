import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blog from './pages/Blog';
import Error from './pages/Error';
import Blogs from './pages/Blogs';
import { Publish } from './pages/Publish';
import Home from './pages/Home';
import BlogsFE from './pages/BlogsFE';
import Shimmers from './pages/Shimmers';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/signin" />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/error' element={<Error />} />
          <Route path='/publish' element={<Publish />} />
          <Route path='/blogsFE' element={<BlogsFE />} />
          <Route path='/shimmerFE' element={<Shimmers />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
