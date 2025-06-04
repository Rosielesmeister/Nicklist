import React, { useEffect, useState } from "react";
import { postsAPI } from "../api/api";
import PostCard from "../components/PostCard";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


export default function Dashboard() {
  const [myPosts, setMyPosts] = useState([]);
  useEffect(() => {
    postsAPI.getUserPosts().then((res) => setMyPosts(res.data));
  }, []);
  return (
    <div>
      <h2>My Listings</h2>
      {myPosts.map((post) => (
        <PostCard key={post._id} post={post} showActions={true} />
      ))}
    </div>
  );
}
//this lets users vewi, edit and delete their own posts
