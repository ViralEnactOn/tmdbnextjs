import React from "react";
import Sort from "../components/movie/Sort";
import WhereToWatch from "../components/movie/WhereToWatch";
import Filters from "../components/movie/Filters";
import MainContainer from "../components/movie/MainContainer";
import Heading from "../components/movie/Heading";
import HeadingHOC from "../components/HOC/HeadingHOC";

export default function page() {
  return (
    <>
      <main className="min-w-max flex justify-center bg-#000 font-sans flex-shrink-0">
        <div className="container ">
          <HeadingHOC />
          <div className="grid grid-cols-12 mt-10">
            {/* Sidebar */}
            <div className="col-span-12  sm:col-span-3 xs:col-span-12">
              <div className="font-semibold text-xl">Popular Movie</div>
              <Sort />
              {/* <WhereToWatch /> */}
              <Filters />
            </div>
            {/* Main Component */}
            <div className="col-span-9 sm:col-span-9 xs:col-span-12">
              {/* <MainContainerComponent /> */}
              <MainContainer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
