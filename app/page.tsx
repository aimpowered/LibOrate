// Homepage - User login and signup
"use client";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import { Action, log } from "@/lib/log";

const Login = () => {
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { email, password } = userInfo;

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      log(Action.LOG_IN_FAIL, email, res);
      return setError(res.error);
    }
    router.replace("/main");
    log(Action.LOG_IN, email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit}>
          {error ? <Alert value={error} /> : null}
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex justify-center items-center mt-8">
            <button
              type="submit"
              className="w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              style={{ maxWidth: "100px", backgroundColor: "#d68071" }}
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-gray-500">
          Don&rsquo;t have an account,{" "}
          <a
            href="/sign-up"
            className="text-blue-500 underline"
            style={{ color: "#d68071" }}
          >
            sign up
          </a>{" "}
          now!
        </p>
      </div>
    </div>
  );
};

export default Login;
