// components/ProductCard.jsx - Updated with better image handling
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';

const ProductCard = ({ product, onViewDetails, showActions = false, onEdit, onDelete }) => {
    if (!product) return null;

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(product);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(product);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(product);
    };

    // Function to get a valid image URL
    const getValidImageUrl = (image) => {
        if (!image || !image.url) return null;
        
        // If it's already a full URL, return as is
        if (image.url.startsWith('http')) {
            return image.url;
        }
        
        // If it's a Cloudinary public_id, construct the full URL
        if (image.public_id) {
            return `https://res.cloudinary.com/doaoflgje/image/upload/${image.public_id}`;
        }
        
        // Fallback
        return image.url;
    };

    // Create a placeholder image data URL
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

    const imageUrl = product.images && product.images.length > 0 
        ? getValidImageUrl(product.images[0]) 
        : null;

    return (
        <Card className="h-100 shadow-sm border-0 product-card" style={{ cursor: 'pointer' }}>
            {/* Image Section */}
            <div 
                style={{ height: '200px', backgroundColor: '#f8f9fa', position: 'relative' }} 
                className="d-flex align-items-center justify-content-center"
                onClick={handleViewDetails}
            >
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="card-img-top"
                        onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.src = placeholderImage;
                        }}
                    />
                ) : (
                    <img 
                        src={placeholderImage}
                        alt="No image available"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="card-img-top"
                    />
                )}
                
                {/* Favorite Button Overlay */}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <FavoriteButton productId={product._id} size="sm" />
                </div>

                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <Badge bg={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Available' : 'Sold'}
                    </Badge>
                </div>
            </div>

            <Card.Body className="d-flex flex-column">
                <div onClick={handleViewDetails} className="flex-grow-1">
                    {/* Title and Price */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6 mb-0 text-truncate" style={{ maxWidth: '70%' }}>
                            {product.name}
                        </Card.Title>
                        <strong className="text-primary fs-5">
                            ${product.price?.toLocaleString()}
                        </strong>
                    </div>

                    {/* Category */}
                    <div className="mb-2">
                        <Badge bg="light" text="dark" className="me-2">
                            {product.category}
                        </Badge>
                        <Badge bg="outline-secondary" className="text-muted">
                            {product.region}
                        </Badge>
                    </div>

                    {/* Description */}
                    <Card.Text className="text-muted small mb-2">
                        {product.description?.length > 80 
                            ? `${product.description.substring(0, 80)}...` 
                            : product.description}
                    </Card.Text>

                    {/* Location */}
                    <div className="text-muted small mb-2">
                        📍 {product.city}, {product.state}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-2">
                    <div className="d-flex gap-2">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="flex-grow-1"
                            onClick={handleViewDetails}
                        >
                            View Details
                        </Button>
                        
                        {showActions && (
                            <>
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;