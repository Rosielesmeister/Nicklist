import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { favoritesAPI } from '../api/api';
import { useAuth } from '../hooks/UseAuth';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


const FavoriteButton = ({ productId, size = "sm", variant = "outline-danger" }) => {
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if product is favorited on component mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!user || !productId) return;
            
            try {
                const favorited = await favoritesAPI.isFavorited(productId);
                setIsFavorited(favorited);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [user, productId]);

    const handleToggleFavorite = async (e) => {
        e.stopPropagation(); // Prevent event bubbling
        
        if (!user) {
            alert('Please log in to save favorites!');
            return;
        }

        setLoading(true);
        try {
            if (isFavorited) {
                await favoritesAPI.removeFromFavorites(productId);
                setIsFavorited(false);
            } else {
                await favoritesAPI.addToFavorites(productId);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorites. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Don't show button if user is not logged in
    if (!user) return null;

    return (
        <Button
            variant={isFavorited ? "danger" : variant}
            size={size}
            onClick={handleToggleFavorite}
            disabled={loading}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            {loading ? "..." : (isFavorited ? "❤️" : "🤍")}
        </Button>
    );
};

export default FavoriteButton;