import { useState } from "react";
import ReactStars from "react-stars";
import config from "../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function RatingSection({ movie_id }) {
  const [plotValue, setPlotValue] = useState(0);
  const [actionValue, setActionValue] = useState(0);
  const [visualValue, setVisualValue] = useState(0);
  const [dialogValue, setDialogValue] = useState(0);
  const [musicValue, setMusicValue] = useState(0);
  const [structureValue, setStructureValue] = useState(0);
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
  const notifySuccess = (message) =>
    toast.success(`${message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const handleInsertRating = async (movie_id) => {
    const authToken = localStorage.getItem("authToken");
    const insertRecord = [
      { type: "Plot", rating: plotValue },
      { type: "Acting and Direction", rating: actionValue },
      { type: "Visuals and Effects", rating: visualValue },
      { type: "Writing and Dialog", rating: dialogValue },
      { type: "Sound and Music", rating: musicValue },
      { type: "Pacing and Structure", rating: structureValue },
    ];

    try {
      const responses = await Promise.all(
        insertRecord.map(async (item) => {
          return await fetch(`${config.app.base_url}/rating/insert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: authToken,
              movie_id: movie_id,
              type: item.type,
              rating: item.rating,
            }),
          });
        })
      );

      const successResponses = responses.filter((response) => response.ok);
      if (successResponses.length === insertRecord.length) {
        const data = await Promise.all(
          successResponses.map((response) => response.json())
        );
        notifySuccess("All ratings inserted successfully");
        setPlotValue(0);
        setActionValue(0);
        setVisualValue(0);
        setDialogValue(0);
        setMusicValue(0);
        setStructureValue(0);
      } else {
        const errorResponse = responses.find((response) => !response.ok);
        const res = await errorResponse.json();
        if (res.message) {
          notify(res.message);
        }
        console.error("Error inserting ratings");
      }
    } catch (error) {
      console.error("Error inserting ratings:", error);
    }
  };

  return (
    <>
      <ul role="list">
        <li className="overflow-hidden rounded-xl border border-gray-200">
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Plot</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={plotValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setPlotValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Acting and Direction</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={actionValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setActionValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Visuals and Effects</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={visualValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setVisualValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Writing and Dialog</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={dialogValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setDialogValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Sound and Music</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={musicValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setMusicValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Pacing and Structure</dt>
              <dd className="text-gray-700">
                <ReactStars
                  value={structureValue}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  onChange={(e) => setStructureValue(e)}
                />
              </dd>
            </div>
            <div className="flex justify-end gap-x-4 py-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => handleInsertRating(movie_id)}
              >
                Submit
              </button>
            </div>
          </dl>
        </li>
      </ul>
    </>
  );
}
