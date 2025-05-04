#!/bin/bash
echo "Fixing App.jsx import path..."
sed -i 's/view users\/ViewUsers/ViewUsers\/ViewUsers/g' src/App.jsx
echo "Creating ViewUsers directory..."
mkdir -p src/Compontes/ViewUsers
echo "Creating ViewUsers.jsx file..."
cat > src/Compontes/ViewUsers/ViewUsers.jsx << 'EOL'
import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import Navabar from '../Navbar/Navabar';

function Viewusers() {
    const { user } = useAuth();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    return (
        <>
            <Navabar className="" />
            <div className="bg-[#0f172a] w-full min-h-screen flex flex-col text-white">
                <div className="m-5 mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-y-4 mt-10">
                        {users.length === 0 ? (
                            <h1>No users found</h1>
                        ) : (
                            users.map((user, index) => (
                                <div className="border border-gray-700 rounded-lg p-4 m-5 shadow-md bg-gray-800 font-bold text-white" key={index}>
                                    <p><span>ID: {user.username}</span></p>
                                    <p><span>Name: {user.name}</span></p>
                                    <p><span>Role: {user.role}</span></p>
                                    <p><span>Email: {user.email}</span></p>
                                    <p><span>Mobile Number: {user.mobileNumber}</span></p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Viewusers;
EOL

echo "Fix completed." 