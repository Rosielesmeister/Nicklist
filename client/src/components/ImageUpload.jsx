import React, { useState, useRef } from 'react';
import { Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  cloudName = "doaoflgje", 
  uploadPreset = "nicklist" 
}) => {


  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + images.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadedImages = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedImages];
      onImagesChange(newImages);
    } catch (error) {
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="image-upload-container">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Upload Button */}
      <div className="mb-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        
        <Button
          variant="outline-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="d-flex align-items-center gap-2"
        >
          {uploading ? (
            <>
              <Spinner size="sm" animation="border" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Add Images ({images.length}/{maxImages})
            </>
          )}
        </Button>
        <small className="text-muted d-block mt-1">
          Supported formats: JPG, PNG, GIF. Max {maxImages} images.
        </small>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Row className="g-2">
          {images.map((image, index) => (
            <Col key={index} xs={6} md={4} lg={3}>
              <Card className="position-relative">
                <Card.Img
                  variant="top"
                  src={image.url}
                  style={{ height: '120px', objectFit: 'cover' }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                  onClick={() => removeImage(index)}
                  style={{ width: '30px', height: '30px' }}
                >
                  <X size={14} />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {images.length === 0 && (
        <Card className="text-center py-4" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body>
            <ImageIcon size={48} className="text-muted mb-2" />
            <p className="text-muted mb-0">No images uploaded yet</p>
            <small className="text-muted">Click "Add Images" to upload photos</small>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
