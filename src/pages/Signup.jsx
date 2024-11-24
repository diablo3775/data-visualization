import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");  // State for email error
  const [passwordError, setPasswordError] = useState("");  // State for password error
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");  // Reset errors
    setPasswordError("");  // Reset errors

    // Validation checks
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters.");
      isValid = false;
    }

    if (!isValid) return;  // If any field is invalid, stop here.

    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err) {
      // Firebase error handling for specific errors
      if (err.message.includes("auth/missing-password")) {
        setPasswordError("Please enter your password.");
      } else if (err.message.includes("auth/invalid-email")) {
        setEmailError("Please enter a valid email.");
      } else {
        setEmailError("");  // Clear any email error if not related to invalid email
        setPasswordError("");  // Clear password error if not related to password issues
        if (err.message.includes("auth/weak-password")) {
          setPasswordError("Password should be at least 6 characters.");
        }
      }
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <form onSubmit={handleSubmit} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>

          {/* Email input field with error */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="block border border-grey-light w-full p-3 rounded mb-4"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
          />
          {emailError && <div className="text-red-500 text-sm mb-4 text-left font-medium">{emailError}</div>} {/* Improved email error */}

          {/* Password input field with error */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="block border border-grey-light w-full p-3 rounded mb-4"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
          />
          {passwordError && <div className="text-red-500 text-sm mb-3 text-left font-medium">{passwordError}</div>} {/* Improved password error */}

          <button
            className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
            type="submit"
          >
            Create Account
          </button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the Terms of Service and Privacy Policy
          </div>
        </form>

        <div className="text-grey-dark mt-6">
          Already have an account? 
          <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
