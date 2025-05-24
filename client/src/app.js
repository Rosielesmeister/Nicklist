// src/App.js - Complete usage example
import React, { useState } from "react";
import CloudinaryUploadWidget from "./components/CloudinaryUploadWidget";
import ImageUploader from "./components/ImageUploader";
import useCloudinaryUpload from "./hooks/useCloudinaryUpload";
import { getThumbnailUrl, getOptimizedImageUrl } from "./utils/cloudinary";
import "./App.css";

const App = () => {
  const [widgetUploads, setWidgetUploads] = useState([]);
  const [activeTab, setActiveTab] = useState("widget");

  // Using the custom hook for manual uploads
  const {
    uploading,
    progress,
    error,
    uploadedFiles,
    uploadFile,
    removeUploadedFile,
    clearError,
  } = useCloudinaryUpload({
    folder: "my-app-uploads",
    onSuccess: (result) => {
      console.log("Upload successful:", result);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  // Handle widget uploads
  const handleWidgetSuccess = (result) => {
    console.log("Widget upload successful:", result);
    setWidgetUploads((prev) => [...prev, result]);
  };

  const handleWidgetError = (error) => {
    console.error("Widget upload failed:", error);
    alert("Upload failed. Please try again.");
  };

  // Handle manual uploads
  const handleManualUploadSuccess = (result) => {
    // This is handled by the hook automatically
    console.log("Manual upload successful:", result);
  };

  const handleManualUploadError = (error) => {
    // This is handled by the hook automatically
    console.error("Manual upload failed:", error);
  };

  const removeWidgetUpload = (publicId) => {
    setWidgetUploads((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
  };

  const ImageGrid = ({ images, onRemove, title }) => (
    <div className="image-grid-section">
      <h3>
        {title} ({images.length})
      </h3>
      {images.length === 0 ? (
        <p className="no-images">No images uploaded yet</p>
      ) : (
        <div className="image-grid">
          {images.map((image) => (
            <div key={image.public_id} className="image-item">
              <div className="image-container">
                <img
                  src={getThumbnailUrl(image.public_id, 200)}
                  alt="Uploaded"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <button
                    onClick={() => onRemove(image.public_id)}
                    className="remove-btn"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <a
                    href={getOptimizedImageUrl(image.public_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-btn"
                    title="View full size"
                  >
                    👁️
                  </a>
                </div>
              </div>
              <div className="image-info">
                <p className="image-name">
                  {image.original_filename || "Unnamed"}
                </p>
                <p className="image-size">
                  {Math.round(image.bytes / 1024)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cloudinary Image Upload</h1>
        <p>Choose between the widget or manual upload methods</p>
      </header>

      <div className="upload-tabs">
        <button
          className={`tab ${activeTab === "widget" ? "active" : ""}`}
          onClick={() => setActiveTab("widget")}
        >
          Upload Widget
        </button>
        <button
          className={`tab ${activeTab === "manual" ? "active" : ""}`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Upload
        </button>
        <button
          className={`tab ${activeTab === "hook" ? "active" : ""}`}
          onClick={() => setActiveTab("hook")}
        >
          Using Hook
        </button>
      </div>

      <div className="upload-content">
        {activeTab === "widget" && (
          <div className="upload-section">
            <h2>Cloudinary Upload Widget</h2>
            <p>Uses the official Cloudinary widget with built-in UI</p>

            <div className="upload-controls">
              <CloudinaryUploadWidget
                onUploadSuccess={handleWidgetSuccess}
                onUploadError={handleWidgetError}
                buttonText="Choose Image"
                folder="widget-uploads"
              />

              <CloudinaryUploadWidget
                onUploadSuccess={handleWidgetSuccess}
                onUploadError={handleWidgetError}
                buttonText="Upload Multiple"
                multiple={true}
                maxFiles={5}
                folder="widget-uploads"
              />
            </div>

            <ImageGrid
              images={widgetUploads}
              onRemove={removeWidgetUpload}
              title="Widget Uploads"
            />
          </div>
        )}

        {activeTab === "manual" && (
          <div className="upload-section">
            <h2>Manual Image Upload</h2>
            <p>Custom drag-and-drop interface with progress tracking</p>

            <ImageUploader
              onUploadSuccess={handleManualUploadSuccess}
              onUploadError={handleManualUploadError}
              folder="manual-uploads"
            />
          </div>
        )}

        {activeTab === "hook" && (
          <div className="upload-section">
            <h2>Using Custom Hook</h2>
            <p>Programmatic upload using the useCloudinaryUpload hook</p>

            {error && (
              <div className="error-message">
                <p>Upload Error: {error.message}</p>
                <button onClick={clearError}>Clear Error</button>
              </div>
            )}

            <div className="hook-upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) uploadFile(file);
                }}
                disabled={uploading}
              />

              {uploading && (
                <div className="upload-status">
                  <p>Uploading... {Math.round(progress)}%</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <ImageGrid
              images={uploadedFiles}
              onRemove={removeUploadedFile}
              title="Hook Uploads"
            />
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>Your Cloudinary configuration is set up with:</p>
        <pre>
          {`REACT_APP_CLOUDINARY_CLOUD_NAME=doaoflgje
REACT_APP_CLOUDINARY_UPLOAD_PRESET=nicklist`}
        </pre>
        <p></p>
      </footer>
    </div>
  );
};

export default App;
