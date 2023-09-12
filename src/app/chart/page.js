"use client";

import React, { useState } from "react";
import Heading from "../components/movie/Heading";
import { useRouter } from "next/navigation";
import { ThreeCircles } from "react-loader-spinner";

function chart() {
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 3000);
  const router = useRouter();

  return (
    <>
      <div className="container">
        <Heading />
        {!loading ? (
          <>
            <div className="flex items-start space-x-5">
              <div className="pt-5">
                <h1 className="text-2xl font-bold text-gray-900">Chart List</h1>
              </div>
            </div>
            <div className="flex justify-between">
              <div className=" flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-start sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-5 md:flex-row md:space-x-3 ">
                <button
                  type="button"
                  className=" inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => router.push("/chart/movierelease")}
                >
                  Movie Released Chart
                </button>
              </div>
              <div className=" flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-start sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-5 md:flex-row md:space-x-3 ">
                <button
                  type="button"
                  className=" inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => router.push("/chart/movieprofitloss")}
                >
                  Movie Released Chart
                </button>
              </div>
              <div className=" flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-start sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-5 md:flex-row md:space-x-3 ">
                <button
                  type="button"
                  className=" inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => router.push("/chart/countrymovierevenue")}
                >
                  Country Wise Movie Revenue Chart
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            <>
              <div className="flex justify-center h-screen s:items-start md:items-center">
                <ThreeCircles
                  height="100"
                  width="100"
                  color="#4fa94d"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="three-circles-rotating"
                  outerCircleColor=""
                  innerCircleColor=""
                  middleCircleColor=""
                />
              </div>
            </>
          </>
        )}
        <br />
      </div>
    </>
  );
}

export default chart;
