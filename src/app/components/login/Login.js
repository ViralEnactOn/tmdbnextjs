"use client";
import React, { useEffect, useState } from "react";
import config from "@/app/config/config";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/utils/jwtUtils";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { userDetails } from "@/app/atoms/atoms";
import { ColorRing } from "react-loader-spinner";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userDetail, setUserDetail] = useRecoilState(userDetails);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();
  const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const handleSubmit = () => {
    setDisableButton(true);
    if (username.length === 0) {
      setDisableButton(false);
      setUsernameError("Email cannot be empty.");
      return;
    } else if (!emailValidation.test(username)) {
      setDisableButton(false);
      setUsernameError("Please enter a valid email address.");
      return;
    } else {
      setUsernameError("");
    }

    if (password.length === 0) {
      setDisableButton(false);
      setPasswordError("Password cannot empty.");
      return;
    } else {
      setPasswordError("");
    }

    fetch(`${config.app.base_url}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          const expireTime = isTokenExpired(response.token);
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("authTokenExpiration", expireTime.exp * 1000);
          setUserDetail({ email: username, password: password });
          setTimeout(() => {
            router.push("/movie");
            setDisableButton(false);
          }, 3000);
        }
        if (res.status === 400 && response.message === "Invalid email!") {
          setDisableButton(false);
          setUsernameError("Invalid email address.");
        } else {
          setUsernameError("");
        }
        if (res.status === 400 && response.message === "Invalid password!") {
          setDisableButton(false);
          setPasswordError("Invalid password.");
        } else {
          setPasswordError("");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const handleCheckUser = () => {
    const authToken = localStorage.getItem("authToken");
    const authTokenExpiration = localStorage.getItem("authTokenExpiration");
    const isLoggedIn =
      authToken !== null && new Date().getTime() < authTokenExpiration;
    if (isLoggedIn === true) {
      router.push("/movie");
    }
  };

  useEffect(() => {
    handleCheckUser();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div>
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
              <div className="text-sm">
                <Link
                  href="/forgot"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
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
          <div className="mt-5">
            <button
              onClick={() => handleSubmit()}
              type="submit"
              disabled={disableButton === true}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {disableButton ? (
                <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : (
                <>Sign in</>
              )}
            </button>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
