import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Context } from "../UserContext";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null); // Track post id for comment input
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts
  const [sortOption, setSortOption] = useState("default"); // Track selected sort option
  const { user } = useContext(Context);

  const handleToggleCommentInput = (postId) => {
    setCommentingPostId(postId === commentingPostId ? null : postId);
  };

  const handleComment = async (postId) => {
    if (!newComment) return;

    const payloadData = {
      comment: newComment,
      author: user.name,
    };

    try {
      const response = await axios.post(`/add-comments/${postId}`, payloadData);
      if (response.status === 200) {
        setNewComment("");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comment: [...post.comment, response.data] }
              : post
          )
        );
        setCommentingPostId(null);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLike = async (postId) => {
    const isLiked = posts.find((post) => post._id === postId).likes.includes(user.id);

    // Optimistically update the UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== user.id)
                : [...post.likes, user.id],
            }
          : post
      )
    );

    try {
      const payload = {
        userId: user.id,
      };
      const response = await axios.post(`/post-like/${postId}`, payload);
      if (response.status === 200) {
        const updatedPost = response.data.postVO;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const fetchPosts = async () => {
    const { data } = await axios.get("/user-data");
    const postDoc = await axios.get(`/post-data/${data._id}`);
    setPosts(postDoc.data.post); // Assuming postDoc.data is the single post object
  };

  useEffect(() => {
    try {
      fetchPosts();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortPosts = (posts, option) => {
    if (option === "likes") {
      return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    }
    if (option === "comments") {
      return [...posts].sort((a, b) => b.comment.length - a.comment.length);
    }
    if (option === "latest") {
      return [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (option === "oldest") {
      return [...posts].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    return posts;
  };

  const sortedPosts = sortPosts(posts, sortOption);

  const handlePostDelete = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete?");

    if (!isConfirmed) {
      return;
    }
    try {
      await axios.delete(`/post-delete/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("error in deleting post", error);
    }
  };


  return (
    <section className="flex flex-col mt-10">
      <div>
        <div className="flex justify-between mb-5">
          <div className="flex items-center">
            <h1 className="text-3xl font-medium mb-2">My Posts</h1>
          </div>

          <div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="mb-4"
            >
              <option value="default">Sort</option>
              <option value="likes">Likes</option>
              <option value="comments">Comments</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto gap-5 columns-1 md:columns-2 lg:columns-3 space-y-5">
        {sortedPosts.length == 0 ? (
            <div className="">
              <div class="animate-pulse flex flex-col items-center justify-center gap-4 w-60">
                <div>
                  <div class="w-48 h-6 bg-slate-400 rounded-md"></div>
                  <div class="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
                </div>
                <div class="h-7 bg-slate-400 w-full rounded-md"></div>
                <div class="h-7 bg-slate-400 w-full rounded-md"></div>
                <div class="h-7 bg-slate-400 w-full rounded-md"></div>
                <div class="h-7 bg-slate-400 w-1/2 rounded-md"></div>
              </div>
      
            </div>
          ) : (
          sortedPosts.map((post, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md break-inside-avoid"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold text-xl my-1">{user.name}</h2>
                <button onClick={() => handlePostDelete(post._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-red-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-hidden object-cover rounded-lg">
                {post.photos.length > 0 && (
                  <img
                    src={`http://localhost:3001/uploads/${post.photos[0]}`}
                    className=""
                    alt="Post"
                  />
                )}
              </div>
              <p>{post.content}</p>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <button
                    className="bg-transparent"
                    onClick={() => handleLike(post._id)}
                  >
                    {post.likes.includes(user.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-primary"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    )}
                  </button>
                  <span>{post.likes.length} Likes</span>
                </div>
                <div
                  className="ml-4 flex flex-col cursor-pointer"
                  onClick={() => handleToggleCommentInput(post._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.148 9-7.032 0-3.882-4.03-7.03-9-7.03-4.97 0-9 3.148-9 7.03 0 1.735.693 3.34 1.852 4.578-.47 1.588-1.678 2.678-1.805 2.78a.348.348 0 0 0 .207.624c.702 0 2.61-.177 4.32-1.303A10.937 10.937 0 0 0 12 20.25z"
                    />
                  </svg>
                  <span>{post.comment.length} Comments</span>
                </div>
              </div>
              <small className="text-gray-600">
                {formatDistanceToNow(parseISO(post.createdAt))} ago
              </small>
              {commentingPostId === post._id && (
                <div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 border rounded"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="mt-2 px-4 py-2 text-primary rounded my-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                    </button>
                  </div>
                  <div className="commentDiv">
                    {post.comment.map((commentData, commentIndex) => (
                      <div
                        key={commentIndex}
                        className="border px-3 py-2 my-2 rounded-lg"
                      >
                        <div className="flex gap-1">
                          <p className="font-semibold">{commentData.author}:</p>
                          <p>{commentData.comment}</p>
                        </div>
                        <small className="text-gray-600">
                          {formatDistanceToNow(parseISO(commentData.date))} ago
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )))}
        </div>
      </div>
    </section>
  );
};

export default UserPosts;
