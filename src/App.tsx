import React, { useState } from 'react';
import {BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom';
import {UserDetailsContext} from './auth/UserDetailsContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Landing from './app-layout/Landing';
const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/landing",
        element: <Landing />
    }
]);
const App = () => {
    const [userDetails, setUserDetails] = useState<any | null>(null);
    return (
        <UserDetailsContext value={{ userDetails, setUserDetails }}>
            <RouterProvider router={router} />
        </UserDetailsContext>
    );
};

export default App;
