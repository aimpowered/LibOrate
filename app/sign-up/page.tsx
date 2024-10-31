// Signup Page - User sign up only
"use client";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import "../css/sign-up.css"; // Import CSS file

const SignUp = () => {
  const [busy, setBusy] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [isUserCreated, setIsUserCreated] = useState(false); // State variable to track user creation

  const { email, password } = userInfo;

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setBusy(true);
    fetch("/api/auth/users", {
      method: "POST",
      body: JSON.stringify(userInfo),
    })
      .then(() => {
        setIsUserCreated(true);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create an account
        </h2>
        {isUserCreated && (
          <div className="success-alert" role="alert">
            <span className="font-medium">User created successfully!</span>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex justify-center items-center mt-8">
            <button
              className="w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              type="submit"
              disabled={busy}
              style={{
                opacity: busy ? 0.5 : 1,
                maxWidth: "100px",
                backgroundColor: "#d68071",
              }}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-8 text-center text-gray-500">
            Already have an account,{" "}
            <a
              href="/"
              className="text-blue-500 underline"
              style={{ color: "#d68071" }}
            >
              sign in.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
