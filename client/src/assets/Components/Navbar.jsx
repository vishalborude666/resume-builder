import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../app/features/authSlice';
const Navbar = () => {
    const {user}= useSelector(state => state.auth)
    const dispatch = useDispatch() 
    const navigate = useNavigate()
  const logoutUser=()=>{
    // dispatch logout first to clear auth state/localStorage,
    // then navigate to the app route so Layout will render the Login view
    dispatch(logout())
    navigate('/app')


  }
  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
<Link to='/'> 
     <img src='/logo.svg' alt='logo' className='h-11 w-auto' />
      </Link>
<div className='flex items-center gap-4 text-sm'>
  <p className='max-sm:hidden'> hi ,{user?.name}</p>
  <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
</div>
      </nav>
      
      </div>
  )
}

export default Navbar;
