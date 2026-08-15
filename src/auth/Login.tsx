import { Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./Login.css";
import { useContext, useState } from "react";
import {UserDetailsContext} from "./UserDetailsContext";

const Login = () => {
    const {userDetails, setUserDetails} = useContext(UserDetailsContext);
    const navigate = useNavigate();
    const [values, setValues] = useState({username: "", password: ""});
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await fetch('api/login',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    const data = await resp.json();
    alert(JSON.stringify(data));
    setUserDetails(data);
    navigate("/landing");
    }
    return (
        <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <Button colorPalette="teal" variant="solid" onClick={(e) => handleSubmit(e as any)}>
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