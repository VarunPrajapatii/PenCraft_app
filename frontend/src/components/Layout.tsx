import React from 'react'
import { AppBar } from './AppBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Layout = () => {
  return (
    <>
        <AppBar />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout