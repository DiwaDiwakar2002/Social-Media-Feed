import React, { useState } from "react";
import axios from "axios";

const AddNewPost = () => {
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [content, setContent] = useState("");

  const uploadPhoto = (e) => {
    const files = e.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Include credentials (cookies)
      })
      .then((res) => {
        const { data: fileNames } = res;
        setAddedPhotos((prev) => [...prev, ...fileNames]);
      })
      .catch((error) => {
        console.error("Error uploading photos:", error);
      });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/userpost",
        {
          content,
          photos: addedPhotos,
        },
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      console.log("Post created successfully:", res.data);
    } catch (error) {
      console.error("Error in posting", error);
    }
  };


  return (
    <div>
      <form onSubmit={handlePost}>
        <div>
          <input
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          {addedPhotos.length > 0 &&
            addedPhotos.map((photo, index) => (
              <div key={index} className="">
                <img
                  src={"http://localhost:3001/uploads/" + photo}
                  alt="uploaded photo"
                  className="w-40"
                />
                <h2>{content}</h2>
              </div>
            ))}
        </div>
        <div className="flex justify-between">
          <label className="cursor-pointer border text-center border-primary bg-transparent rounded-2xl p-8 text-primary">
            <input
              type="file"
              multiple
              className="hidden"
              name="addedPhotos"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
          </label>
          <button className="primary" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewPost;
