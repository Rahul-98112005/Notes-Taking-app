import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Passwordinput from "../../Components/input/Passwordinput";
import { Link } from "react-router";
import { validateEmail } from "../../utils/helper";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

    const handelSignUp = async (e) => {
      e.preventDefault()
      if (!name) 
        {
            setError("Please Enter Your Name");
            return;
        }
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
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handelSignUp}>
            <h4 className="text-2xl mb-7">Signup</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              SignUP
            </button>

            <p className="text-sm text-center mt-4">
               Already have a account ?
              <Link
                to="/login"
                className=" px-1 font-medium text-primary underline "
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
