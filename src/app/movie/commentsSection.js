import React, { useEffect, useState } from "react";
import config from "../config/config";
function CommentsSection({ movieId }) {
  // State to store replies for each comment
  const [comments, setComments] = useState([]);
  const [rootComment, setRootComment] = useState(false);
  const [nestedComment, setNestedComment] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedNestedIndex, setSelectedNestedIndex] = useState(-1);
  const [normalComment, setNormalComment] = useState("");
  const [nestedCommentValue, setNestedCommentValue] = useState("");

  useEffect(() => {
    // Fetch comments for the movie based on movieId
    handleFetchComment(movieId);
  }, [movieId]);

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
        setComments(data.comment);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleRootComment = (index) => {
    setRootComment(!rootComment);
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleNestedComment = (index) => {
    setNestedComment(!nestedComment);
    if (selectedNestedIndex === index) {
      setSelectedNestedIndex(-1);
    } else {
      setSelectedNestedIndex(index);
    }
  };

  const handleSubmitNestedComment = async (id, movie_id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/comment/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          movie_id: movie_id,
          comment: nestedCommentValue,
          parent_comment_id: id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await handleFetchComment(movieId);
        setNestedCommentValue("");
        setSelectedNestedIndex(-1);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  const handleSubmitNormalComment = async (movie_id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${config.app.base_url}/comment/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authToken,
          movie_id: movie_id,
          comment: normalComment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        setNormalComment("");
        await handleFetchComment(movieId);
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };

  // const handleCheck = () => {
  //   if (comments.length !== 0) {
  //     comments.map((item) => {
  //       if (item.user_comment_parent_comment_id) {
  //         comments.map((data) => {
  //           if (item.user_comment_parent_comment_id === data.user_comment_id) {
  //             console.log({ data });
  //           }
  //         });
  //       }
  //     });
  //   }
  // };
  // handleCheck();

  return (
    <>
      <div class=" bg-white rounded-lg border p-1 md:p-3 m-10">
        <h3 class="font-semibold p-1">Comments</h3>
        <div class="flex flex-col gap-5 m-3">
          <div>
            {/* Root Comment */}
            {comments && comments.length !== 0 && (
              <>
                {comments.map((item, index) => {
                  return (
                    <>
                      {item.user_comment_parent_comment_id === null && (
                        <>
                          <div class="flex w-full justify-between border rounded-md my-5">
                            <div class="p-3">
                              <div class="flex gap-3 items-center">
                                <h3 class="font-bold">{item.user_name}</h3>
                              </div>
                              <p class="text-gray-600 mt-2">
                                {item.user_comment_text}
                              </p>
                              <button
                                class="text-right text-blue-500"
                                onClick={() => handleRootComment(index)}
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                          {rootComment && selectedIndex === index && (
                            <>
                              <div class="w-full px-3 mb-2 mt-6">
                                <textarea
                                  class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
                                  name="body"
                                  placeholder="Comment"
                                  value={nestedCommentValue}
                                  onChange={(e) => {
                                    setNestedCommentValue(e.target.value);
                                  }}
                                  required
                                ></textarea>
                              </div>

                              <div class="w-full flex justify-end px-3 my-3">
                                <input
                                  type="submit"
                                  class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 "
                                  value="Post Comment"
                                  onClick={() => {
                                    handleSubmitNestedComment(
                                      item.user_comment_id,
                                      movieId
                                    );
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {item.user_comment_parent_comment_id !== null && (
                        <>
                          <div class="text-gray-300 font-bold pl-14">|</div>
                          <div class="flex justify-between border ml-5  rounded-md">
                            <div class="p-3">
                              <div class="flex gap-3 items-center">
                                <h3 class="font-bold">{item.user_name}</h3>
                              </div>
                              <p class="text-gray-600 mt-2">
                                {item.user_comment_text}
                              </p>
                              <button
                                class="text-right text-blue-500"
                                onClick={() => handleNestedComment(index)}
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                          {nestedComment && selectedNestedIndex === index && (
                            <>
                              <div class="w-full px-3 mb-2 mt-6">
                                <textarea
                                  class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
                                  name="body"
                                  placeholder="Comment"
                                  value={nestedCommentValue}
                                  onChange={(e) => {
                                    setNestedCommentValue(e.target.value);
                                  }}
                                  required
                                ></textarea>
                              </div>

                              <div class="w-full flex justify-end px-3 my-3">
                                <input
                                  type="submit"
                                  onClick={() =>
                                    handleSubmitNestedComment(
                                      item.user_comment_id,
                                      movieId
                                    )
                                  }
                                  class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 "
                                  value="Post Comment"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
        {/* Normal Comment */}
        <div class="w-full px-3 mb-2 mt-6">
          <textarea
            class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
            name="body"
            placeholder="Comment"
            value={normalComment}
            onChange={(e) => {
              setNormalComment(e.target.value);
            }}
            required
          ></textarea>
        </div>

        <div class="w-full flex justify-end px-3 my-3">
          <input
            type="submit"
            class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 "
            value="Post Comment"
            onClick={() => {
              handleSubmitNormalComment(movieId);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default CommentsSection;
