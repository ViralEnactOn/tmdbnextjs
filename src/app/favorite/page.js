"use client";

import React, { useEffect, useState, Fragment } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ThreeCircles } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Popover, Transition } from "@headlessui/react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/20/solid";
import config from "@/app/config/config";
import Heading from "@/app/components/movie/Heading";

function favorite() {
  const [lazyLoading, setLazyLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [movie, setMovie] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleImageClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    fetchFavoriteList();
  }, []);

  const fetchFavoriteList = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${config.app.base_url}/favorite/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setMovie(data.movieDetails);
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

  const handleDeleteMovieFavoriteList = async (movieId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/favorite/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          favorite_list_id: movieId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIndex(-1);
        await fetchFavoriteList();
        alert(`${data.message}`);
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
        <Heading />
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
                <div className="flex items-start space-x-5 mt-5">
                  <div className="pt-1.5">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Favorite Movies
                    </h1>
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
                                  className={`rounded-t-lg h-60 s:w-[200px] ${
                                    selectedIndex === index ? "filter blur" : ""
                                  }`}
                                />
                                <div className="absolute top-3 left-28">
                                  <Popover className="relative">
                                    {({ open }) => (
                                      <>
                                        <Popover.Button>
                                          <EllipsisHorizontalCircleIcon
                                            className={`${
                                              open ? "" : "text-opacity-70"
                                            } h-5 w-5 text-gray-100 transition duration-150 ease-in-out group-hover:text-opacity-80 `}
                                            aria-hidden="true"
                                            onClick={() => {
                                              handleImageClick(index);
                                              setIsPopoverOpen(!isPopoverOpen);
                                            }}
                                          />
                                        </Popover.Button>
                                        <Transition
                                          as={Fragment}
                                          show={
                                            isPopoverOpen &&
                                            selectedIndex === index
                                          }
                                          enter="transition ease-out duration-200"
                                          enterFrom="opacity-0 translate-y-1"
                                          enterTo="opacity-100 translate-y-0"
                                          leave="transition ease-in duration-150"
                                          leaveFrom="opacity-100 translate-y-0"
                                          leaveTo="opacity-0 translate-y-1"
                                        >
                                          <Popover.Panel className="absolute left-1/2 z-10 mt-3 max-w-[300px] w-[300px] -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                              <div className="bg-gray-50 p-4">
                                                <button
                                                  className="text-sm font-medium text-gray-900"
                                                  onClick={() => {
                                                    handleDeleteMovieFavoriteList(
                                                      item.id
                                                    );
                                                    setIsPopoverOpen(
                                                      !isPopoverOpen
                                                    );
                                                  }}
                                                >
                                                  Want to delete this movie from
                                                  a list?
                                                </button>
                                              </div>
                                            </div>
                                          </Popover.Panel>
                                        </Transition>
                                      </>
                                    )}
                                  </Popover>
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className={`flex ${
                              selectedIndex === index ? "filter blur" : ""
                            }`}
                          >
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

export default favorite;
