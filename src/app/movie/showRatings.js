import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import config from "../config/config";

function ShowRatings({ movie_id }) {
  const [ratingData, setRatingData] = useState([]);
  useEffect(() => {
    handleFetchRating(movie_id);
  }, []);

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
  return (
    <ul role="list">
      <li className="overflow-hidden rounded-xl border border-gray-200">
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          {ratingData &&
            ratingData.length !== 0 &&
            ratingData.map((rating) => {
              return (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">{rating.type}</dt>
                  <dd className="text-gray-700">
                    <ReactStars
                      value={rating.average_rating}
                      count={5}
                      size={24}
                      color2={"#ffd700"}
                      edit={false}
                    />
                  </dd>
                </div>
              );
            })}
        </dl>
      </li>
    </ul>
  );
}

export default ShowRatings;
