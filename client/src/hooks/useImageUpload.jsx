import { useState } from 'react';
import { cloudinaryConfig } from '../utils/cloudinaryConfig.js.jsx';
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";


export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadImage = async (file) => {
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('cloud_name', cloudinaryConfig.cloudName);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
        width: data.width,
        height: data.height
      };
    } catch (error) {
      setError('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files) => {
    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      setError('Failed to upload one or more images');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    error,
    setError
  };
};
export default useImageUpload;