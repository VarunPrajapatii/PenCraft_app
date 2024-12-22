import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blog from './pages/Blog';
import Error from './pages/Error';
import Blogs from './pages/Blogs';
import { Publish } from './pages/Publish';
import Layout from './components/Layout';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/signin" />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />

          <Route element={<Layout/>}>
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/publish' element={<Publish />} />
          </Route>
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Navigate to="/error" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
