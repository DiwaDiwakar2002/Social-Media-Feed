import React, { useState } from "react";
import axios from "axios";

// Component for adding a new post
const AddNewPost = ({ fetchPosts }) => {
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [content, setContent] = useState("");

  // Function to handle photo uploads
  const uploadPhoto = (e) => {
    const files = e.target.files;
    const data = new FormData();

    // Append each selected file to the FormData object
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    // Send the FormData to the server
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Include credentials (cookies)
      })
      .then((res) => {
        const { data: fileNames } = res;
        // Update the addedPhotos state with the file names
        setAddedPhotos((prev) => [...prev, ...fileNames]);
      })
      .catch((error) => {
        console.error("Error uploading photos:", error);
      });
  };

  // Function to handle the post submission
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/userpost",
        {
          content,
          photos: addedPhotos,
        },
        {
          withCredentials: true,
        }
      );

      // Clear input fields after successful post
      setContent("");
      setAddedPhotos([]);
      fetchPosts(); // Fetch posts to update the feed
    } catch (error) {
      console.error("Error in posting", error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h3 className="text-xl font-medium">Add new post</h3>

      <form onSubmit={handlePost}>
        <div>
          <input
            type="text"
            name="content"
            value={content}
            placeholder="Enter your description"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          {addedPhotos.length > 0 &&
            addedPhotos.map((photo, index) => (
              <div key={index}>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={"http://localhost:3001/uploads/" + photo}
                    alt="uploaded photo"
                    className="mt-3 rounded-lg"
                  />
                </div>
                <h2 className="my-3 text-lg font-medium">{content}</h2>
              </div>
            ))}
        </div>
        <div className="flex justify-between gap-2">
          <label className="flex justify-center w-full cursor-pointer border text-center border-primary bg-transparent rounded-md px-5 py-2 text-primary gap-1 font-medium">
            <input
              type="file"
              multiple
              className="hidden"
              name="addedPhotos"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
            Image
          </label>
          <button
            className="bg-primary text-white px-5 py-2 rounded-md"
            type="submit"
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
      </form>
    </div>
  );
};

export default AddNewPost;
