import React, { useState, useRef } from "react";
import { uploadImageToCloudinary } from "../utils/cloudinary";

const ImageUploader = ({
  onUploadSuccess,
  onUploadError,
  folder = "uploads",
  maxSize = 10000000, // 10MB
  acceptedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedFormats.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }

    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds ${Math.round(maxSize / 1000000)}MB limit`
      );
    }

    return true;
  };

  const handleFileSelect = (file) => {
    try {
      validateFile(file);
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      onUploadError?.(error);
      alert(error.message);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadImageToCloudinary(
        selectedFile,
        folder,
        (progress) => setUploadProgress(progress)
      );

      onUploadSuccess?.(result);
      resetUpload();
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleInputChange}
        style={{ display: "none" }}
        disabled={uploading}
      />

      {!selectedFile ? (
        <div
          className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="dropzone-content">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <p>Drag and drop an image here, or click to select</p>
            <p className="file-info">
              Supported: JPG, PNG, GIF, WebP (max{" "}
              {Math.round(maxSize / 1000000)}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="upload-preview">
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="file-info">
              <p>
                <strong>File:</strong> {selectedFile.name}
              </p>
              <p>
                <strong>Size:</strong> {Math.round(selectedFile.size / 1024)} KB
              </p>
              <p>
                <strong>Type:</strong> {selectedFile.type}
              </p>
            </div>
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}

          <div className="upload-actions">
            <button
              onClick={uploadImage}
              disabled={uploading}
              className="upload-btn primary"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            <button
              onClick={resetUpload}
              disabled={uploading}
              className="upload-btn secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
