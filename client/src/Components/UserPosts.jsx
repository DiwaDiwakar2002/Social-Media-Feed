import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
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
        console.log("Comment Posted Successfully");
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
    try {
      const payload = {
        userId: user.email,
      };

      const isLiked = likedPosts.has(postId);
      const updatedLikedPosts = new Set(likedPosts);

      if (isLiked) {
        updatedLikedPosts.delete(postId);
      } else {
        updatedLikedPosts.add(postId);
      }
      setLikedPosts(updatedLikedPosts);

      await axios.post(`/post-like/${postId}`, payload);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== user.email)
                  : [...post.likes, user.email],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axios.get("/user-data");
        const postDoc = await axios.get(`/post-data/${data._id}`);
        setPosts(postDoc.data.post); // Assuming postDoc.data is the single post object
      };
      fetchData();
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

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "dd/MMMM/yyyy");
  };

  return (
    <section className="flex flex-col mt-10">
      <div>
        <div className="flex justify-between mb-5">
          <div className="flex items-center">
            <h1 className="text-3xl font-medium mb-2">My Posts</h1>
          </div>

          <div >
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
        {/* <h1 className="text-3xl font-medium">Feed</h1> */}
        <div className="w-full max-w-5xl mx-auto gap-5 columns-1 md:columns-2 lg:columns-3 space-y-5">
          {sortedPosts.map((post, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md break-inside-avoid"
            >
              <h2 className="font-bold text-xl my-1">
                {user.name}
              </h2>
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
                    {likedPosts.has(post._id) ? (
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
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-primary"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    )}
                  </button>
                  <span>{post.likes.length} Likes</span>
                </div>
                <div
                  className="ml-4 cursor-pointer"
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
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                    />
                  </svg>
                  <span className="ml-1">{post.comment.length} Comments</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(post.createdAt)}
              </p>
              {commentingPostId === post._id && (
                <div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="border rounded-md px-2 py-1 w-full"
                    />
                    <button
                      className="bg-primary text-white px-3 py-1 rounded-md ml-2"
                      onClick={() => handleComment(post._id)}
                    >
                      Post
                    </button>
                  </div>
                  <div>
                    <p className="font-bold">{post.comment.length} Comments</p>
                    {post.comment.map((comment, idx) => (
                      <div key={idx} className="border-b border-gray-300 py-2">
                        <strong>{comment.author}:</strong> {comment.comment}
                        <br />
                        <small>
                          {formatDistanceToNow(parseISO(comment.date), {
                            addSuffix: true,
                          })}
                        </small>{" "}
                        {/* Calculate days ago */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserPosts;