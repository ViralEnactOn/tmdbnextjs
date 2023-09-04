"use client";

import React, { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { ThreeCircles } from "react-loader-spinner";
import config from "@/app/config/config";
import { useRecoilState } from "recoil";
import { countryName, watchProviders } from "@/app/atoms/atoms";

function WhereToWatch() {
  //   const reduxValue = store.getState().example;
  const [isOpen, setIsOpen] = useState(false);
  const [region, setRegion] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [selected, setSelected] = useRecoilState(countryName);
  const [watchProvider, setWatchProvider] = useState([]);
  const [provider, setProvider] = useRecoilState(watchProviders);
  // Filter open / close
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  // Select Country
  const handleWatchCountry = async (value) => {
    let updatedSelectCountry = {
      name: value.english_name ? value.english_name : "India",
      value: value.iso_3166_1 ? value.iso_3166_1 : "IN",
    };
    setSelected(updatedSelectCountry);
    const endPoint = new URL(
      config.tmdb_services.API_URL + "watch/providers/movie"
    );
    const params = new URLSearchParams({
      language: "en-US",
      watch_region: value.iso_3166_1 || "IN",
    });
    endPoint.search = params.toString();
    fetch(endPoint, {
      method: "GET",
      headers: config.tmdb_services.Header,
    }).then(async (res) => {
      const response = await res.json();
      setWatchProvider(response.results);
    });
  };

  // Fetch All Region
  const handleRegion = async () => {
    const endPoint = new URL(
      config.tmdb_services.API_URL + "watch/providers/regions"
    );
    const params = new URLSearchParams({ language: "en-US" });
    endPoint.search = params.toString();
    fetch(endPoint, {
      method: "GET",
      headers: config.tmdb_services.Header,
    }).then(async (res) => {
      const response = await res.json();
      setRegion(response.results);
    });
  };


  // Select watch provider
  const handleSelectedWatchProvider = (id, name) => {
    let updatedSelectedProvider;
    if (selectedProvider.some((provider) => provider.value === id)) {
      updatedSelectedProvider = selectedProvider.filter((v) => v.value !== id);
    } else {
      updatedSelectedProvider = [
        ...selectedProvider,
        { name: name, value: id },
      ];
    }
    setSelectedProvider(updatedSelectedProvider);
    setProvider(updatedSelectedProvider);
  };

  useEffect(() => {
    handleRegion();
    handleWatchCountry("India");
  }, []);

  return (
    <div className="p-3 bg-white rounded-lg mt-5 drop-shadow-2xl">
      <div className="flex justify-between" onClick={() => handleIsOpen()}>
        <div className="font-semibold">Where To Watch</div>
        <div className="flex">
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5 self-center " />
          ) : (
            <ChevronRightIcon className="h-5 w-5 self-center " />
          )}
        </div>
      </div>
      {isOpen && (
        <>
          <div className="border-t-2 mt-2 pt-2 text-gray-400">Country</div>
          {/* Select Country*/}
          <div className="top-16 ">
            <Listbox
              value={selected.value}
              onChange={(value) => handleWatchCountry(value)}
            >
              <div className="relative mt-1 ">
                <Listbox.Button className=" w-full relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-sm">
                    {selected.english_name
                      ? selected.english_name
                      : selected.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="mt-1 max-h-60 text-sm overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {region.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10  ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={` ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.english_name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Select Watch Provider */}
          {watchProvider.length === 0 ? (
            <>
              <div className="flex justify-center mt-5">
                <ThreeCircles
                  height="30"
                  width="30"
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
              <div className="grid grid-cols-5 gap-2 mt-5 sm:grid-cols-4">
                {watchProvider.map((name, index) => {
                  return (
                    <>
                      <div
                        className="relative flex justify-center self-center"
                        key={index}
                      >
                        <img
                          className="rounded-lg lg:h-16 lg:w-16 md:h-10 md:w-10 sm:h-8 sm:w-8 xs:w-12 xs:w-12"
                          src={config.tmdb_services.IMAGE_URL + name.logo_path}
                          alt={name.provider_name}
                        />
                        <div
                          onClick={() =>
                            handleSelectedWatchProvider(
                              name.provider_id,
                              name.provider_name
                            )
                          }
                          className={
                            selectedProvider.some(
                              (selected) => selected.value === name.provider_id
                            )
                              ? "absolute inset-0 selected hover:bg-white rounded-lg transition-colors opacity-70 flex items-center justify-center"
                              : "absolute inset-0 hover:bg-blue-300  rounded-lg transition-colors opacity-70"
                          }
                        >
                          <div
                            className={
                              selectedProvider.some(
                                (selected) =>
                                  selected.value === name.provider_id
                              )
                                ? "flex items-center justify-center"
                                : "hidden"
                            }
                          >
                            <CheckIcon className="rounded-lg lg:h-16 lg:w-16 md:h-10 md:w-10 sm:h-8 sm:w-8 xs:w-12 xs:w-12" />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default WhereToWatch;
