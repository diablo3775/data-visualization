// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserAuth } from "../context/UserAuthContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { logIn } = useUserAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await logIn(email, password);
//       navigate("/home");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <>
//       <div className="bg-grey-lighter min-h-screen flex flex-col">
//         <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
//           {error && <div variant="danger">{error}</div>}
//           <form onSubmit={handleSubmit} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
//             <h1 className="mb-8 text-3xl text-center">Log In</h1>
//             <input
//               className="block border border-grey-light w-full p-3 rounded mb-4"
//               type="email"
//               placeholder="Email address"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               className="block border border-grey-light w-full p-3 rounded mb-4"
//               type="password"
//               placeholder="Password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
//               type="submit">
//               Log In
//             </button>
//           </form>
//           <div className="text-grey-dark mt-6">
//             Don't have an account? <Link to="/">Sign up</Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
  const [passwordError, setPasswordError] = useState(""); // State for password error
  const [firebaseError, setFirebaseError] = useState(""); // For additional Firebase errors
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Reset errors
    setPasswordError(""); // Reset errors
    setFirebaseError(""); // Reset Firebase errors

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
    }

    if (!isValid) return; // Stop if validation fails

    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      // Firebase error handling for specific cases
      if (err.message.includes("auth/user-not-found")) {
        setFirebaseError("No user found with this email.");
      } else if (err.message.includes("auth/wrong-password")) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setFirebaseError("Incorrect password Please try again later.");
      }
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <form onSubmit={handleSubmit} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Log In</h1>

          {/* Email input with error */}
          <input
            className="block border border-grey-light w-full p-3 rounded mb-4"
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {emailError && <div className="text-red-500 text-sm mb-4 text-left font-medium">{emailError}</div>}

          {/* Password input with error */}
          <input
            className="block border border-grey-light w-full p-3 rounded mb-4"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {passwordError && <div className="text-red-500 text-sm mb-4 text-left font-medium">{passwordError}</div>}

          {/* Firebase-specific error */}
          {firebaseError && <div className="text-red-500 text-sm mb-4 text-center font-medium">{firebaseError}</div>}

          <button
            className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
            type="submit"
          >
            Log In
          </button>
        </form>

        <div className="text-grey-dark mt-6">
          Don't have an account? <Link to="/">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
