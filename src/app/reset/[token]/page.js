"use client";

import React, { useState } from "react";
import config from "@/app/config/config";
import { useRouter } from "next/navigation";

function reset({ params }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (password.length === 0) {
      setPasswordError("Email cannot empty.");
      return;
    } else {
      setPasswordError("");
    }

    fetch(`${config.app.base_url}/user/reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: params.token, password: password }),
    })
      .then(async (res) => {
        const response = await res.json();
        setDisableButton(false);
        if (res.status === 200) {
          alert(response.message);
          router.push("/");
          setPassword(" ");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="mt-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
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
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default reset;
