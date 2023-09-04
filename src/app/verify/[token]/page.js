"use client";

import React, { useEffect, useState } from "react";
import config from "@/app/config/config";
import { useRouter } from "next/navigation";

function reset({ params }) {
  const [verified, setVerified] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${config.app.base_url}/user/verify/${params.token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        setDisableButton(false);
        if (res.status === 200) {
          setVerified(true);
          setDisableButton(false);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);
  const handleSubmit = () => {
    router.push("/");
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
            Verify Email
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="mt-2 text-center">
              {verified === false
                ? "Verifying user email"
                : "Successfully verified user email"}
            </div>

            <div className="mt-5" onClick={() => handleSubmit()}>
              <button
                type="submit"
                disabled={disableButton}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {!verified ? "Wait" : "Go to Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default reset;
