import React, { useEffect, useState } from "react";
import config from "../config/config";
function CommentsSection({ movieId }) {
  // State to store replies for each comment
  const [comments, setComments] = useState([]);
  const [nestedComment, setNestedComment] = useState(false);
  const [selectedNestedIndex, setSelectedNestedIndex] = useState(-1);
  const [normalComment, setNormalComment] = useState("");
  const [nestedCommentValue, setNestedCommentValue] = useState("");
  const [commentError, setCommentError] = useState("");
  const [normalCommentError, setNormalCommentError] = useState("");

  useEffect(() => {
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

  const handleNestedComment = (index) => {
    setNestedComment(!nestedComment);
    if (selectedNestedIndex === index) {
      setSelectedNestedIndex(-1);
    } else {
      setSelectedNestedIndex(index);
    }
  };

  const handleSubmitNestedComment = async (id, movie_id) => {
    if (nestedCommentValue.length === 0) {
      setCommentError("Comment cannot empty");
      return;
    } else {
      setCommentError("");
    }
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
    if (normalCommentError.length === 0) {
      setNormalCommentError("Comment cannot empty");
      return;
    } else {
      setNormalCommentError("");
    }
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

  const renderComments = (comments, parentCommentId = null) => {
    return (
      <div>
        {comments
          .filter(
            (comment) =>
              comment.user_comment_parent_comment_id === parentCommentId
          )
          .map((comment, index) => (
            <div
              className="m-2.5 p-2.5 border-2 border-solid border-b-gray-300 rounded-lg"
              key={comment.user_comment_id}
            >
              <div className="mb-2">
                <p className="font-bold text-[#666]">{comment.user_name}</p>
              </div>
              <div className="comment-body">
                <p className="text-[#666]">{comment.user_comment_text}</p>
              </div>
              <div class="w-full flex justify-start  my-3">
                <input
                  type="submit"
                  class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 "
                  value="Reply"
                  onClick={() => handleNestedComment(comment.user_comment_id)}
                />
              </div>
              {nestedComment &&
                selectedNestedIndex === comment.user_comment_id && (
                  <div>
                    <div className="w-full px-3 mb-2 mt-6">
                      <textarea
                        className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
                        name="body"
                        placeholder="Comment"
                        value={nestedCommentValue}
                        onChange={(e) => {
                          setNestedCommentValue(e.target.value);
                        }}
                        required
                      ></textarea>
                      {commentError && (
                        <div className="text-red-700 block text-sm font-medium leading-6">
                          {commentError}
                        </div>
                      )}
                    </div>
                    <div className="w-full flex justify-end px-3 my-3">
                      <input
                        type="submit"
                        onClick={() =>
                          handleSubmitNestedComment(
                            comment.user_comment_id,
                            movieId
                          )
                        }
                        className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 "
                        value="Post Comment"
                      />
                    </div>
                  </div>
                )}
              {renderComments(comments, comment.user_comment_id)}{" "}
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      {comments.length !== 0 && <div>{renderComments(comments, null)}</div>}

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
        {normalCommentError && (
          <div className="text-red-700 block text-sm font-medium leading-6">
            {normalCommentError}
          </div>
        )}
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
    </>
  );
}

export default CommentsSection;
