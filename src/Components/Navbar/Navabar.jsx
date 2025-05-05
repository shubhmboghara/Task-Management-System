import React, { useState } from 'react'
import { useLocation, Link, useNavigate, } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { Menu, X } from 'lucide-react'

function Navabar() {
  const location = useLocation()
  const { Logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)


  const handleLogout = () => {
    console.log("Logout clicked");
    Logout(navigate)
    Logout()
  }
  const linkClasses = (path) =>
    `hover:text-white cursor-pointer transition ${location.pathname === path ? 'text-blue-400 underline' : ''
    }`

  const isAdminPanel = location.pathname === '/adminpanel' || location.pathname === '/view-users'|| location.pathname === '/tasks-list'
  const isDashboard = location.pathname === '/dashboard'
  const forhome = location.pathname == '/view-users' || location.pathname === '/tasks-list' || location.pathname === '/view-users'

  const path = () => {
    if (isAdminPanel) return "Admin Panel";
    if (isDashboard) return "dashboard";
  }


  return (
    <div className="bg-[#0d0d1a] border-b border-gray-700 shadow-md text-[#f1f5f9]  fixed w-full	z-500000">

      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <div className="text-1xl font-bold text-white tracking-wide ">{path()}</div>

        <ul className=" hidden md:flex gap-10 text-gray-300 font-semibold ">

          {forhome && (
            <>

              <li>
                <Link to="/adminpanel">Home</Link>
              </li>
            </>
          )}

          {isAdminPanel && (
            <>
              <li className={linkClasses('/tasks-list')}>
                <Link to="/tasks-list">  Tasks List </Link>
              </li>


        
              <li className={linkClasses('/view-users')}>
                <Link to="/view-users">View Users</Link>
              </li>

            </>
          )}

          <li className=" cursor-pointer transition" >

            <button className='bg-blue-600 text-white rounded-md p-1 ' onClick={handleLogout}>Logout</button>

          </li>

        </ul>


        <div className='md:hidden flex items-center gap-4'>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </nav>


      
      {menuOpen && (
        <ul className="flex flex-col absolute top-16 left-0 w-full bg-[#0d0d1a] text-gray-300 font-semibold px-6 py-4 space-y-4 md:hidden">
          {forhome && (
            <li>
              <Link to="/adminpanel" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>

            
          )}
          {isAdminPanel && (
            <>
              
              <li className={linkClasses('/view-users')}>
                <Link to="/view-users" onClick={() => setMenuOpen(false)}>View Users</Link>
              </li>

              <li className={linkClasses('/tasks-list')}>
                <Link to="/tasks-list">  Tasks List </Link>
              </li>

            </>
          )}
          <li>
            <button className="bg-blue-600 text-white rounded-md p-1" onClick={() => { handleLogout(); setMenuOpen(false); }}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>

  )
}

export default Navabar