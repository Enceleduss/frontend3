import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./Login.css";
import { useState } from "react";

const Login = () => {
    const [values, setValues] = useState({username: "", password: ""});
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await fetch('/login',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values) 
    })
    console.log("resp "+JSON.stringify(resp));
    }
    return (
        <div className="container">
      <h2>Login</h2>
      <form onSubmit={(e) => alert("submitted")}>
        <div className={"formInternalDiv"}>
          <label htmlFor="username">User Name</label>
          <input
            type="username"
            name="username"
            placeholder="User Name"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className={"formInternalDiv"}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <Button colorPalette="teal" variant="solid" onClick={() => alert("login clicked")}>
          Login
        </Button>
        <span>
          Dont have an account ? <Link to="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
    );
}
export default Login;