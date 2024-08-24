// import React from 'react'
import Auth from '../components/Auth'
import Quotes from '../components/Quotes'

const Signin = () => {
  return (
    <div>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className='flex justify-center flex-col'>
                <Auth type='signin' />
            </div>
            <div className='invisible md:visible'>
                <Quotes />
            </div>
        </div>
    </div>
  )
}

export default Signin
