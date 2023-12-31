"use client";

import config from "@/app/config/config";
import React, { Fragment, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  ListBulletIcon,
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";
import Heading from "@/app/components/movie/Heading";
import { Dialog, Menu, Popover, Transition } from "@headlessui/react";
import CommentsSection from "../commentsSection";
import RatingSection from "../ratingSection";
import ShowRatings from "../showRatings";
import useCustomHook from "../custom-hook";

function page({ params }) {
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState([]);
  const [selected, setSelected] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { getRandom2, test } = useCustomHook();

  const notify = (message) =>
    toast.error(`${message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleMovieDetail = async () => {
    try {
      const response = await fetch(
        `${config.app.base_url}/movie/detail?id=${params.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data.movies);
        setLoader(false);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleFetchLike = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/reaction/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken, movie_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Reaction Record Not Found") {
          setSelected(false);
        } else {
          setSelected(true);
        }
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleLikeMovie = async (id) => {
    const authToken = localStorage.getItem("authToken");
    if (selected === true) {
      try {
        const response = await fetch(`${config.app.base_url}/reaction/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: authToken,
            movie_id: id,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setSelected(false);
        } else {
          const data = await response.json();
          if (data.message) {
            notify(data.message);
          }
          console.error("Error fetching watch list data");
        }
      } catch (error) {
        console.error("Error fetching watch list data:", error);
      }
    } else {
      try {
        const response = await fetch(`${config.app.base_url}/reaction/insert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: authToken,
            movie_id: id,
            type: "LIKE",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSelected(true);
        } else {
          const data = await response.json();
          if (data.message) {
            notify(data.message);
          }
          console.error("Error fetching watch list data");
        }
      } catch (error) {
        console.error("Error fetching watch list data:", error);
      }
    }
  };

  const handleFetchComment = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/comment/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken, movie_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setCommentData(data.comment);
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

  useEffect(() => {
    handleMovieDetail();
    handleFetchLike(params.id);
    handleFetchComment(params.id);
    getRandom2();
  }, []);
  console.log({ test });

  const RenderCom = ({ icon }) => {
    return (
      <div className="mx-auto ml-5">
        <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
          {icon}
        </span>
      </div>
    );
  };

  return (
    <>
      <main className="min-w-max flex justify-center font-poppins -">
        {loader === true ? (
          <div className="flex justify-center h-screen w-screen items-center">
            <ThreeCircles
              height={100}
              width={100}
              color="#4fa94d"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        ) : (
          <>
            <div>
              <ToastContainer />
            </div>
            <div className="container">
              <Heading />
              {details.length !== 0 ? (
                <>
                  <div>
                    {details.map((item, index) => {
                      // Date
                      let dateStr = item.release_date;
                      let [year, month, day] = dateStr.split("-");
                      let formattedDate = `${month}/${day}/${year}`;
                      // Run time
                      const hours = Math.floor(item.runtime / 60);
                      const minutes = item.runtime % 60;
                      const formattedTime = hours + "h " + minutes + "m";
                      // Genres
                      // const genres = item.genre_ids.map((item) => item.name);
                      // const genresString = genres.join(", ");

                      return (
                        <>
                          <div className="relative mt-5">
                            {/* Container for the backdrop image */}
                            <div className="absolute inset-0 overflow-hidden rounded-lg max-w-full max-h-full">
                              <img
                                src={item.backdrop_path}
                                alt="Movie Poster"
                                className="ml-48  "
                              />
                              <div
                                className="absolute inset-0 bg-black opacity-50"
                                // style={{
                                //   background:
                                //     "linear-gradient(to top,rgba(255, 255, 255, 0.8) 0%,rgba(255, 255, 255, 0) 100%)",
                                // }}
                              ></div>
                            </div>

                            {/* Main content */}
                            <div className="flex relative p-10">
                              <div className="flex flex-col w-1/5">
                                <img
                                  src={item.poster_path}
                                  alt="Movie Poster"
                                  className="rounded-lg mt-5"
                                />
                              </div>
                              <div className="flex flex-col w-4/5 ml-10 items-start">
                                <span className="text-white text-3xl font-bold mt-5">
                                  {item.original_title}
                                  {" (" + item.release_date.slice(0, 4) + ")"}
                                </span>
                                <span className="text-white text-base mt-2 font-light">
                                  {formattedDate}
                                  {/* <span className="ml-3">{genresString}</span> */}
                                  <span className="ml-3">{formattedTime}</span>
                                </span>
                                <span className="mt-5 flex items-center">
                                  <div className="w-16 h-16">
                                    <CircularProgressbar
                                      strokeWidth={6}
                                      value={
                                        item.vote_average
                                          ? item.vote_average * 10
                                          : ""
                                      }
                                      // text={`${
                                      //   item.vote_average
                                      //     ? Math.round(item.vote_average * 10)
                                      //     : ""
                                      // }%`}
                                      styles={buildStyles({
                                        pathColor: "#03AC13",
                                        trailColor: "lightgray",
                                        textSize: "30px",
                                        textColor: "#FFF",
                                      })}
                                    />
                                  </div>
                                  <span className="text-white text-base ml-2 w-5 font-semibold">
                                    User Score
                                  </span>
                                  <div className="mx-auto ml-11">
                                    <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
                                      <ListBulletIcon className="h-4 w-4 text-white self-center" />
                                    </span>
                                  </div>

                                  <div className="mx-auto ml-5">
                                    <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
                                      <HeartIcon className="h-4 w-4 text-white self-center" />
                                    </span>
                                  </div>

                                  <div className="mx-auto ml-5">
                                    <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
                                      <BookmarkIcon className="h-4 w-4 text-white self-center" />
                                    </span>
                                  </div>

                                  <div className="mx-auto ml-5">
                                    <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
                                      <StarIcon className="h-4 w-4 text-white self-center" />
                                    </span>
                                  </div>

                                  <div className="mx-auto ml-5">
                                    <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold ">
                                      <PlayIcon className="h-4 w-4 text-white self-center" />
                                    </span>
                                  </div>
                                  <div className="mx-auto flex justify-center items-center text-white text-base rounded-full font-semibold ">
                                    Play Trailer
                                  </div>
                                </span>
                                <span className="mt-5 flex items-center text-gray-400 italic text-base rounded-full font-semibold">
                                  {item.tagline}
                                </span>
                                <span className="mt-2 flex  items-center text-white  text-lg rounded-full font-bold">
                                  Overview
                                </span>
                                <span className="mt-2 flex items-center text-white  text-base rounded-full font-normal">
                                  {item.overview}
                                </span>
                                <div className="grid grid-cols-3 gap-40 mt-2">
                                  <div>
                                    <div className="text-white items-start">
                                      Tomek Baginski
                                    </div>
                                    <div className="text-gray-300 items-start text-sm ">
                                      Director
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-white items-start">
                                      Josh Campbell
                                    </div>
                                    <div className="text-gray-300 items-start text-sm">
                                      Screenplay
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-white items-start">
                                      Tomek Baginski
                                    </div>
                                    <div className="text-gray-300 items-start text-sm">
                                      Screenplay
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-40 mt-2">
                                  <div>
                                    <div className="text-white items-start">
                                      Matthew Stuecken
                                    </div>
                                    <div className="text-gray-300 items-start text-sm">
                                      Screenplay
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            {/* Like */}
                            <div className=" ml-5 mt-5">
                              <span className="flex justify-center items-center text-white text-base w-12 h-12 rounded-full font-semibold bg-blue-500">
                                <HeartIcon
                                  className={`h-6 w-6  self-center ${
                                    selected ? "text-red-500" : "text-white"
                                  }`}
                                  onClick={() => {
                                    handleLikeMovie(item.id);
                                  }}
                                />
                              </span>
                            </div>

                            {/* Rating */}
                            <div>
                              <div className="mt-6 flex items-center gap-x-6">
                                <button
                                  type="submit"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={openModal}
                                >
                                  Add Rating
                                </button>
                              </div>
                            </div>
                          </div>

                          <CommentsSection movieId={params.id} />

                          {/* View Rating */}
                          <div className="mt-5">
                            <ShowRatings movie_id={params.id} />
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>
                  <p>No movie details available.</p>
                </div>
              )}
            </div>
          </>
        )}
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
                    <RatingSection movie_id={params.id} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </main>
    </>
  );
}

export default page;
