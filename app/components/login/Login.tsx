import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@chakra-ui/react";

//import useAxiosPrivate from "@/hooks/useAxiosPrivate";

import "./Login.css";


function Register() {
  const router = useRouter();
  

  const generateError = (err:any) =>
    toast.error(err, {
      position: "top-center",
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    try {
      
console.log("error");
    } catch (error: any) {
      console.log(error);
      alert("Authentication failed: " + error?.message);
    }
  };

  // jwt validation
  

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={"formInternalDiv"}>
          <label htmlFor="username">User Name</label>
          <input
            type="username"
            name="username"
            placeholder="User Name"
            
          />
        </div>
        <div className={"formInternalDiv"}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
           
          />
        </div>
        <Button type="submit" color="primary">
          Login
        </Button>
        <span>
          Dont have an account ? <Link href="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;