import React, { useEffect, useRef, useState } from "react";
import { CLOUDINARY_CONFIG } from "../utils/cloudinary";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


const CloudinaryUploadWidget = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  maxFiles = 1,
  folder = "uploads",
  buttonText = "Upload Image",
  disabled = false,
}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.onload = () => initializeWidget();
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }
  }, []);

  const initializeWidget = () => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        multiple: multiple,
        maxFiles: maxFiles,
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
        maxFileSize: 10000000, // 10MB
        folder: folder,
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: "limit",
            quality: "auto:good",
          },
        ],
        sources: ["local", "url", "camera"],
        showAdvancedOptions: false,
        cropping: true,
        croppingAspectRatio: 1,
        theme: "minimal",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setIsLoading(false);
          onUploadSuccess?.(result.info);
        } else if (error) {
          setIsLoading(false);
          console.error("Cloudinary upload error:", error);
          onUploadError?.(error);
        }

        // Handle other events
        if (result?.event === "abort" || result?.event === "close") {
          setIsLoading(false);
        }
      }
    );
  };

  const openWidget = () => {
    if (widgetRef.current) {
      setIsLoading(true);
      widgetRef.current.open();
    }
  };

  return (
    <button
      onClick={openWidget}
      disabled={disabled || isLoading || !widgetRef.current}
      className={`cloudinary-upload-btn ${isLoading ? "loading" : ""}`}
      type="button"
    >
      {isLoading ? "Uploading..." : buttonText}
    </button>
  );
};

export default CloudinaryUploadWidget;
