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

  const newLogActionRequest = {
    userEmail: "",
    action: "",
    timestamp: new Date(),
    metadata: JSON.stringify({}),
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    setBusy(true);
    e.preventDefault();
    await fetch("/api/auth/users", {
      method: "POST",
      body: JSON.stringify(userInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        //setting values for newLogActionRequest
        if (Object.keys(data)[0] == "user") {
          newLogActionRequest.userEmail = data["user"]["email"];
          newLogActionRequest.action = "user_sign_up";
          newLogActionRequest.timestamp = new Date();
          newLogActionRequest.metadata = JSON.stringify(data);
        } else {
          newLogActionRequest.userEmail = "null";
          newLogActionRequest.action = "user_sign_up_error";
          newLogActionRequest.timestamp = new Date();
          newLogActionRequest.metadata = JSON.stringify(data);
        }
      });

    setIsUserCreated(true);
    setBusy(false);

    //posting log data to db
    setBusy(true);
    await fetch("/api/log", {
      method: "POST",
      body: JSON.stringify(newLogActionRequest),
    }).then((res) => res.json());
    setBusy(false);
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
            <input
              placeholder="Email"
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
            <input
              placeholder="Password"
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
