export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  // apiKey and apiSecret should NOT be used on the client side for security reasons
  // Remove them from the client bundle
};

// Function to delete images from Cloudinary (optional)
export const deleteFromCloudinary = async (publicId) => {
  try {
    // This should typically be done from your backend for security
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};