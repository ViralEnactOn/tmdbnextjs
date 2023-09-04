"use client";

import React, { useState } from "react";
import config from "@/app/config/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (name.length === 0) {
      setNameError("Name cannot empty.");
      return;
    } else {
      setNameError("");
    }
    if (username.length === 0) {
      setUsernameError("Username cannot empty.");
      return;
    } else {
      setUsernameError("");
    }

    if (password.length === 0) {
      setPasswordError("Password cannot empty.");
      return;
    } else {
      setPasswordError("");
    }
    fetch(`${config.app.base_url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: username, password: password }),
    })
      .then((res) => {
        setDisableButton(false);
        if (res.status === 200) {
          alert("User register successful");
          router.push("/");
        }
        if (res.status === 400) {
          alert("User already exists");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {nameError && (
                <div className="text-red-700 block text-sm font-medium leading-6">
                  {nameError}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {usernameError && (
                <div className="text-red-700 block text-sm font-medium leading-6">
                  {usernameError}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mt-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {passwordError && (
                <div className="text-red-700 block text-sm font-medium leading-6">
                  {passwordError}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5" onClick={() => handleSubmit()}>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link
            href="/"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
