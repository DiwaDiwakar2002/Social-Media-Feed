import React, { useEffect, useState } from "react";
import AddNewPost from "../Components/AddNewPost";
import axios from "axios";

const FeedPage = () => {
  const[post, setPost] = useState([])
  console.log(post)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/post");
      setPost(data);
    };
    fetchData();
  }, []);

  return (
    <section className="w-full flex grow">
      <AddNewPost />
      <div className="w-full flex flex-col gap-4">
        {post.map((post, index) => (
          <div key={index} className="w-full flex flex-col gap-4 p-4">
            <img src={`http://localhost:3001/uploads/${post.photos[0]}`} className="rounded-md" />
            <h2>{post.content}</h2>
            </div>
        ))}
      </div>
    </section>
  );
};

export default FeedPage;
