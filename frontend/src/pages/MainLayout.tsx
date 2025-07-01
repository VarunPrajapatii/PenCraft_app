import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header';

const MainLayout = () => {
  const location = useLocation();

  const showHeader = () => {
    if (location.pathname.startsWith('/publish')) {
      return false;
    }
    if (location.pathname.startsWith('/signup') || location.pathname.startsWith('/signin')) {
      return true;
    }
    
    if (location.pathname.startsWith('/profile') || location.pathname.match(/^\/@/)) {
      return true;
    }
    
    // Show header on all other routes
    return true;
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Floating Header */}
        {showHeader() && (
          <div className='fixed top-0 left-0 right-0 z-50'>
            <Header />
          </div>
        )}

        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default MainLayout