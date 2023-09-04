"use client";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useRecoilState } from "recoil";
import { sortType } from "@/app/atoms/atoms";
const people = [
  { name: "Popularity Descending", value: "popularity.desc" },
  { name: "Popularity Ascending", value: "popularity.asc" },
  { name: "Rating Descending", value: "vote_average.desc" },
  { name: "Rating Ascending", value: "vote_average.asc" },
  { name: "Release Date Descending", value: "primary_release_date.desc" },
  { name: "Title (A-Z)", value: "title.asc" },
  { name: "Title (Z-A)", value: "title.desc" },
];
function Sort() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(people[0]);
  const [sort, setSort] = useRecoilState(sortType);

  // Handle open / close
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  // Handle Selected filter
  const handleSelectedChange = (value) => {
    setSelected(value);
    setSort(value);
  };

  return (
    <div className="relative p-3 bg-white rounded-lg mt-5 drop-shadow-2xl ">
      <div className="flex justify-between " onClick={() => handleIsOpen()}>
        <div className="font-semibold">Sort</div>
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
          <div className="border-t-2 mt-2 pt-2 text-gray-400">
            Sort Results By
          </div>

          <div className="top-16">
            <Listbox
              value={selected}
              onChange={(value) => {
                handleSelectedChange(value);
              }}
            >
              <div className="relative mt-1 ">
                <Listbox.Button className="w-full relative cursor-default rounded-lg bg-gray-400 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate  text-sm">
                    {selected.name}
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
                  <Listbox.Options className=" text-sm  mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {people.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-2  ${
                            active ? "bg-blue-300 text-white" : "text-gray-900"
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
                              {person.name}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </>
      )}
    </div>
  );
}

export default Sort;
