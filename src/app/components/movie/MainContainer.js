"use client";

import React, { useEffect, useState, Fragment } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ThreeCircles } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as solid from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
import {
  EllipsisHorizontalCircleIcon,
  HeartIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import config from "@/app/config/config";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  allDataSelector,
  updateAllDataSelector,
} from "@/app/selectors/selectors";

function MainContainer() {
  const [lazyLoading, setLazyLoading] = useState(true);
  const [movie, setMovie] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedFilters = useRecoilValue(allDataSelector);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [watchListData, setWatchListData] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [updateMultipleAtoms, setUpdateMultipleAtoms] = useRecoilState(
    updateAllDataSelector
  );
  const parameters = {};

  // Fetch URL Params
  const extractURLParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      parameters[key] = value;
    }
    return parameters;
  };

  // Filter Redux Value
  const handleFilterToggle = async (filterType, filterValue) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: Array.isArray(selectedFilters[filterType])
        ? selectedFilters[filterType].includes(filterValue)
          ? selectedFilters[filterType].filter((f) => f !== filterValue)
          : [...selectedFilters[filterType], filterValue]
        : filterValue,
    };
    setUpdateMultipleAtoms(newFilters);
  };

  // Set Params
  const handleParams = (obj) => {
    let parts = [];
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          // Handling array values
          if (value.length > 0) {
            const encodedValues = value.map((item) =>
              encodeURIComponent(item.value)
            );
            parts.push(`${encodeURIComponent(key)}=${encodedValues.join(",")}`);
          }
        } else if (typeof value === "object" && value !== null) {
          // Handling object values
          parts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`
          );
        } else {
          // Handling other values
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      }
    }
    const newUrl = `${location.pathname}?${parts.join("&").toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  useEffect(() => {
    handleParams(selectedFilters);
    extractURLParameters();
    handleMovie();
    if (watchListData.length === 0) {
      fetchWatchList();
    }
  }, [selectedFilters]);

  const handleMovie = async () => {
    setLazyLoading(true);
    setLoader(true);
    try {
      const endPoint = new URL(config.app.base_url + "/movie/pagination");
      const params = new URLSearchParams({
        page: 1,
        sort_by: parameters.sortType,
        release_date_gte: parameters.releaseDateGte,
        release_date_lte: parameters.releaseDateLte,
        vote_average_gte: parameters.voteAverageGte,
        vote_average_lte: parameters.voteAverageLte,
        runtime_gte: parameters.runtimeGte,
        runtime_lte: parameters.runtimeLte,
        vote_count_lte: parameters.voteCountLte,
        genre_ids: parameters.genresList ? parameters.genresList : "",
        vote_count_gte: 0,
      });

      endPoint.search = params.toString();
      fetch(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const response = await res.json();
        setLoader(false);
        setMovie(response.movies);

        setTimeout(() => {
          setLazyLoading(false);
        }, 5000);
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleImageClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleAddMovieFavorite = async (index, movieId) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/favorite/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          type: "movie",
          items: movieId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIndex(-1);
        alert(`${data.message}`);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const fetchWatchList = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/watchlist/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setWatchListData(data.watch_list);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleAddMovieWatchList = async (movieId, watchListId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${config.app.base_url}/watchlist/insertmovie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: authToken,
            movie_id: movieId,
            id: watchListId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedIndex(-1);
        alert(`${data.message}`);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  return (
    <>
      {/* Display selected filters as chips */}
      <div className="mx-auto relative grid gap-10 s:gap-4 md:gap-10 mt-5 font-poppins sm:pl-12 s:grid-flow-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 ">
        {Object.entries(selectedFilters).map(([filterType, filterValue]) => {
          if (filterType === "userDetails") {
            return null;
          }
          return Array.isArray(filterValue)
            ? filterValue.map((value) => (
                <div
                  key={`${filterType}-${value}`}
                  className="items-center text-center text-sm transition-colors flex justify-between p-2 hover:bg-blue-300 hover:text-white 
                    rounded-l-full rounded-r-full border-spacing-2 border-solid border-2 px-4 w-[calc(100vw-32px)] sm:w-[148px]"
                  onClick={() => handleFilterToggle(filterType, value)}
                >
                  <div>{value.name}</div>
                  <div className="font-bold self-center">
                    <solid.XMarkIcon className="h-5 w-5" />
                  </div>
                </div>
              ))
            : filterValue !== "" && (
                <div
                  key={`${filterType}-${filterValue}`}
                  className="items-center text-center text-sm transition-colors flex justify-between p-2 hover:bg-blue-300 hover:text-white 
                    rounded-l-full rounded-r-full border-spacing-2 border-solid border-2 px-4 w-[calc(100vw-32px)] sm:w-[148px]"
                  onClick={() => handleFilterToggle(filterType, "")}
                >
                  <div>{filterValue.name ? filterValue.name : filterValue}</div>
                  <div className="font-bold self-center">
                    <solid.XMarkIcon className="h-5 w-5" />
                  </div>
                </div>
              );
        })}
      </div>

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
                              {/* Like Icon */}
                              <div className="absolute top-3 left-2">
                                <HeartIcon
                                  className={`${
                                    selectedIndices.includes(index)
                                      ? "text-red-500"
                                      : ""
                                  } h-5 w-5 text-gray-100 transition duration-150 ease-in-out group-hover:text-opacity-80 `}
                                  aria-hidden="true"
                                  onClick={() =>
                                    handleAddMovieFavorite(index, item.id)
                                  }
                                />
                              </div>
                              {/* Add to watch list icon */}
                              <div className="absolute top-3 left-10">
                                <Popover className="relative">
                                  {({ open }) => (
                                    <>
                                      <Popover.Button>
                                        <PlusIcon
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
                                            {watchListData.map((data) => {
                                              return (
                                                <div className="bg-gray-50 p-4">
                                                  <button
                                                    className="text-sm font-medium text-gray-900"
                                                    onClick={() => {
                                                      handleAddMovieWatchList(
                                                        item.id,
                                                        data.user_watch_list_id
                                                      );
                                                      setIsPopoverOpen(
                                                        !isPopoverOpen
                                                      );
                                                    }}
                                                  >
                                                    {data.user_watch_list_name}
                                                  </button>
                                                </div>
                                              );
                                            })}
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
    </>
  );
}

export default MainContainer;
