import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router";
import { validateEmail } from "../../utils/helper";

import Passwordinput from "../../Components/input/Passwordinput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handelLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) 
      {
          setError("Please Enter  Valid Email");
          return;
      }
      

      if(!password)
      {
        setError("Please Enter the password")
        return;
      }

      setError("")
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-69 border rounded bg-white px-7 py-10">
          <form onSubmit={handelLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              name="email"
              className="input-box"
              placeholder="Rahul@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link
                to="/SignUp"
                className="font-medium text-primary underline "
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;