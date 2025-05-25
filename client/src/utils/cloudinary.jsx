export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "doaoflgje",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "nicklist",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY, // Optional for signed uploads
};

// Validate configuration
export const validateCloudinaryConfig = () => {
  if (
    !CLOUDINARY_CONFIG.cloudName ||
    CLOUDINARY_CONFIG.cloudName === "doaoflgje"
  ) {
    console.warn(
      "Using default cloud name. Set REACT_APP_CLOUDINARY_CLOUD_NAME in your .env file"
    );
  }

  if (
    !CLOUDINARY_CONFIG.uploadPreset ||
    CLOUDINARY_CONFIG.uploadPreset === "nicklist"
  ) {
    console.warn(
      "Using default upload preset. Set REACT_APP_CLOUDINARY_UPLOAD_PRESET in your .env file"
    );
  }
};

// Upload image to Cloudinary with progress tracking
export const uploadImageToCloudinary = async (
  file,
  folder = "uploads",
  onProgress
) => {
  validateCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error?.message || "Upload failed"));
        } catch (error) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    xhr.open("POST", uploadUrl);
    xhr.send(formData);
  });
};

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = "auto",
    height = "auto",
    crop = "fill",
    quality = "auto:good",
    format = "auto",
    ...otherOptions
  } = options;

  const transformations = [];

  // Add basic transformations
  if (width !== "auto" || height !== "auto") {
    transformations.push(`w_${width},h_${height}`);
  }

  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  // Add other transformations
  Object.entries(otherOptions).forEach(([key, value]) => {
    if (value) transformations.push(`${key}_${value}`);
  });

  const transformationString = transformations.join(",");
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

  return transformationString
    ? `${baseUrl}/${transformationString}/${publicId}`
    : `${baseUrl}/${publicId}`;
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId, size = 150) => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto:good",
  });
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (publicId) => {
  return {
    mobile: getOptimizedImageUrl(publicId, {
      width: 480,
      quality: "auto:good",
    }),
    tablet: getOptimizedImageUrl(publicId, {
      width: 768,
      quality: "auto:good",
    }),
    desktop: getOptimizedImageUrl(publicId, {
      width: 1200,
      quality: "auto:good",
    }),
    original: getOptimizedImageUrl(publicId),
  };
};

// Delete image from Cloudinary (requires signed request)
export const deleteImage = async (publicId, signature, timestamp) => {
  if (!CLOUDINARY_CONFIG.apiKey) {
    throw new Error("API key required for delete operations");
  }

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", CLOUDINARY_CONFIG.apiKey);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (cloudinaryUrl) => {
  const regex = /\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : null;
};

// Validate image file
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10000000, // 10MB
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  } = options;

  if (!file) {
    throw new Error("No file provided");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `File type ${
        file.type
      } is not supported. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      `File size (${Math.round(
        file.size / 1000000
      )}MB) exceeds maximum allowed size (${Math.round(maxSize / 1000000)}MB)`
    );
  }

  return true;
};
