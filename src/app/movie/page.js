import React from "react";
import Sort from "../components/Movie/Sort";
import WhereToWatch from "../components/Movie/WhereToWatch";
import Filters from "../components/Movie/Filters";
import MainContainer from "../components/Movie/MainContainer";
import Heading from "../components/Movie/Heading";

export default function page() {
  return (
    <>
      <main className="min-w-max flex justify-center bg-#000 font-sans flex-shrink-0">
        <div className="container ">
          <Heading />
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
