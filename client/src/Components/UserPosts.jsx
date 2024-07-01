import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Context } from "../UserContext";

const UserPosts = () => {
  // State to hold posts
  const [posts, setPosts] = useState([]);
  // State to hold new comment input
  const [newComment, setNewComment] = useState("");
  // State to track which post's comment input is visible
  const [commentingPostId, setCommentingPostId] = useState(null);
  // State to track liked posts
  const [likedPosts, setLikedPosts] = useState(new Set());
  // State to track selected sort option
  const [sortOption, setSortOption] = useState("default");
  // Retrieve the user from context
  const { user } = useContext(Context);

  // Toggle comment input visibility for a post
  const handleToggleCommentInput = (postId) => {
    setCommentingPostId(postId === commentingPostId ? null : postId);
  };

  // Handle adding a new comment to a post
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

  // Handle liking/unliking a post
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
      const payload = { userId: user.id };
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

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/user-data");
      const postDoc = await axios.get(`/post-data/${data._id}`);
      setPosts(postDoc.data.post); // Assuming postDoc.data is the single post object
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle sorting option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort posts based on selected option
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

  // Handle deleting a post
  const handlePostDelete = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete?");

    if (!isConfirmed) {
      return;
    }
    try {
      await axios.delete(`/post-delete/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post", error);
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
          {sortedPosts.length === 0 ? (
            <div className="">
              <div className="animate-pulse flex flex-col items-center justify-center gap-4 w-60">
                <div>
                  <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                  <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
                </div>
                <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
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

                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(parseISO(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <p className="mt-3 text-gray-800">{post.content}</p>

                <div className="rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                  {post.photos.length > 0 && (
                    <img
                      src={post.photos[0]}
                      alt="Post photo"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>

                <div className="flex gap-8 mt-5">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="inline-flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.001 4.529c2.349-2.22 6.147-2.038 8.31.38 2.18 2.437 2.148 6.444-.071 8.861l-6.942 7.217a1.202 1.202 0 0 1-1.752 0l-6.942-7.217C1.541 11.353 1.574 7.347 3.755 4.91c2.163-2.418 5.961-2.6 8.31-.38ZM6.558 5.968c-1.585 1.772-1.612 4.683.055 6.364l6.389 6.645 6.389-6.645c1.667-1.68 1.64-4.592.054-6.364-1.606-1.796-4.329-1.932-6.08-.12l-.93.996a1.2 1.2 0 0 1-1.773 0l-.929-.996c-1.752-1.812-4.475-1.676-6.08.12Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{post.likes.length}</span>
                  </button>
                  <button
                    onClick={() => handleToggleCommentInput(post._id)}
                    className="inline-flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.934 4.75A2.75 2.75 0 0 0 3.25 7.5v6.75a2.75 2.75 0 0 0 2.75 2.75h5.185l4.108 3.429a.75.75 0 0 0 1.207-.579V17h1.266a2.75 2.75 0 0 0 2.75-2.75V7.5a2.75 2.75 0 0 0-2.75-2.75H5.934Zm.75 1.5h12.332c.69 0 1.25.56 1.25 1.25v6.75c0 .69-.56 1.25-1.25 1.25h-1.266a.75.75 0 0 0-.75.75v2.426l-3.415-2.85a.75.75 0 0 0-.48-.176H5.934a1.25 1.25 0 0 1-1.25-1.25V7.5c0-.69.56-1.25 1.25-1.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{post.comment.length}</span>
                  </button>
                </div>

                {commentingPostId === post._id && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        className="border border-gray-300 rounded-lg px-3 py-2 flex-grow"
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2"
                      >
                        Post
                      </button>
                    </div>
                    <div className="mt-2">
                      {post.comment.map((comment, commentIndex) => (
                        <div key={commentIndex} className="border-t pt-2">
                          <p className="text-gray-800">{comment.comment}</p>
                          <p className="text-xs text-gray-500">
                            - {comment.author}{" "}
                            {formatDistanceToNow(parseISO(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default UserPosts;
