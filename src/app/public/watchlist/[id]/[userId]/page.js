"use client";

import React, { useEffect, useState, Fragment } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ThreeCircles } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import config from "@/app/config/config";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);
function page({ params }) {
  const [lazyLoading, setLazyLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [movie, setMovie] = useState([]);
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    fetchDetailWatchList();
  }, []);

  const fetchDetailWatchList = async () => {
    try {
      const response = await fetch(
        `${config.app.base_url}/watchlist/fetchmovie/watch_list_id=${params.id}/user_id=${params.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setWatchList(data.watchlist);
        setMovie(data.movieDetails);
        setLoader(false);
        setTimeout(() => {
          setLazyLoading(false);
        }, 5000);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  return (
    <main className="min-w-max flex justify-center bg-#000 font-sans flex-shrink-0">
      <div className="container ">
        {loader === true ? (
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
        ) : (
          <>
            {movie.length === 0 ? (
              <>
                <div className="flex justify-center pl-12 h-screen font-poppins text-gray-400">
                  <div className="self-center">
                    No items were found that match your query.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between mt-5">
                  <div>
                    {watchList.map((data) => {
                      return (
                        <div className="flex items-start space-x-5">
                          <div className="pt-1.5">
                            <h1 className="text-2xl font-bold text-gray-900">
                              {data.name}
                            </h1>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mx-auto relative grid gap-10 s:gap-4 md:gap-10 mt-5 font-poppins sm:pl-12 s:grid-flow-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                  {movie.length !== 0 &&
                    movie.map((item, index) => {
                      let dateObj = new Date(item.release_date);
                      let formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      });
                      return (
                        <div
                          key={index}
                          className="rounded-lg border-solid border-2 flex sm:flex-col w-[calc(100vw-32px)] sm:w-[148px] s:h-25"
                        >
                          <div className="relative rounded-t-lg s:hidden sm:block">
                            {lazyLoading === true ? (
                              <Skeleton height={245} />
                            ) : (
                              <>
                                <img
                                  src={item.poster_path}
                                  alt={item.original_title}
                                  className={`rounded-t-lg h-60 s:w-[200px] `}
                                />
                              </>
                            )}
                          </div>
                          <div className={`flex `}>
                            <div className="rounded-l-lg s:block sm:hidden flex-none">
                              {lazyLoading === true ? (
                                <Skeleton height={130} width={90} />
                              ) : (
                                <img
                                  src={item.poster_path}
                                  alt={item.original_title}
                                  className="rounded-l-lg h-[130px] w-[90px]"
                                />
                              )}
                            </div>
                            <div className="flex-1 p-2">
                              <div className="font-semibold text-sm mt-2 sm:pl-0">
                                {item.original_title ? item.original_title : ""}
                              </div>
                              <div className="mt-1 text-xs sm:pl-0">
                                {formattedDate ? formattedDate : ""}
                              </div>
                              <div className="mt-5 text-sm line-clamp-2 sm:hidden">
                                {item.overview ? item.overview + "..." : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default page;
