"use client";

import config from "@/app/config/config";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  ListBulletIcon,
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { ThreeCircles } from "react-loader-spinner";
import Heading from "@/app/components/movie/Heading";
function page({ params }) {
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState([]);
  const [selected, setSelected] = useState(false);
  const [ratingType, setRatingType] = useState("");
  const [ratingNumber, setRatingNumber] = useState("");
  const [ratingData, setRatingData] = useState([]);

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
          console.error("Error fetching watch list data");
        }
      } catch (error) {
        console.error("Error fetching watch list data:", error);
      }
    }
  };

  const handleFetchRating = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/rating/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken, movie_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setRatingData(data.rating);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleInsertRating = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/rating/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          movie_id: id,
          type: ratingType,
          rating: ratingNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        handleFetchRating(id);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  useEffect(() => {
    handleMovieDetail();
    handleFetchLike(params.id);
    handleFetchRating(params.id);
  }, []);

  const projects = [
    {
      name: "Graph API",
      initials: "GA",
      href: "#",
      members: 16,
      bgColor: "bg-pink-600",
    },
    {
      name: "Component Design",
      initials: "CD",
      href: "#",
      members: 12,
      bgColor: "bg-purple-600",
    },
    {
      name: "Templates",
      initials: "T",
      href: "#",
      members: 16,
      bgColor: "bg-yellow-500",
    },
    {
      name: "React Components",
      initials: "RC",
      href: "#",
      members: 8,
      bgColor: "bg-green-500",
    },
  ];

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
                                className="ml-48 "
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
                                  className="rounded-lg"
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
                                  <div className="w-16 h-16 text-center">
                                    <CircularProgressbar
                                      strokeWidth={6}
                                      value={
                                        item.vote_average
                                          ? item.vote_average * 10
                                          : ""
                                      }
                                      text={`${
                                        item.vote_average
                                          ? Math.round(item.vote_average * 10)
                                          : ""
                                      }%`}
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
                            <div className="mx-auto ml-5 mt-5">
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
                              <label
                                htmlFor="location"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Rating
                              </label>
                              <select
                                value={ratingType}
                                onChange={(e) => setRatingType(e.target.value)}
                                id="location"
                                name="location"
                                className="mt-2 block w-30 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue="Canada"
                              >
                                <option>Plot</option>
                                <option>Acting and Direction</option>
                                <option>Visuals and Effects</option>
                                <option>Writing and Dialog</option>
                                <option>Sound and Music</option>
                                <option>Pacing and Structure</option>
                              </select>
                              <select
                                value={ratingNumber}
                                onChange={(e) =>
                                  setRatingNumber(e.target.value)
                                }
                                id="location"
                                name="location"
                                className="mt-2 block w-30 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue="Canada"
                              >
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                              </select>
                              <div className="mt-6 flex items-center  gap-x-6">
                                <button
                                  type="submit"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => {
                                    handleInsertRating(item.id);
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* View Rating */}
                          <div>
                            <h2 className="text-sm font-medium text-gray-500">
                              Rating
                            </h2>
                            <ul
                              role="list"
                              className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
                            >
                              {ratingData.map((project) => (
                                <li
                                  key={project.user_name}
                                  className="col-span-1 flex rounded-md shadow-sm"
                                >
                                  <div className="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white">
                                    {/* {project.initials} */}
                                  </div>
                                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                    <div className="flex-1 truncate px-4 py-2 text-sm">
                                      <a className="font-medium text-gray-900 hover:text-gray-600">
                                        {project.user_name}
                                      </a>
                                      <p className="text-gray-500">
                                        {project.user_rating_type}
                                      </p>
                                      <p className="text-gray-500">
                                        {project.user_rating} / 10
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0 pr-2"></div>
                                  </div>
                                </li>
                              ))}
                            </ul>
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
      </main>
    </>
  );
}

export default page;
