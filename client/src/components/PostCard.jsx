import React from "react";
import PostCard from "../components/PostCard";
import MessageForm from "../pages/MessageForm";
import MessageList from "../components/MessageList";
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
            <div key={post._id}>
              {/* Render the post card */}
              <PostCard
                post={post}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              {/* Messaging components for this post */}
              <MessageForm recipientId={post.user._id} productId={post._id} />
              <MessageList productId={post._id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
