import React from 'react'
import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
import Admin_Panel from './Components/Admin_Panel/Admin_Panel';
import ViewUsers from './Components/ViewUsers/ViewUsers';
import Tasklist from './Components/Tasklist/Tasklist';
import { useAuth } from './Context/AuthContext';

function App() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Routes>

      <Route path='/'
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />}
      />

      <Route
        path='/login'
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path='/signup'
        element={user ? <Navigate to='/dashboard' /> : <Signup />} />

      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/adminpanel" />
            ) : (
              <Dashboard />
            )
          ) : (
            <Navigate to="/signup" />
          )
        }
      />
      <Route path='/adminpanel'
        element={
          !user
            ? <Navigate to='/signup' />
            : user.role === 'admin'
              ?
              <Admin_Panel /> : <Navigate to='/dashboard' />}
      />
    

      <Route  path='/view-users'
       
       element={
        user ? (
          user.role === "admin" ? (
            <ViewUsers  />
          ) : (
            <Navigate to='/dashboard' />
          )
        ) : (
          <Navigate to="/signup" />
        )
      }
   />


<Route
  path='/tasks-list'
  element={
    user ? (
      user.role === "admin" ? (
        <Tasklist />
      ) : (
        <Navigate to='/dashboard' />
      )
    ) : (
      <Navigate to="/signup" />
    )
  }
/>


    </Routes>
  )
}

export default App
