import React from "react";
import PostCard from "../components/PostCard";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


const PostList = ({ posts, showActions, onEdit, onDelete }) => {
  const filteredPosts = posts.filter((post) => post.isActive); // Example filter

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No active posts found.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
