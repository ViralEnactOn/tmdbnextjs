"use client";

import React, { useEffect, useState, Fragment } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ThreeCircles } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Popover, Transition, Dialog, Switch } from "@headlessui/react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/20/solid";
import config from "@/app/config/config";
import Heading from "@/app/components/movie/Heading";
import PieChart from "@/app/components/chart/PieChart";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";

Chart.register(CategoryScale);
function page({ params }) {
  const [lazyLoading, setLazyLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [movie, setMovie] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const router = useRouter();

  const handleImageClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const authTokenExpiration = localStorage.getItem("authTokenExpiration");
    const isLoggedIn =
      authToken !== null && new Date().getTime() < authTokenExpiration;
    if (isLoggedIn === true) {
      fetchChartDetails();
      fetchDetailWatchList();
    } else {
      router.push("/");
    }
  }, []);

  const fetchChartDetails = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${config.app.base_url}/chart/genre_wise_rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: authToken,
            watch_list_id: params.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChartData({
          label: data.genreCountArray.map((item) => item.genre_name),
          datasets: [
            {
              label: "Watch List",
              data: data.genreCountArray.map((item) => item.genre_count),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

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

  const handleDeleteMovieWatchList = async (movieId, watchListId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${config.app.base_url}/watchlist/removemovie`,
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
        await fetchDetailWatchList();
      await fetchChartDetails();
        alert(`${data.message}`);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    const linkToCopy = `${window.location.origin}/public/watchlist/${params.id}/${params.userId}`;
    const input = document.createElement("input");
    input.value = linkToCopy;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
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
                  <div className=" flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3 ">
                    <button
                      onClick={openModal}
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Share watch list
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex justify-center myChart">
                  {chartData.length !== 0 && (
                    <div className="h-[300px] w-[300px]">
                      <PieChart
                        datasets={chartData.datasets}
                        labels={chartData.label}
                      />
                    </div>
                  )}
                </div>
                <div className="mx-auto relative grid gap-10 s:gap-4 md:gap-10 mt-10 font-poppins sm:pl-12 s:grid-flow-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 ">
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
                          onClick={() => {
                            if (selectedIndex !== -1) {
                              return;
                            } else {
                              router.push(`/movie/${item.id}`);
                            }
                          }}
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
                                                    handleDeleteMovieWatchList(
                                                      item.id,
                                                      params.id
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share watch list
                  </Dialog.Title>
                  <div className="mt-5 ">
                    <div className="col-span-full flex justify-between">
                      <div>
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Share link with anyone
                        </label>
                      </div>
                      <div>
                        <Switch
                          checked={enabled}
                          onChange={setEnabled}
                          className={`${
                            enabled ? "bg-blue-600" : "bg-gray-200"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              enabled ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
                    </div>
                    <div>
                      {enabled ? (
                        <>
                          <div className="col-span-full flex mt-5">
                            <button
                              type="submit"
                              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={() => copyToClipboard()}
                            >
                              Copy public link
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}

export default page;
