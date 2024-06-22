import React from 'react'
import Quotes from '../components/Quotes'
import Auth from '../components/Auth'

const Signup = () => {
  return (
    <div>
        <div className='grid grid-cols-1 lg:grid-cols-2 '>
            <div className='flex justify-center flex-col'>
                <Auth type='signup' />
            </div>
            <div className='hidden md:block'>
                <Quotes />
            </div>
        </div>
    </div>
  )
}

export default Signup
