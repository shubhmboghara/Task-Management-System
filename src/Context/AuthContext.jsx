import React, { children, createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import conf from "../conf/conf";
const Authcontex = createContext();



export const Authprovider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null)
    const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || null)


    const signup = (
        email,
        mobileNumber,
        password,
        username,
        name,
        navigate,
        gender,
        role) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.some(u => u.email === email)) {
            alert("User with this email already exists. Please log in.");
            return
        }

        if (users.some(u => u.username === username)) {
            alert("Username already taken. Please choose a different username.");
            return
        }
        if (users.some(u => u.mobileNumber === mobileNumber)) {

            alert("User with this mobileNumber already exists. Please log in.");

        }
        const newUser = {
            email,
            mobileNumber,
            password,
            username,
            name,   
            navigate,
            gender,
            role
        }


        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users)); // Save all users back to localStorage Save updated array of users to localStorage
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser)); // Save logged in user


        alert(`signed successful`);
        navigate("/dashboard")




    }


    const Login = (email, password, username, navigate) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");


        if (email === conf.EMAIL &&
            password == conf.PASSWORD &&
            username == conf.USERNAME

        ) {

            const adminData = {
                role: conf.ROLE,
                name:conf.NAME
            }

            setUser(adminData)
            localStorage.setItem("user", JSON.stringify(adminData))
            navigate("/adminpanel")
            return;
        }

        const foundUser = users.find(u =>
            u.email === email &&
            u.password === password &&
            u.username === username
        );

        if (foundUser) {

            setUser(foundUser)
            localStorage.setItem("user", JSON.stringify(foundUser)); // CURRENT LOGGED-IN USER
            alert("Login successful")
            navigate("/dashboard");
        }
        else {
            alert("something is wrong ")
        }
        console.log("User Login up:", { email });


    }

    const Logout = (navigate) => {
        setUser(null)
        localStorage.removeItem("user")
        navigate('/login'); 
        ('/login')
        console.log("User Logout up:", { email });
        alert("Logged out successfully.");
    }



    return (
        <Authcontex.Provider value={{ signup, Login, Logout, user, users }}>

            {children}

        </Authcontex.Provider>

    )


}

export const useAuth = () => useContext(Authcontex)