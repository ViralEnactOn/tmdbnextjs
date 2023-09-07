"use client";

import React, { useState } from "react";
import config from "@/app/config/config";
import { ColorRing } from "react-loader-spinner";

function forgot() {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [disableButton, setDisableButton] = useState(false);
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

    fetch(`${config.app.base_url}/user/forgot_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          setTimeout(() => {
            alert(response.message);
            setUsername(" ");
            setDisableButton(false);
          }, 3000);
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
          Forgot password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
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

          <div className="mt-5">
            <button
              type="submit"
              disabled={disableButton === true}
              onClick={() => handleSubmit()}
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
                <>Send mail</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default forgot;
