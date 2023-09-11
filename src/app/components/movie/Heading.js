"use client";
import config from "@/app/config/config";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Heading() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    async function fetchUserData() {
      try {
        const response = await fetch(`${config.app.base_url}/user/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: authToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData([data.user]);
        } else {
          console.error("Error fetching user data");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleWatchList = async () => {
    router.push("/watchlist");
  };

  const handleLogout = async () => {
    localStorage.removeItem("authTokenExpiration");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        userData.map((data) => (
          <div
            className="md:flex md:items-center md:justify-between md:space-x-5 mt-10"
            key={data.id}
          >
            <div className="flex items-start space-x-5">
              <div className="pt-1.5">
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.name}
                </h1>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <button
                onClick={() => {
                  router.push("/movie");
                }}
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Home
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  router.push("/favorite");
                }}
              >
                Favorite
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  handleWatchList();
                }}
              >
                Watch list
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  router.push("/chart");
                }}
              >
                Chart
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={() => {
                  handleLogout();
                }}
              >
                Log out
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default Heading;
