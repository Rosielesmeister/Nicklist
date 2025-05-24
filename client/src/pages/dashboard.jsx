import React, { useEffect, useState } from "react";
import { postsAPI } from "../api/api";
import PostCard from "../components/PostCard";

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
