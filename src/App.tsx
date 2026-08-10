import React from 'react';
import {BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
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
        path: "/",
        element: <h1>Hello, Parcel + React!</h1>
    }
]);
const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
