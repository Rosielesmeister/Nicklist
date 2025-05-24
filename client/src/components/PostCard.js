import React from "react";

const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.images && post.images.length > 0 && (
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span className="bg-gray-200 px-2 py-1 rounded">{post.category}</span>
          <span>{post.region}</span>
        </div>

        {post.price && (
          <p className="text-lg font-bold text-green-600 mb-3">${post.price}</p>
        )}

        {showActions && (
          <>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
              <span>Created: {formatDate(post.createdAt)}</span>
              <span
                className={`px-2 py-1 rounded ${
                  post.status === "active"
                    ? "bg-green-100 text-green-800"
                    : post.status === "sold"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {post.status}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(post._id)}
                className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post._id)}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
