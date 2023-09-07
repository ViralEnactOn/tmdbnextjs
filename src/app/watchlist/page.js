"use client";
import React, { useEffect, useState, Fragment } from "react";
import {
  TrashIcon,
  PencilSquareIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import Heading from "../components/movie/Heading";
import config from "../config/config";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { ThreeCircles } from "react-loader-spinner";

function watchList() {
  const [watchListData, setWatchListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [watchListName, setWatchListName] = useState("");
  const [watchListNameError, setWatchListNameError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const router = useRouter();

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
        setLoading(false);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const insertWatchList = async () => {
    if (watchListName.length === 0) {
      setWatchListNameError("Watch list name cannot empty.");
      return;
    } else {
      setWatchListNameError("");
    }
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/watchlist/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          name: watchListName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchWatchList();
        setIsOpen(false);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const removeWatchList = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/watchlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          id: id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchWatchList();
        setIsOpen(false);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const updateWatchList = async (id) => {
    watchListData.map(async (item) => {
      if (item.user_watch_list_id === id) {
        if (item.user_watch_list_name.length === 0) {
          setWatchListNameError("Watch list name cannot empty.");
          return;
        } else {
          setWatchListNameError("");
        }
        const authToken = localStorage.getItem("authToken");
        try {
          const response = await fetch(
            `${config.app.base_url}/watchlist/update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
                name: item.user_watch_list_name,
                token: authToken,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setSelectedRow(null);
            await fetchWatchList();
          } else {
            console.error("Error updating watch list data");
          }
        } catch (error) {
          console.error("Error updating watch list data:", error);
        }
      }
    });
  };

  const detailWatch = async (data) => {
    router.push(`/watchlist/${data.id}/${data.user_id}`);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setWatchListNameError("");
    setWatchListName("");
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const authTokenExpiration = localStorage.getItem("authTokenExpiration");
    const isLoggedIn =
      authToken !== null && new Date().getTime() < authTokenExpiration;
    if (isLoggedIn === true) {
      fetchWatchList();
    } else {
      router.push("/");
    }
  }, []);

  return (
    <>
      {loading ? (
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
        <main className="min-w-max flex justify-center font-sans flex-shrink-0">
          <div className="container">
            <Heading />
            <div className="flex justify-between mt-5">
              <div className="flex items-start space-x-5">
                <div className="pt-1.5">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Watch List
                  </h1>
                </div>
              </div>
              <div className=" flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3 ">
                <button
                  type="button"
                  className=" inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={openModal}
                >
                  Insert Watch List
                </button>
              </div>
            </div>
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10"
            >
              {watchListData.map((data, index) => (
                <li
                  key={data.user_watch_list_id}
                  className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
                >
                  <div
                    className="flex flex-1 flex-col p-8"
                    onClick={
                      selectedRow === null
                        ? () => {
                            detailWatch({
                              id: data.user_watch_list_id,
                              user_id: data.user_id,
                            });
                          }
                        : undefined
                    }
                  >
                    {selectedRow === index ? (
                      <input
                        type="text"
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={data.user_watch_list_name}
                        onChange={(e) =>
                          setWatchListData((prevData) => {
                            const newData = [...prevData];
                            newData[index].user_watch_list_name =
                              e.target.value;
                            return newData;
                          })
                        }
                      />
                    ) : (
                      <h3 className="mt-6 text-lg font-medium text-gray-900">
                        {data.user_watch_list_name}
                      </h3>
                    )}
                  </div>
                  {/* Button */}
                  <div>
                    {selectedRow === index ? (
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <a
                            onClick={() =>
                              updateWatchList(data.user_watch_list_id)
                            }
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-green-900"
                          >
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-400"
                              aria-hidden="true"
                            />
                            Confirm
                          </a>
                        </div>

                        <div className="-ml-px flex w-0 flex-1 ">
                          <a
                            onClick={() => {
                              setSelectedRow(null);
                              fetchWatchList();
                            }}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-red-700"
                          >
                            <TrashIcon
                              className="h-5 w-5 text-red-400"
                              aria-hidden="true"
                            />
                            Cancel
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <a
                            onClick={() => setSelectedRow(index)}
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <PencilSquareIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            Edit
                          </a>
                        </div>

                        <div className="-ml-px flex w-0 flex-1 ">
                          <a
                            onClick={() =>
                              removeWatchList(data.user_watch_list_id)
                            }
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-red-700"
                          >
                            <TrashIcon
                              className="h-5 w-5 text-red-400"
                              aria-hidden="true"
                            />
                            Remove
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
                        Insert watch list
                      </Dialog.Title>
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Name
                          </label>
                          <div className="mt-2">
                            <input
                              value={watchListName}
                              onChange={(event) =>
                                setWatchListName(event.target.value)
                              }
                              type="text"
                              name="street-address"
                              id="street-address"
                              autoComplete="street-address"
                              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {watchListNameError && (
                              <div className="text-red-700 block text-sm font-medium leading-6">
                                {watchListNameError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => insertWatchList()}
                        >
                          Submit
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </main>
      )}
    </>
  );
}

export default watchList;
